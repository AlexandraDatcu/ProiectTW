const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt")
const sequelize = require('./database');
const jwt = require('jsonwebtoken');
const token_secret = "93e770be5c3ee06bbb587c272a8b46cee1a0b85adb5872f6cb335a8a6008c8e8a6b67be1e7ca5b6d1febdfbfcd6156380ee9f46cc3a534a0da5a32d81ed37287";// require('crypto').randomBytes(64).toString('hex');
const User = require('./User');
const Trip = require('./Trip');
const { Op } = require("sequelize");
function generateAccessToken(username) {
    return jwt.sign({username}, token_secret, { expiresIn: '10800s' });
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

 app.post('/Login', async(req,res)=>{
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
 app.delete('/DeleteAccount',async(req, res)=>{
    const token = authenticateToken(req);
    if(token)
    {
        const userid = await User.findOne({attributes : ['id'], where : {username: req.user.username}});
        if(userid.id)
        {
            await Trip.update({userid : null}, {where:{userId : userid.id}});
            await User.destroy({where : {id : userid.id}});
            res.status(202).json({message : 'user deleted'});
        }
        else
        {
            res.status(404).json({message: 'user not found!'});
        }
    }
    else
    {    
        res.status(401).json({message : 'Unauthorized token'});
    }
 });
 app.post('/ResetPassword', async(req,res) => {
    const token = authenticateToken(req);
    if(token)
    {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);   
        await User.update({password : hash}, {where : {username: req.user.username}});
        res.status(202).json({message : 'password updated'});
    }
    else
    {
        res.status(401).json({message : 'Unauthorized token'});
    }
 });
app.post('/share/trip', async(req,res) => {
    const token = authenticateToken(req);
    if(token)
    {
        const id = req.body.idTrip;
        if(id)
        {
            try{  
                const trip = await Trip.findByPk(id);
                if(trip)
                {
                    trip.plecareA = req.body.plecareA;
                    trip.sosireB = req.body.sosireB;
                    trip.mijlocTransport = req.body.mijlocTransport;
                    trip.oraPlecare = req.body.oraPlecare;
                    trip.durataCalatoriei = req.body.durataCalatoriei;
                    trip.observatii = req.body.observatii;
                    trip.gradAglomerare = req.body.gradAglomerare;
                    trip.nivelulSatisfactiei = req.body.nivelulSatisfactiei; 
                    await trip.save();
                    
                    res.status(202).json({ message: 'updated'});
                }
                else
                {
                    res.status(404).json({ message: 'trip not found!'});
                }
            }catch(err){
                res.status(400).json({message: 'syntax trip error'});
            }
        }
        else
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
    }
    else
    {    
        res.status(401).json({message : 'Unauthorized token'});
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
        res.status(401).json({message : 'Unauthorized token'});
    }
});

app.delete('/share/trip', async(req,res) => {
    const token = authenticateToken(req);
    if(token)
    {
        try{
            const trip = await Trip.findByPk(req.body.id);
            if(trip)
            {
                await trip.destroy({
                    where:{
                        idTrip : req.body.id
                    }
                });
                res.status(202).json({message :'trip deleted'});
            }
            else
            {
                res.status(404).json({message :'trip no found'});
            }
        }catch(err){
            res.status(400).json({message: 'syntax trip error'});
        }
    }
    else
    {    
        res.status(401).json({message : 'Unauthorized token'});
    }
});

app.get('/trips', async(req,res) =>{
    try{
        const trips = await Trip.findAll();
            res.status(200).json(trips);
    }catch(err){
        res.status(404).json('No trips');
    }
});

app.get('/search', async(req,res) =>{
    const plecareA = req.query.plecareA;
    const plecareB = req.query.sosireB;
    const mijolocTransport = req.query.mijlocTransport;
    const params = [];
    for (const key of ["plecareA", "sosireB", "mijlocTransport"]) {
        const val = req.query[key];
        if (val) {
            params.push(
                sequelize.where(sequelize.fn("LOWER", sequelize.col(key)), "LIKE", `%${val.toLowerCase()}%`)
            );
        }
    }
    try{
        const trips = await Trip.findAll({
            where : {
                [Op.and]: params
            }
        });
        res.status(200).json(trips);
        
    }catch(err){
        res.status(400).json({message: 'syntax error'});
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