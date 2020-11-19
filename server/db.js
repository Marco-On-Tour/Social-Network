const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:anna:postgres@localhost:5432/social");

/** @returns {Promise<{id:int, firstName:string, lastName:string, email:string}>} */
function mapRowToUser(row, mapHash = false) {
    const user = {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
    };
    if (row.password_reset_token) {
        user.passwordResetToken = row.password_reset_token;
    }
    if (mapHash) {
        user.passwordHash = row.password_hash;
    }
    return user;
}

/**
 *@returns {Promise<{id:int, firstName:string, lastName:string, email:string, passwordHash?: string}>}
 *
 **/
exports.createuser = async (user) => {
    try {
        const result = await db.query(
            `INSERT INTO users (first_name, last_name, email, password_hash) 
            VALUES ($1,$2,$3,$4) 
            returning id, first_name, last_name, email, password_hash;`,
            [user.firstName, user.lastName, user.email, user.passwordHash]
        );
        const data = mapRowToUser(result.rows[0]);
        return data;
    } catch (error) {
        console.error("could not save user", error);
        throw error;
    }
};

/** @returns {Promise<{id:int, firstName:string, lastName:string, email:string, passwordHash?: string}>} */
exports.readByEmail = async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    if (result.rows.length === 1) {
        return mapRowToUser(result.rows[0], true);
    } else {
        return null;
    }
};

/** @returns {Promise<{id:int, firstName:string, lastName:string, email:string, passwordHash?: string}>} */
exports.readUser = async (userId) => {
    const result = await db.query("SELECT * FROM users WHERE id = $1;", [
        userId,
    ]);
    if (result.rows.length === 1) {
        return mapRowToUser(result.rows[0], true);
    } else {
        return null;
    }
};

exports.readUserByMail = async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1;", [
        email,
    ]);
    if (result.rows.length === 1) {
        return mapRowToUser(result.rows[0], true);
    } else {
        return null;
    }
};

exports.resetPasswordRequest = async (email, random) => {
    const result = await db.query(
        "UPDATE users SET password_reset_token = $1 WHERE email = $2 returning *;",
        [email, random]
    );
    if (result.rows.length > 0) {
        return mapRowToUser(result.rows[0]);
    }
};

exports.resetPassword = async (email, token, newPasswordHash) => {
    const result = await db.query(
        `
        UPDATE users SET password_hash = $1
        where email = $2 and password_reset_token = $3
        returning *`,
        [newPasswordHash, email, token]
    );
    if (result.rows.length > 0) {
        return mapRowToUser(result.rows[0]);
    } else {
        throw `user with email ${email} does not exist or secret token ${token} does not match`;
    }
};
