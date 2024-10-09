const express = require('express')
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    let data = {
        prenom: "Alice",
        nom: "Dumont"
    };
    res.render("index", data);
})



server.listen(3000, () => {
    console.log('Server running on port 3000');
    });
    

