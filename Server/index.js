const express = require('express');
const session = require('express-session');

const port = 3000;
const appScrpts = require('./API/AppScripts')
const connection = require('./database');
connection.connect((err) => {
    if (err){
        console.log("Error connection to DB: " + err);
        return;
    }
    console.log("Connected to database!");
})

const app = express();

app.use(express.static("www"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret: 'JustDealWith_Dreams',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24}, // 24 Hours
}))

app.listen(port, () =>{
    console.log("Server is running on localhost " + port);
});

// Routes

app.use('/AppScript',appScrpts)