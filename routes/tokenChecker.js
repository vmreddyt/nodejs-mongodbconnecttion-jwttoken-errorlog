const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../logger/logger');

module.exports = (req,res,next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  // decode token
  // logger.info(req.headers);
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
           // const length = Object.keys(err).length;
            const errArry = [];
            const entries = Object.entries(err);
            for (const [err, count] of entries) {
              errArry.push(`${err} : ${count}`);
            }
            console.log(`JWT Token error => [ ${errArry}]`);            
            logger.error(`JWT Token error => [ ${errArry}]`);
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}