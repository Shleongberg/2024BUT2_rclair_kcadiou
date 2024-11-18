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
    }
};

module.exports = produits;
