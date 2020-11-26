const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:marconewman:@localhost:5432/socialnetwork');


//adds a user to database
exports.addUser = (firstname, lastname, email, password_hash) => {
    return db.query(
        'INSERT INTO users (firstname, lastname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *;',
        [firstname, lastname, email, password_hash]
    ).then(response => response.rows[0]);
};


//check email for log in
exports.getUserByEmail = (email) =>
    db
        .query("SELECT * FROM users WHERE email = $1;", [email])
        .then(({ rows }) => rows[0]);

//get user via ID
exports.getUserById = (userId) =>
    db
        .query("SELECT * FROM users WHERE id = $1;", [userId])
        .then(({ rows }) => rows[0]);


//profile picture uploader
exports.uploadUserPic = (userId, newProfilePic) => {
    return db.query (
        "UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING *;",
        [newProfilePic, userId]
    ).then(({ rows }) => rows[0]);
}

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

//Find other users
exports.getOtherUsersById = (currentUserId) => {
    return db.query (
        "SELECT * FROM users WHERE id = $1;", [currentUserId]
    ).then(({ rows }) => rows[0]);
}

//User list

exports.getUserListByQuery = (userQuery) => {
    return db.query (
        "SELECT * FROM users WHERE firstname ILIKE $1;",
        [userQuery + "%"]
    ).then(({ rows }) => rows);
}

//get Friend requests
exports.getFriendRequestStatus = (itsMe, otherUsersId) => {
    return db.query (
        "SELECT * FROM friend_requests WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1);",
        [itsMe, otherUsersId]
    ).then(({ rows }) => rows[0]);
}


//making friend requests
exports.makeFriendRequest = (itsMe, otherUsersId) => {
    return db.query (
        "INSERT INTO friend_requests (from_id, to_id, accepted) VALUES($1, $2, false) RETURNING *;",
        [itsMe, otherUsersId]
    ).then(({ rows }) => rows[0]);
}

//accepting requests
exports.acceptFriendRequest = (itsMe, otherUsersId) => {
    return db.query (
        "UPDATE friend_requests SET accepted = true WHERE (from_id = $1 AND to_id = $2) RETURNING *;",
        [otherUsersId, itsMe]
    ).then(({ rows }) => rows[0]);
}

//deny friend request
exports.cancelFriendRequest = (itsMe, otherUsersId) => {
    return db.query (
        "DELETE FROM friend_requests WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1);",
        [otherUsersId, itsMe]
    ).then(({ rows }) => rows[0]);
}

//unfriending
exports.unfriendUser = (itsMe, otherUsersId) => {
    return db.query (
        "DELETE FROM friend_requests WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1);",
        [itsMe, otherUsersId]
    ).then(({ rows }) => rows[0]);
}

//friend request status
exports.getFriendsAsList = (itsMe) => {
    return db.query(
        `SELECT * FROM friend_requests
        JOIN users
            ON (from_id = users.id AND to_id = $1      AND accepted=false)
            OR (from_id = users.id AND to_id = $1      AND accepted=true)  
            OR (from_id = $1      AND to_id = users.id AND accepted=true)
            OR (from_id = $1      AND to_id = users.id AND accepted=false);`,
            [itsMe]
    ).then(({ rows }) => rows);
}

//messages
exports.getChatMessages = () => {
    return db.query (
        `SELECT * FROM (  
            SELECT chats.id as message_id, * FROM chats
            JOIN users
            ON (chats.user_id = users.id)
            ORDER BY chats.id DESC
            LIMIT 10
        ) as subquery
        ORDER BY message_id ASC;`
    ).then(({ rows }) => rows);
}

//added messages
exports.addChatMessage = (userId, messageText) => {
    return db.query (
        "INSERT INTO chats (user_id, message_text) VALUES ($1, $2) RETURNING id;",
        [userId, messageText]
    ).then(({ rows }) => rows[0]);
}