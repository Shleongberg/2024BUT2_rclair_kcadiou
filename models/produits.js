const database = require("./database.js");

const produits = {
    getAllProducts: function () {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM produit';
            database.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getProductById: function (id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM produit WHERE id = ?';
            database.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]); 
            });
        });
    },

    addProduct: function (nom, marque, modele, description, prix, stock) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO produit (nom, marque, modele, description, prix, stock) VALUES (?, ?, ?, ?, ?, ?)';
            database.query(query, [nom, marque, modele, description, prix, stock], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
};

module.exports = produits;
