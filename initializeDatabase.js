const sqlite3 = require('sqlite3');
const dbName = './data/todo.db';

let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code === "SQLITE_CANTOPEN") {
        createDatabase();
    } else if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Database connected successfully.");
    }
});

function createDatabase() {
    db = new sqlite3.Database(dbName, (err) => {
        if (err) {
            console.error("Error creating database:", err);
            return;
        }
        console.log("Database created.");
        createTables();
    });
}

function createTables() {
    db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS "user" (
        "email" TEXT NOT NULL PRIMARY KEY,
        "password" TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "todo_list" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "owner_email" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        FOREIGN KEY("owner_email") REFERENCES "user"("email") ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS "has_access" (
        "user_email" TEXT NOT NULL,
        "todo_list_id" INTEGER NOT NULL,
        FOREIGN KEY("user_email") REFERENCES "user"("email") ON DELETE CASCADE,
        FOREIGN KEY("todo_list_id") REFERENCES "todo_list"("id") ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS "has_access_user_email_todo_list_id_index" 
    ON "has_access"("user_email", "todo_list_id");
    
    CREATE TABLE IF NOT EXISTS "list_item" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "is_done" INTEGER NOT NULL CHECK("is_done" IN (0,1)), 
        "end_date" DATE NOT NULL,
        "list_id" INTEGER NOT NULL,
        FOREIGN KEY("list_id") REFERENCES "todo_list"("id") ON DELETE CASCADE
    );`,
        (err) => {
            if (err) {
                console.error("Error creating tables:", err);
            } else {
                console.log("Tables created successfully.");
            }
        }
    );
}

// Exporter l'instance de la base de données
module.exports = db;
