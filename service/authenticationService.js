const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../initializeDatabase');

/**
 * Create a user in the database.
 *
 * @param email user email (unique)
 * @param password user clear password (that will be hashed)
 * @returns the newly created user
 */
async function registerUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO user (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
        if (err) {
            console.error("Error inserting user:", err.message);
            return;
        }
        console.log("User added successfully!");
    });
}

/**
 * Authenticate a user if the login and the password matches.
 *
 * @param email the email
 * @param password the user password
 * @returns a JWT token
 */
function authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM user WHERE email = ?", [email], async (err, row) => {
            if (err) {
                console.error("Error fetching user:", err.message);
                reject(err);
            } else {
                const user = row;
                if (!user) {
                    resolve(null);
                    return;
                }
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    resolve(null);
                    return;
                }

                const token = jwt.sign({
                    userEmail: user.email,
                }, process.env.JWT_SECRET, {expiresIn: '1h'})

                resolve({token});
            }
        });
    });
}

module.exports = {
    registerUser,
    authenticateUser
};
