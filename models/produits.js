const database = require("./database.js")

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
  }
};

module.exports = produits;