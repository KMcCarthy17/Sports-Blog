const express = require("express");
const bodyParser = require("body-parser");
const nodemon = require("nodemon");
const mysql = require("mysql");
//const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
let fs = require("fs");
let saltRounds = 10;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const path = require("path");

const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

const viewsPath = path.join(__dirname, '/views');


const port = process.env.PORT || 4444;
app.listen(port, ()=>{
    console.log("App listening on port " + port);
});

const connection = mysql.createConnection({
    host: "localhost",
    //host: "157.245.138.14",
    user: "root",
    //password: "D3nn|s|sC00l",
    password: "Kavanaugh17",
    database: "inf355_356_sports_blog"
});

connection.connect(function (err) {
    if(err) throw err;
    console.log("Connected to Database");
});

// Sessions
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

let databaseOptions = {
    host: "localhost",
    //host: "157.245.138.14",
    port: port,
    user: "root",
    password: "Kavanaugh17",
    //password: "D3nn|s|sC00l",
    database: "inf355_356_sports_blog",
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

let sessionStore = new mysqlStore(databaseOptions, connection);

app.use(session({
    key: "session_cookie_name",
    secret: "dennisiscool",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));




/***
 Getters
 ***/
app.get("/getLoggedStatus", function(req, res)
{
    if (req.session.user != null)
    {
        console.log("Logged in middleware");
        res.json({loggedStatus: true})
    }

    else
    {
        console.log("Not logged in middleware");
        res.json({loggedStatus: true})
    }
});

app.get("/logout", function (req,res) {
    req.session.user = null;
    req.session.destroy();
    res.json({loggedStatus: false});
});



//Get pro football posts
app.get("/proFootballPosts",function (req,res) {
    let query = "select * from pro_football_posts";

    connection.query(query, function (err, result) {
        if(err) throw res.json({"message":"Error 404 could not find pro football posts"});

        console.log("Result:", result);
        res.json(result);
    })
});

//Get college football posts
app.get("/collegeFootballPosts",function (req,res) {
    let query = "select * from college_football_posts";

    connection.query(query, function (err, result) {
        if(err) throw res.json({"message":"Error 404 could not find college football posts"});

        console.log("Result:", result);
        res.json(result);
    })
});

//Get pro basketball posts
app.get("/proBasketballPosts",function (req,res) {
    let query = "select * from pro_basketball_posts";

    connection.query(query, function (err, result) {
        if(err) throw res.json({"message":"Error 404 could not find pro basketball posts"});

        console.log("Result:", result);
        res.json(result);
    })
});

//Get college basketball posts
app.get("/collegeBasketballPosts",function (req,res) {
    let query = "select * from college_basketball_posts";

    connection.query(query, function (err, result) {
        if(err) throw res.json({"message":"Error 404 could not find college basketball posts"});

        console.log("Result:", result);
        res.json(result);
    })
});


/********
 * POST *
 ********/

app.post("/register", async function(req, res)
{
    let formData = req.body;

    let encryptedPassword = await getEncryptedPassword(formData.password, saltRounds);

    let query = "insert into users (username, password) values (?, ?)";
    let keywordParameters = [formData.username, encryptedPassword, false];
    let errorMessage = "Failed to create new user, user with that username may already exist";

    try
    {
        console.log(formData);
        console.log(encryptedPassword);
        queryWithParams(res, query, keywordParameters, errorMessage, function ()
        {
            //res.redirect("/login");
            //res.send("done");
            res.json({loggedStatus:  true, username: req.body.username});
        }, "register");
    }

    catch (err)
    {
        res.render("register", {error: errorMessage});
    }
});


app.post("/login", async function(req, res)
{
    let formData = req.body;
    console.log(formData);

    let query = "select * from users where username = ?";
    let keywordParameters = [formData.username];
    let errorMessage = "User does not exist";

    try
    {
        queryWithParams(res, query, keywordParameters, errorMessage, async function (result, err)
        {
            await tryLogin(req, res, formData, result[0], errorMessage);
        });
    }

    catch (err)
    {
        //res.render("login", {error: errorMessage});
        res.json({error: errorMessage});
    }
});

async function tryLogin(req, res, formData, result, errorMessage)
{
    try
    {
        // Username not found
        if (result.length <= 0) throw err;

        let answer = await encryptedPasswordMatches(formData.password, result.password);

        if (answer)
        {
            //console.log("Made it!!!");
            req.session.user = result;
            //res.redirect("/private/homepage");
            console.log("User: ",  req.session.user);
            res.json({loggedStatus:  true, username: req.body.username});
            //res.redirect("/main");
        }

        else
        {
            res.json({loggedStatus:  false, username: null});
            //res.render("login", {error: "Invalid password"});
        }
    }
    catch (err)
    {
        res.json({error: errorMessage});
        //res.render("login", {error: errorMessage});
    }
}



//New post for pro football
app.post("/profootballnewpost", function(req, res, next){
    let formdata = req.body;
    console.log(formdata);

    let query = "insert into pro_football_posts (title,author,blog_body) VALUES (?,?,?)";

    let values = [formdata.title,formdata.author,formdata.blog_body];

    connection.query(query,values, function(err,result){
        if(err) console.log("error");
        console.log("Message Sent");
        res.send("success");
    });
});

//New post for college football
app.post("/collegefootballnewpost", function(req, res, next){
    let formdata = req.body;
    console.log(formdata);

    let query = "insert into college_football_posts (title,author,blog_body) VALUES (?,?,?)";

    let values = [formdata.title,formdata.author,formdata.blog_body];

    connection.query(query,values, function(err,result){
        if(err) console.log("error");
        console.log("Message Sent");
        res.send("success");
    });
});

//New post for pro basketball
app.post("/probasketballnewpost", function(req, res, next){
    let formdata = req.body;
    console.log(formdata);

    let query = "insert into pro_basketball_posts (title,author,blog_body) VALUES (?,?,?)";

    let values = [formdata.title,formdata.author,formdata.blog_body];

    connection.query(query,values, function(err,result){
        if(err) console.log("error");
        console.log("Message Sent");
        res.send("success");
    });
});

//New post for college basketball
app.post("/collegebasketballnewpost", function(req, res, next){
    let formdata = req.body;
    console.log(formdata);

    let query = "insert into college_basketball_posts (title,author,blog_body) VALUES (?,?,?)";

    let values = [formdata.title,formdata.author,formdata.blog_body];

    connection.query(query,values, function(err,result){
        if(err) console.log("error");
        console.log("Message Sent");
        res.send("success");
    });
});

/***********
 * HELPERS *
 ***********/

function queryWithParams(res, query, keywordParameters, errorMessage, callback, errorPage)
{
    connection.query(query, keywordParameters, function(err, result, fields)
    {
        let runCallback = true;

        if (err)
        {
            if (errorPage != null)
            {
                runCallback = false;
                //res.render(errorPage, {error: errorMessage});
                res.send({"error": errorMessage});
            }

            else
            {
                throw err;
            }
        }

        if (callback != null && runCallback)
        {
            callback(result, err);
        }
    });
}

async function getEncryptedPassword(password, saltRounds)
{
    return await bcrypt.hash(password, saltRounds);
}

async function encryptedPasswordMatches(password, encryptedPassword)
{
    return await bcrypt.compare(password, encryptedPassword);
}
