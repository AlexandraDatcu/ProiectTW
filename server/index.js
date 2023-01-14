const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt")
const sequelize = require('./database');
const jwt = require('jsonwebtoken');
const token_secret = "93e770be5c3ee06bbb587c272a8b46cee1a0b85adb5872f6cb335a8a6008c8e8a6b67be1e7ca5b6d1febdfbfcd6156380ee9f46cc3a534a0da5a32d81ed37287";// require('crypto').randomBytes(64).toString('hex');
const User = require('./User');
const Trip = require('./Trip');

function generateAccessToken(username) {
    return jwt.sign({username}, token_secret, { expiresIn: '1800s' });
}
function authenticateToken(req)
{
    const authHeader = req.headers['authorization'];
    if(authHeader.split(' ')[0] != 'Bearer')
    {
        return false;
    }
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null)
    {
        return false;
    }

    try
    {
        const decoded = jwt.verify(token,token_secret);
        req.user = decoded;
        return true;
    }
    catch (err) {
        return false;
    }
}
app.post('/CreateAccount',async(req, res)=>{
    const username = req.body.username;
    const password= req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const item = {username,hash};
    try{
        let user = new User({
            username: item.username,
            password: item.hash
        })
        await user.save()
        res.status(201).json({ message: 'created', validAuthorization : generateAccessToken(username)});
    } catch (err) {
        console.warn(err)
    }
    
 });

 app.get('/Login', async(req,res)=>{
    const reqUsername = req.body.username;
    const reqPassword = req.body.password;
    const user = await User.findOne({where : {username: reqUsername}});
    if(user === null)
    {
        res.status(401).json({message: 'no user'})
    }
    else
    {
        const resultPassword = bcrypt.compareSync(reqPassword, user.password);
        if(resultPassword)
        {
            res.status(201).json({message : 'log in successfully!', validAuthorization : generateAccessToken(reqUsername)});
        }
        else
        {
            res.status(401).json({message : 'Password incorrect'});
        }
    }
 });

app.post('/share/create-trip', async(req,res) => {
    const token = authenticateToken(req);
    if(token)
    {
        try{  
            const trip = new Trip(req.body);
            const userid = await User.findOne({attributes : ['id'], where : {username: req.user.username}});
            trip.userId = userid.id;
            await trip.save();
            res.status(201).json({ message: 'created'});
        }catch(err){
            res.status(400).json({message: 'syntax trip error'});
        }
    }
    else
    {    
        res.sendStatus(401).json({message : 'Unauthorized token'});
    }
});


app.get('/share/trips', async(req,res) =>{
    const token = authenticateToken(req);
    if(token)
    {
        const userid = await User.findOne({attributes : ['id'], where : {username: req.user.username}});
        try{
            const trips = await Trip.findAll({
                where : {
                    userId : userid.id
                }
            });
            res.status(200).json(trips);
        }catch(err){
            res.status(404).json('No trips');
        }
    }
    else
    {    
        res.sendStatus(401).json({message : 'Unauthorized token'});
    }
});


async function main() {
    User.hasMany(Trip);
    Trip.belongsTo(User);
    await sequelize.sync();
    console.log('db is ready');
    app.listen(4000, ()=>{
        console.log("Serverul a pornit la portul 4000");
    });
}

main();