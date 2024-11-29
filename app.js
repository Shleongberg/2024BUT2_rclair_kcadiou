const express = require('express');
const session = require('express-session');
const md5 = require('md5');

const app = express();

const utilisateurs = require('./models/utilisateurs.js');
const produits = require('./models/produits.js');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'testus',
    resave: false,
    saveUninitialized: false
}));

// Middleware pour gérer les variables globales
app.use(function(req, res, next) {
    if (req.session.userID) {
        res.locals.isAuth = true;
        res.locals.id = req.session.userID;
        res.locals.role = req.session.role || null; 
    } else {
        res.locals.isAuth = false;
        res.locals.id = null;
        res.locals.role = null;
    }
    next();
});

// Route de connexion
app.post('/connexion', async function(req, res) {
    const login = req.body.username;
    let mdp = req.body.password;
    mdp = md5(mdp);

    const user = await utilisateurs.checkLogin(login);

    if (user != false && user.password === mdp) {
        req.session.userID = user.id;
        req.session.role = user.type_utilisateur;

        return res.redirect("/compte");
    } else {
        res.render("login", { error: "Mauvais login/Mdp" });
    }
});

// Route d'inscription
app.get('/inscription', function(req, res) {
    res.render("inscription", { error: null });
});

app.post('/inscription', async function(req, res) {
    const login = req.body.username;
    let mdp = req.body.password;
    let mail = req.body.email;

    mdp = md5(mdp);

    try {
        const userId = await utilisateurs.addUser(login, mail, mdp);
        const user = await utilisateurs.getUserById(userId);

        if (user && user.password === mdp) {
            req.session.userID = user.id;
            req.session.role = user.type_utilisateur;
            req.session.nom = user.nom;
            req.session.prenom = user.prenom;
            return res.redirect("/");
        } else {
            res.render("inscription", { error: "Erreur lors de la création du compte." });
        }
    } catch (error) {
        res.render("inscription", { error: error.message });
    }
});

app.get('/', async function(req, res) {
    res.render("index", { error: null });
});

// connexion
app.get('/connexion', function(req, res) {
    res.render("login", { error: null });
});

app.get('/compte', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }
    try {
        const users = await utilisateurs.getUserById(req.session.userID);
        const user = users[0]; 
        res.render("compte", { user });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données: ' + err);
    }
});

app.get('/modifier-profil', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }
    try {
        const users = await utilisateurs.getUserById(req.session.userID);
        const user = users[0];
        res.render("modifier_profil", { user, error: null });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données : ' + err);
    }
});


app.post('/modifier-profil', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }

    const { nom, prenom, email, currentPassword, newPassword } = req.body;

    try {
        const user = (await utilisateurs.getUserById(req.session.userID))[0];

        if (md5(currentPassword) !== user.password) {
            throw new Error("Le mot de passe actuel est incorrect.");
        }
        const hashedNewPassword = newPassword ? md5(newPassword) : null;
        await utilisateurs.updateUserProfile(req.session.userID, nom, prenom, email, hashedNewPassword);

        res.redirect('/compte');
    } catch (error) {
        const users = await utilisateurs.getUserById(req.session.userID);
        const user = users[0];
        res.render("modifier_profil", { user, error: error.message });
    }
});


app.get('/reservation', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }
    try {
        const users = await utilisateurs.getUserById(req.session.userID);
        res.render("reservation", users);
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données: ' + err);
    }
});

app.get('/admin', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }

    if (req.session.role !== 'admin' && req.session.role !== 'agent') {
        return res.redirect("/connexion");
    }

    try {
        const agents = await utilisateurs.getAllAgents(); 
        const products = await produits.getAllProducts(); 
        res.render("admin", { agents: agents, products: products, role: req.session.role, message: null });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données: ' + err);
    }
});


app.post('/admin/agents/creer', async function(req, res) {
    if (req.session.role !== 'admin') {
        return res.redirect("/connexion");
    }

    const { login, email, password } = req.body;

    try {
        await utilisateurs.addAgent(login, email, md5(password)); 
        res.redirect('/admin'); 
    } catch (error) {
        res.render("admin", { message: { type: 'error', content: error.message }, agents: await utilisateurs.getAllAgents(), role: req.session.role });
    }
});

app.post('/admin/agents/supprimer', async function(req, res) {
    if (req.session.role !== 'admin') {
        return res.redirect("/connexion");
    }

    const agentId = req.body.id;

    try {
        await utilisateurs.deleteAgent(agentId); 
        res.redirect('/admin'); 
    } catch (error) {
        res.render("admin", { message: { type: 'error', content: error.message }, agents: await utilisateurs.getAllAgents(), role: req.session.role });
    }
});

app.post('/admin/produits/creer', async function(req, res) {
    if (req.session.role !== 'agent') {
        return res.redirect("/connexion");
    }

    const { nom, marque, modele, description, prix, stock } = req.body;

    try {
        await produits.addProduct(nom, marque, modele, description, prix, stock);
        res.redirect('/admin'); 
    } catch (error) {
        res.render("admin", { 
            message: { type: 'error', content: error.message }, 
            agents: await utilisateurs.getAllAgents(), 
            products: await produits.getAllProducts(), 
            role: req.session.role 
        });
    }
});


app.get('/catalogue', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }
    try {
        const products = await produits.getAllProducts();
        res.render("catalogue", { products });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données: ' + err);
    }
});

app.get('/produit/:id', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }
    try {
        const productId = req.params.id;
        const product = await produits.getProductById(productId);
        res.render("product", { product });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données du produit: ' + err);
    }
});

app.get('/deconnexion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Erreur lors de la déconnexion:", err);
            return res.status(500).send("Erreur lors de la déconnexion.");
        }
        res.redirect('/');
    });
});

app.use((req, res) => {
    res.status(404).render("404");
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
