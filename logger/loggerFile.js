const fs = require('fs');
const util = require('util');
const config = require('../config/config');
const logDirFolderName = config.logDirFolderName;

const log_file = fs.createWriteStream(logDirFolderName + '/debug.log', {flags : 'a'});
const log_stdout = process.stdout;

 console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
  };
console.error = console.log;