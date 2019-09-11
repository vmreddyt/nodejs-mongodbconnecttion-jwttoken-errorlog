const express = require("express");
const router = express.Router();
const config = require('../config/config');

const privateKey = config.secret;
const refreshTokenSecretKey = config.refreshTokenSecret;
const tokenLife = config.tokenLifeInSeconds;
const refreshTokenLife = config.refreshTokenLifeInSeconds;

const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');


router.post('/login', getJwtToken);
router.post('/refreshToken', refreshToken);


function getJwtToken(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const data = {};
    if (!!username && !!password) {
        const user = {
            "username": username,
            "password": password
        }
        const token = jwt.sign(user, privateKey, { expiresIn: tokenLife});
        const refreshToken = jwt.sign(user, refreshTokenSecretKey, { expiresIn: refreshTokenLife}) 
        data["access_token"] = token;
        data["refresh_token"] = refreshToken;
        data['expTimeInSeconds'] = tokenLife;
        console.log(data);
        logger.info(data);
        res.json(data);
    } else {
        data["error"] = "Please provide all required data (i.e : username, Password)";
        logger.error(data);        
        res.status(400).json(data);
    }
}

function refreshToken(req, res) {
    const body = req.body;
    var data = {
    };
    if (body.refresh_token) {
        const token = body.refresh_token
        jwt.verify(token, refreshTokenSecretKey, { complete: true }, function (err, decodedToken) {

            if (err) {
                data["error"] = err;
                logger.error(err);
                res.status(401).json(data);
            } else {
              //  data["decoded_token"] = decodedToken;
                const user = {
                    "username": decodedToken.payload.username,
                    "password": decodedToken.payload.password
                };
                data["access_token"] = jwt.sign(user, privateKey, { expiresIn: tokenLife});

                const dataArry = [];
                const entries = Object.entries(data);
                for (const [data, count] of entries) {
                  dataArry.push(`${data} : ${count}`);
                }
                console.log(`Refresh Token => ${dataArry}`);
                logger.info(`Refresh Token => ${dataArry}`);
                res.json(data);
            }           
        });
    } else {
        data['error'] = 'Please proivde required data';
        logger.error(data);
        res.status(400).json(data);
    }
    
}

module.exports = router;