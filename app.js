const express = require('express')
const app = express();

const utilisateurs = require('./models/utilisateurs.js')

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', async function(req, res) {
    try{
        const users  = await utilisateurs.getUserById(1);
        console.log(users);
        res.render("index",users);
    } catch (err){
        console.log(err);
        res.status(500).send('Erreur lors de la récupération des données')
        
    }
})
app.get('/login', async function(req, res) {
    try{
        const users  = await utilisateurs.getUserById(1);
        console.log(users);
        res.render("login",users);
    } catch (err){
        console.log(err);
        res.status(500).send('Erreur lors de la récupération des données')
        
    }
})
app.get('/catalogue', async function(req, res) {
    try{
        const users  = await utilisateurs.getUserById(1);
        console.log(users);
        res.render("catalogue",users);
    } catch (err){
        console.log(err);
        res.status(500).send('Erreur lors de la récupération des données')
        
    }
})

app.get('/produit', async function(req, res) {
    try{
        const users  = await utilisateurs.getUserById(1);
        console.log(users);
        res.render("product",users);
    } catch (err){
        console.log(err);
        res.status(500).send('Erreur lors de la récupération des données')
        
    }
})

app.use((req, res) => {
    res.sendFile("./public/css/style.css", { root: __dirname });
})


app.use((req, res) => {
    res.status(404).render("404");
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


