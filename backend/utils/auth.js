const jwt = require("jsonwebtoken");
const { jwtConfig} = require ("../config");
const { User } = require("../db/models");

const { secret, expiresIn } =  jwtConfig

const setTokenCookie = (res, user) => {
    //Create token

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    const token  = jwt.sign({data: safeUser}, secret,{
        expiresIn: parseInt(expiresIn)
    })

    const isProdction = process.env.NODE_ENV === "production";
    // Set the token cookie

    res.cookie("token", token, {
        maxAge: expiresIn * 1000, // maxAge in millisecond
        httpOnly: true,
        secure: isProdction,
        sameSite: isProdction & "Lax"


    
    })
    return token
    

};

// 
const restoreUser = (req, res, next ) => {
    const { token } = req.cookies;
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
            res.clearCookie("token");
           return  next()

        }
        if(!req.user) res.clearCookie("token")
        return next();
    

    })
};

const requireAuth = function (req, _res, next) {
    if(req.user) return next()
    const err = new Error("Authentication required");
    err.title = "Authentication required";
    err.errors =  {message: "Authentication required"};
    err.status = 401;
    return next(err)
}
 
module.exports = { setTokenCookie, restoreUser, requireAuth }