//Load the Packages for application

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');
const server=express();
const https=require('https');
const mkdirp = require('mkdirp');
const chalk=require('chalk');
const mysql=require('mysql');
const moment = require('moment');
let now = moment().format('YYYY-MM-DD | HH:mm:ss')


//Load Local functions and variables and routes
    //functions
    //variables
    const keys = require('./config/keys');
    
    //routes
    const index = require('./routes/index');
   

//Handlebars
server.set('views', path.join(__dirname, 'views'));
server.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
server.set('view engine', 'handlebars');
server.use(express.static(path.join(__dirname,'public')));
server.use(cookieParser());

//BodyParser
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

//Method Override Middleware
server.get(methodOverride('_method'));

//Express Session Middleware
server.use(session({
    secret:'secret', //change this before production
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
server.use(passport.initialize());
    server.use(passport.session());
    server.use(flash());
    server.use((req, res, next)=>{
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null; 
      next();
    });

//Express-Upload Middleware
server.use(fileUpload({safeFileNames: true, preserveExtension: true }));

//Connect to Mongoose. Mongodb database would need to be configured in the ./config/keys.js file
connectToMongodb=()=>{
    mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
        .then(() => console.log(chalk.green('Connected to the Mongoose Database')))
        .catch(err => console.log(err));
    };

//Connect to mySql Database. SQL database would need to be configured in the ./config/keys.js file
connectToSql =()=>{
    const sqldb = mysql.createConnection(keys.sql);
    sqldb.connect((err)=>{
        if(err){
            console.log(err);
        }
        console.log(chalk.green('Connected to SQL Database'))});
}

//Use Routes


server.use('/', index);

//Redirect for unknown Paths

let liveMode = false;

if(liveMode)
app.all('*', (req,res)=>{
    res.render('404');
})
else{};

connectToServer=()=>{
    const port = process.env.PORT || 5000;
    //WHEN THIS GOES LIVE: 
    
    server.listen(port, ()=>{
        console.log(chalk.blue(`Server has launched on ${port}`));
    })


    /*let productionServer = https.createServer(options,server);
    productionServer.listen(port, ()=>{
        console.log(chalk.blue(`Server has launched on ${port}`));
    })
*/
}

connectToServer();
//connectToSql();  REMOVE FROM COMMENTS AFTER SETTING UP THE SQLDB
//connectToMongodb(); REMOVE FROM COMMENTS AFTER SETTING UP THE MONGODB. 