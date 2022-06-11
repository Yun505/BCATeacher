// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('Hello World!');
// }).listen(8080);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const fs = require('fs');
var path = require('path');

var jsonPath = path.join(__dirname, '..', 'scraper', 'classes.txt');

var CLASSES_DATA;
fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    CLASSES_DATA = data;
});
  

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true})); 
app.use(cors());

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send("Welcome to your server");
});

//Route that handles login logic
app.post('/login', (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
});

//Route that handles signup logic
app.post('/signup', (req, res) => {
    console.log(req.body.fullname);
    console.log(req.body.username);
    console.log(req.body.password);
});

app.get("/getData", (req, res) => {
    res.write(CLASSES_DATA);
    res.end();
});

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`)
});