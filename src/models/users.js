const { DataTypes } = require("sequelize");

const get = (sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING
    });

    return User;
}

module.exports = {
    get
}