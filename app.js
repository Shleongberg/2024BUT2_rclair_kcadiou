const express = require('express')
const session = require('express-session')
const md5 = require('md5')

const app = express();

const utilisateurs = require('./models/utilisateurs.js')
const produits = require('./models/produits.js');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false}));

app.use(session({
    secret:'testus',
    resave: false,
    saveUninitialized: false
}));

app.use(function(req,res,next){
    if(req.session.userID){
        res.locals.isAuth = true ;
        res.locals.id = req.session.userID ;
    }
    else{
        res.locals.isAuth = false ; 
        res.locals.id = null ; 
    }
    next();
});

app.post('/connexion', async function(req, res) {
    const login = req.body.username;
    let mdp = req.body.password;
    
    mdp = md5(mdp);

    const user = await utilisateurs.checkLogin(login);


    if(user !=false && user.password == mdp){
        req.session.userID = user.id;
        req.session.role = user.type_utilisateur;

        return res.redirect("/compte");
    }
    else{
        res.render("login",{error: "Mauvais login/Mdp"})
    }
});
app.get('/inscription', function(req, res) {
    res.render("inscription", {error : null});
 });

 app.post('/inscription', async function(req, res) {
    const login = req.body.username;
    let mdp = req.body.password;
    let mail = req.body.email;

    mdp = md5(mdp);

    try {
        const userId = await utilisateurs.addUser(login, mail, mdp);
    
        
        const user = await utilisateurs.getUserById(userId);

        if(user && user.password === mdp){
            req.session.userID = user.id;
            req.session.role = user.type_utilisateur;
            req.session.nom = user.nom;
            req.session.prenom = user.prenom;
            return res.redirect("/");
        } else {
            res.render("inscription", {error: "Erreur lors de la création du compte."});
        }
    } catch (error) {
        res.render("inscription", {error: error.message});
    }
});

app.get('/', async function(req, res) {
    res.render("index", {error : null});

});

app.get('/connexion', function(req, res) {
   res.render("login", {error : null});
});

app.get('/compte', async function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/connexion");
    }
    try {
        const users = await utilisateurs.getUserById(req.session.userID);
        
        const user = users[0];  // accès premier user
        
        res.render("compte", { user });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données: ' + err);
    }
});


app.get('/reservation', async function(req, res) {
    if (!req.session.userID){
        return res.redirect("/connexion")
    }
    try{
        const users  = await utilisateurs.getUserById(req.session.userID);
        res.render("reservation",users);
    } catch (err){
        res.status(500).send('Erreur lors de la récupération des données'+ err)
    }});


    app.get('/catalogue', async function (req, res) {
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
    
            const productQuery = "SELECT * FROM produit WHERE id = ?";
            const product = await new Promise((resolve, reject) => {
                database.query(productQuery, [productId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results[0]); 
                });
            });
    
            if (!product) {
                return res.status(404).send('Produit non trouvé');
            }
                res.render("produit", { product });
    
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
