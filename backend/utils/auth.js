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

    const token  = jwt.sign({data: safeUser}, secret,{
        expiresIn: parseInt(expireIn)
    })
    

};

// 
const restoreUser = (req, res, next ) => {
    const { token } = req.body;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayLoad) => {
        if (err){
            return next()
        }
        try {
            const { id } = jwtPayLoad.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ["email", "createdAt", "updatedAt"]
                }
            })
             

        }
        catch(err) {
            res.clearCookie(token);
           return  next()

        }
        if(!req.user) res.clearCookie("token")
        return next();
    

    })
}
