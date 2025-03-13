const bcrypt = require("bcrypt");

const db = require('../initializeDatabase');

/**
 * Get all existing users in the database.
 *
 * @returns all users, without the passwords
 */
function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT email FROM user", (err, rows) => {
            if (err) {
                console.error("Error fetching users:", err.message);
                reject(err);
            } else {
                console.log("Database getAllUsers successfully.", rows);
                resolve(rows);
            }
        });
    });
}

module.exports = {
    getAllUsers,
}; 