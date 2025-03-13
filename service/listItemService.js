const db = require('../initializeDatabase');

/**
 * Get all items of a list.
 *
 * @param listId the listId
 * @returns all items of the given list
 */
function getAllItemsOfList(listId) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT *
            FROM list_item l
            WHERE l.list_id = ?
        `, [listId], (err, rows) => {
            if (err) {
                console.error("Error fetching list items:", err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


/**
 * Create an item in the list.
 *
 * @param name list name
 * @param end_date end date
 * @param list_id list id
 * @param position order index
 * @returns the newly created list
 */
async function createListItem(name, end_date, list_id, position) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO list_item (name, end_date, list_id, position, completed_by) VALUES (?, ?, ?, ?, null)", [name, end_date, list_id, position], function (err) {
            if (err) {
                console.error("Error inserting list_item:", err.message);
                reject(err);
                return;
            }
            console.log("list_item added successfully!");

            const itemId = this.lastID; // Get the ID of the last created list item

            resolve({id: itemId, name, end_date, list_id, position, completed_by: null});
        });
    });
}

module.exports = {
    getAllItemsOfList,
    createListItem,
}; 