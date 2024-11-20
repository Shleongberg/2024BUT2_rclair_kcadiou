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
async function addUser(login,mail,password) {  
    const sql = "INSERT INTO utilisateur (login, email, password, type_utilisateur) VALUES (?, ?, ?, 'client')";
    return new Promise((resolve, reject) => {
        database.query(sql, [login, mail, password,], (err, results) => {  
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return reject(new Error('Cet utilisateur ou cet email existe déjà.'));
                }
                return reject(err);
            }
            resolve(results.insertId); 
        });
    });
}

async function addagent(login,mail,password) {  
    const sql = "INSERT INTO utilisateur (login, email, password, type_utilisateur) VALUES (?, ?, ?, 'agent')";
    return new Promise((resolve, reject) => {
        database.query(sql, [login, mail, password,], (err, results) => {  
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return reject(new Error('Cet utilisateur ou cet email existe déjà.'));
                }
                return reject(err);
            }
            resolve(results.insertId); 
        });
    });
}



module.exports = {getUserById, checkLogin, addUser, addagent};
