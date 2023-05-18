const express = require('express');
const service = require('./services/users');
const database = require('./utils/db');
const client = require('./utils/cache');


const port = process.env.PORT || 3000;
const router = express.Router();

router.get('/users', async (req, res) => {
    const users = await service.getAll();
    res.status(200).json(users);
});

router.get('/users/:userId', async (req, res) => {
    const user = await service.get(req.params.userId);
    res.status(200).json(user);
})

router.post('/users', async (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    const user = await service.create(firstname, lastname);
    res.status(201).json(user);
})


const app = express();
app.use(express.json())
app.use('/v1', router);

const server = app.listen(port, async function(err){
    if (err) console.log(err);

    await database.connect();
    await client.connect();
    console.log(`Server is listening at port ${port}`);

})