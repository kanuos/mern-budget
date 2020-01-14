const jwt = require('jsonwebtoken');


module.exports = (req, res, next) =>{


    const token = req.headers.authorization;
    
    if(!token){
        res.status(401).json({error:'Unauthorized access'})
    }
    else{
        jwt.verify(token,process.env.SECRET, (err, decoded)=>{
            if(err){
                res.status(404).json({error:'Session Expired. Please log in again'})
            }
            else{
                req.user_id = decoded.id;
                next();

            }
        })
    }
}