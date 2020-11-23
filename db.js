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


//profile picture uploader
exports.updateUserProfilePicture = (userId, profilePic) =>
    db
        .query(
            "UPDATE users SET profile_pic = $1 WHERE id=$2 RETURNING *;",
            [profilePic, userId]
        )
        .then(({ rows }) => rows[0]);

// reset password with secretcode
exports.addSecretCode = (userId, secretCode) => {
    return db.query (
        "INSERT INTO passwordreset (id, code) VALUES($1, $2) RETURNING*;",
        [userId, secretCode]
    ).then(({ rows }) => rows[0]);
}

//retrieve secret code
exports.getUserSecretCode = () => {
    return db.query (
        `SELECT * FROM passwordreset 
        WHERE code - created_at < INTERVAL '10 minutes';`
    ).then(({ rows }) => rows[0]);
}

//update password
exports.updateUserPassword = (userId, password_hash) => {
    return db.query (
        "UPDATE users SET password_hash = $1 WHERE id = $2;",
        [password_hash, userId]
    )
}

//update bio
exports.updateUserBio = (userId, bioEdit) => {
    return db.query (
        "UPDATE users SET bio = $1 WHERE id = $2 RETURNING*;",
        [bioEdit, userId]
    ).then(({ rows }) => rows[0]);
}