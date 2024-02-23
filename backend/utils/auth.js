const jwt = require("jsonwebtoken");
const { jwtConfig} = require ("../config");
const { User } = require("../db/models");

const { secret, expireIn } =  jwtConfig

const setTokenCookie = (res, user) => {
    //Create token

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    const token  = jwt.sign(safeUser, secret,{
        expiresIn: parseInt(expireIn)
    })
    

}
