const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next, verifyUser=false) => {
    try {
        return new Promise((resolve, reject) => {
            let token;
            if(req.cookies){
                token = req.cookies.access_token;
            }else{
                return res.status(400).json({success: false, message: "You are not authenticated"});
            }
            if(!token){
                return res.status(400).json({success: false, message: "You are not authenticated"});
            }
            jwt.verify(token, "g[hc+7^:{%&s<vGPM5sT_Zyash_p_d/4;&f!;umN", (err, user) => {
                if(err)
                    reject("Token is not valid!");
                req.user = user;
                if(!verifyUser){
                    next();
                    resolve(req.user);
                }else{
                    resolve(req.user.id);
                }
            });
        });
    } catch (error) {
        return res.status(400).json({success: false, message: "You are not authenticated", error});
    }
}