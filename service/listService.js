const db = require('../initializeDatabase');

/**
 * Get all lists of the selected user.
 *
 * @param email the user email
 * @returns all user's lists
 */
function getAllListsOfUser(email) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT l.id   AS list_id,
                   l.name AS list_name,
                   h.user_email,
                   h.has_right
            FROM has_access h
                     INNER JOIN todo_list l ON l.id = h.todo_list_id
            WHERE h.user_email = ?
        `, [email], (err, rows) => {
            if (err) {
                console.error("Error fetching user's lists:", err.message);
                reject(err);
            } else {
                console.log("getAllListsOfUser executed successfully.", rows);
                resolve(rows);
            }
        });
    });
}


/**
 * Create a list in the database.
 *
 * @param email user email
 * @param name list name
 * @returns the newly created list
 */
async function createList(email, name) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO todo_list (name) VALUES (?)", [name], function (err) {
            if (err) {
                console.error("Error inserting todo_list:", err.message);
                reject(err);
                return;
            }
            console.log("todo_list added successfully!");

            const listId = this.lastID; // Get the ID of the last created list

            db.run("INSERT INTO has_access (user_email, todo_list_id, has_right) VALUES (?, ?, 1)", [email, listId], (err) => {
                if (err) {
                    console.error("Error inserting has_access:", err.message);
                    reject(err);
                    return;
                }
                console.log("has_access added successfully!");
                resolve({id: listId, name});
            });
        });
    });
}

module.exports = {
    getAllListsOfUser,
    createList,
}; 