const express = require("express");
const app = express();
app.use(express.json());
const session = require('express-session');
var cookieparser=require('cookie-parser');
const bcrypt = require("bcrypt")
const sequelize = require('./database');

sequelize.sync().then(()=>console.log('db is ready'));
const User = require('./User');

app.use(cookieparser());
app.use(session({
    secret:'secretTW',
    resave:true,
    saveUninitialized:false,
    cookie:{
        secure: false,
        httpOnly:true,
        maxAge:1000 * 60 * 60 * 2
    }
}));

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
        res.status(201).json({ message: 'db created'});
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
    else{
        const resultPassword = await bcrypt.compareSync(reqPassword, user.password);
        if(resultPassword)
        {
            req.session.save((err)=>
            {
                if(err){
                    res.status(401).json({message: 'Session error'});
                }
                res.status(201).json({message: 'log in successfully!'});
            })
            req.session.username = user.username;
            req.session.password = user.password;
        }
        else{
            res.status(401).json({message: 'Password incorrect'});
        }
    }
 });

app.listen(4000, ()=>{
    console.log("Serverul a pornit la portul 4000");
})