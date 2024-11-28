const database = require("./database.js");

async function getUserById(id) {
    sql = "SELECT * FROM utilisateur WHERE id = ?";
    return new Promise((resolve, reject) => {
        database.query(sql, id, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

async function checkLogin(login) {
    sql = "SELECT * FROM utilisateur WHERE login = ?";
    return new Promise((resolve, reject) => {
        database.query(sql, login, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);
        });
    });
};

async function addUser(login, mail, password) {
    const sql = "INSERT INTO utilisateur (login, email, password, type_utilisateur) VALUES (?, ?, ?, 'client')";
    return new Promise((resolve, reject) => {
        database.query(sql, [login, mail, password], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return reject(new Error('Cet utilisateur ou cet email existe déjà.'));
                }
                return reject(err);
            }
            resolve(results.insertId);
        });
    });
};

// Fonction pour ajouter un agent
async function addAgent(login, email, password) {
    const sql = "INSERT INTO utilisateur (login, email, password, type_utilisateur) VALUES (?, ?, ?, 'agent')";
    return new Promise((resolve, reject) => {
        database.query(sql, [login, email, password], (err, results) => {
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

// Fonction pour obtenir tous les agents
async function getAllAgents() {
    const sql = "SELECT * FROM utilisateur WHERE type_utilisateur = 'agent'";
    return new Promise((resolve, reject) => {
        database.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

// Fonction pour supprimer un agent
async function deleteAgent(id) {
    const sql = "DELETE FROM utilisateur WHERE id = ?";
    return new Promise((resolve, reject) => {
        database.query(sql, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = {
    getUserById,
    checkLogin,
    addUser,
    addAgent,
    getAllAgents,
    deleteAgent
};
