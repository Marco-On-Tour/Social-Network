const spicedPg = require('spiced-pg');
const dbUrl = process.env.DATABASE_URL || 'postgres:marconewman:@localhost:5432/socialnetwork';
const db = spicedPg(dbUrl);

//adds a user to database
exports.addUser = (firstname, lastname, email, password_hash) => {
    return db.query(
        'INSERT INTO users (firstname, lastname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *;',
        [firstname, lastname, email, password_hash]
    ).then(response => response.rows[0]);
};

exports.getUserByEmail = (email) =>
    db
        .query("SELECT * FROM users WHERE email = $1;", [email])
        .then(({ rows }) => rows[0]);

exports.getUserById = (id) =>
    db
        .query("SELECT * FROM users WHERE id = $1;", [id])
        .then(({ rows }) => rows[0]);

exports.updateUserProfilePicture = (userId, picturePath) =>
    db
        .query(
            "UPDATE users SET profile_picture_url=$1 WHERE id=$2 RETURNING *;",
            [picturePath, userId]
        )
        .then(({ rows }) => rows[0]);