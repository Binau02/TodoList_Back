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
            SELECT l.id,
                   l.name,
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
 * Get all users that have access to the selected list
 *
 * @param id the list id
 * @returns all users that have access to list
 */
function getAllUsersOfList(id) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT h.user_email,
                   h.has_right
            FROM todo_list l
                     INNER JOIN has_access h ON l.id = h.todo_list_id
            WHERE l.id = ?
        `, [id], (err, rows) => {
            if (err) {
                console.error("Error fetching list of users:", err.message);
                reject(err);
            } else {
                console.log("getAllUsersOfList executed successfully.", rows);
                resolve(rows);
            }
        });
    });
}

/**
 * Get a list by its id.
 *
 * @param list_id the list id
 * @returns the list
 */
function getListById(list_id) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT *
            FROM todo_list
            WHERE id = ?
        `, [list_id], (err, rows) => {
            if (err) {
                console.error("Error fetching list:", err.message);
                reject(err);
            } else {
                console.log("getListById executed successfully.", rows);
                resolve(rows[0] ?? undefined);
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


/**
 * Grant access to list.
 *
 * @param email user email
 * @param listId list id
 */
async function grantAccessToList(email, listId) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT *
            FROM has_access
            WHERE user_email = ?
              AND todo_list_id = ?
        `, [email, listId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length !== 0) {
                reject({error: "Already exist"})
                return;
            }
            db.run("INSERT INTO has_access (user_email, todo_list_id, has_right) VALUES (?, ?, 0)", [email, listId], (err) => {
                if (err) {
                    console.error("Error inserting has_access:", err.message);
                    reject(err);
                    return;
                }
                console.log("has_access added successfully!");
                resolve();
            });
        })
    });
}


/**
 * Update a list.
 *
 * @param list_id the list id
 * @param name new name of the list
 */
async function updateList(list_id, name) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE list SET (name) = (?) WHERE id = ?", [name, list_id], function (err) {
            if (err) {
                console.error("Error updating list:", err.message);
                reject(err);
                return;
            }
            console.log("list updated successfully!");

            resolve();
        });
    });
}

module.exports = {
    getAllListsOfUser,
    createList,
    grantAccessToList,
    getListById,
    updateList,
    getAllUsersOfList,
}; 