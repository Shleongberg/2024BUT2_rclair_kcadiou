const database = require("./database.js")

async function getUserById (id) {
    sql = "SELECT * FROM utilisateur WHERE id = ?";
    return new Promise((resolve, reject) => {
        database.query(sql, id, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results)
        });
    });
};

async function checkLogin(login) {
    sql = "SELECT * FROM utilisateur WHERE login = ?";
    return new Promise ((resolve, reject) => {
        database.query(sql,login,(err, results) => {
            if (err){
                return reject (err);
            }
            resolve(results[0])
        });
    });
    
}

module.exports = {getUserById, checkLogin};
