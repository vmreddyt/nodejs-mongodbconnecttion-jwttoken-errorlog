const express = require('express');
const app = express();
const http = require('http').Server(app); // Http server

const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config');
const logger = require('./logger/logger');
const loggerFile = require('./logger/loggerFile');

// const dirname = config.dirname;

// const fs = require('fs');
// const util = require('util');

// const log_file = fs.createWriteStream(dirname + '/debug.log', {flags : 'a'});
// const log_stdout = process.stdout;

// console.log = function(d) { //
//     log_file.write(util.format(d) + '\n');
//     log_stdout.write(util.format(d) + '\n');
//   };
// console.error = console.log;


app.use(bodyParser.json()); // add body parser 


app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*'); // We can access from anywhere
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});


app.use("/", require("./routes/login"));
app.use(router);
router.use(require('./routes/tokenChecker'));
app.use("/", require("./routes/books"));

MongoClient.connect(config.dbUrl, { useNewUrlParser: true })
.then(client => {
  app.locals.db = client.db(config.database);
  app.listen(config.port, (res) => {
    logger.info(`MongoClient connection is success :)`);
    logger.info(`${config.serverMsg} ${config.port}`);
    console.log(`MongoClient connection is success `);
    console.log(` ${config.serverMsg} ${config.port}`);
  });
}).catch(error => logger.error(`MongoClient Error : ${error}`)); 
