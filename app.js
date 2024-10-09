const express = require('express')
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    let data = { prenom: "Alice", nom: "Dumont" };
    res.render("index", data);
})

app.use((req, res) => {
    res.status(404).render("404");
})

server.listen(3000, () => {
    console.log('Server running on port 3000');
});


