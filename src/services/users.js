const { sequelize } = require('../utils/db')
const ModelUser = require('../models/users')
const { v4:uuidv4 } = require('uuid')

const cache = require('../utils/cache')

const get = async (id) => {
    const User = ModelUser.get(sequelize)

    let user = await cache.client.get(id)
    if (user == null){
        console.log(`Cache MISSED (${id})`)
        console.log(`Getting user profile for ${id} from DATABASE.`)
        user = await User.findOne({ where: { user_id: id } })
        await cache.client.set(id, JSON.stringify(user), { EX: 5 * 60});
        console.log(`Save user to redis`);

        return user;
    } else {
        console.log(`Cache HIT (${id})`);
        return JSON.parse(user)
    }
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

const update = async(id, firstname, lastname) => {
    const User = ModelUser.get(sequelize);
    let user = await User.findOne({ where: { user_id: id } })
    if (user == null ){
        return null;
    }


    if (firstname === '' || firstname == undefined || firstname == null ){
        return null
    }

    if (lastname === '' || lastname == undefined || lastname == null ){
        return null
    }

    await User.update({ firstname: firstname, lastname: lastname}, { where: { user_id: id}})
    user = await User.findOne({ where: { user_id: id } })

    // Invalidate cache
    cache.client.del(id)
    console.log(`Cache key delete: ${id}`);

    return user;
}

module.exports = {
    get,
    getAll,
    create, 
    update
}