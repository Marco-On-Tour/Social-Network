const bcrypt = require("bcryptjs");

exports.hash = (password) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

exports.compare = (password, hash) => bcrypt.compareSync(password, hash);
