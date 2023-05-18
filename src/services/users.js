const { sequelize } = require('../utils/db')
const ModelUser = require('../models/users')
const { v4:uuidv4 } = require('uuid')

const cache = require('../utils/cache')

const get = async (id) => {
    const User = ModelUser.get(sequelize)

    let user = await cache.client.get(id)
    if (user == null){
        console.log(`Cache MISSED`)
        user = await User.findOne({ where: { user_id: id } })
        await cache.client.set(id, JSON.stringify(user));
        console.log(`Save user to redis`);
    } else {
        console.log(`Cache HIT`);
    }

    return user;
}

const getAll = async () => {
    const User = ModelUser.get(sequelize);
    let users = User.findAll({ where: {}});
    if (users == null){
        return [];
    }
    return users;
}

const create = async(firstname, lastname) => {
    const User = ModelUser.get(sequelize);
    let user = User.create({
        user_id: uuidv4(),
        firstname: firstname,
        lastname: lastname 
    });

    return user;
}

module.exports = {
    get,
    getAll,
    create
}