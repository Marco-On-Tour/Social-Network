const bcrypt = require("bcryptjs");

/**
 * @param {string} password
 * @returns {string} */
exports.hash = (password) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

/**
 *
 * @param {string} password
 * @param {string} hash
 * @returns {string}
 */
exports.compare = (password, hash) => bcrypt.compareSync(password, hash);
