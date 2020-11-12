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
}

/** @returns {Promise<{id:int, firstName:string, lastName:string, email:string, passwordHash?: string}>} */
exports.createuser = (user) => {
    return db
        .query(
            `INSERT INTO users (first_name, last_name, email, password_hash) 
                     VALUES ($1,$2,$3,$4) returning id, first_name, last_name, email, password_hash;`,
            [user.firstName, user.lastName, user.email, user.password_hash]
        )
        .then((result) => {
            return mapRowToUser(result.rows[0]);
        });
};

/** @returns {Promise<{id:int, firstName:string, lastName:string, email:string, passwordHash?: string}>} */
exports.readByEmail = (email) =>
    db.query("SELECT * FROM users WHERE email = $1", [email]).then((result) => {
        if (result.rows.length === 1) {
            return mapRowToUser(result.rows[0], true);
        } else {
            return null;
        }
    });

/** @returns {Promise<{id:int, firstName:string, lastName:string, email:string, passwordHash?: string}>} */
exports.readUser = (userId) =>
    db.query("SELECT * FROM users WHERE id = $1;", [userId]).then((result) => {
        if (result.rows.length === 1) {
            return mapRowToUser(result.rows[0], true);
        } else {
            return null;
        }
    });
