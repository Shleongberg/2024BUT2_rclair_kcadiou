const express = require('express')
const app = express();

const utilisateurs = require('./models/utilisateurs.js')

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', async function(req, res) {
    try{
        const users  = await utilisateurs.getUserById(1);
        res.render("index",users);
    } catch (err){
        res.status(500).send('Erreur lors de la récupération des données')
        
    }
})
app.get('/login', function(req, res) {
   res.render("login");
})
app.get('/catalogue', async function(req, res) {
        res.render("catalogue");
})

app.get('/produit', async function(req, res) {
        res.render("product");
})


app.use((req, res) => {
    res.status(404).render("404");
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


