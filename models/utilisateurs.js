const database = require("./database.js")

async function getUserById (id) {
    sql = "SELECT = FROM utilisateur WHERE id = 1";
    return new Promise((resolve, reject) => {
        database.query(sql, (err, results) => {
            if (err) {
                return eject(err);
            }
            resolve(results)
        })
    })
}