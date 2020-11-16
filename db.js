const spicedPg = require('spiced-pg');
const dbUrl = process.env.DATABASE_URL || 'postgres:marconewman:@localhost:5432/socialnetwork';
const db = spicedPg(dbUrl);


exports.addUser = (firstname, lastname, email, password_hash) => {
    return db.query(
        'INSERT INTO users (firstname, lastname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *;',
        [firstname, lastname, email, password_hash]
    ).then(response => response.rows[0]);
};