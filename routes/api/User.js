const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const UserModel = require('../../models/Users');
const authorize = require('../../Authorization')


const JoiUserSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    email:Joi.string().email({minDomainSegments:2}).min(8).required(),
    password: Joi.string().trim().min(6).max(50).required(),
});




/*
Method:     GET
Access:     Private
Desc:       Get user credentials
*/

router.get('/', authorize, async (req, res)=>{
    try{
        const response = await UserModel.find({_id:req.user_id});
        if(!response){
            return res.status(404).json({error:'User not found'})
        }
        return res.json({
            name:response[0].name,
            email:response[0].email
        })
    }
    catch(err){
        return res.status(400).json(err)
    }
})




// *****************************************************************************

/*
Method:     POST
Access:     Public
Desc:       Login Existing User
*/

router.post('/',(req, res) =>{
    const currentUser = {
        email:req.body.email,
        password: req.body.password
    }
    UserModel.findOne({email:currentUser.email})
        .then(user => {
            bcrypt.compare(currentUser.password, user.password )
                .then(passwordMatched =>{
                    if(passwordMatched){
                        const payload = {
                            id:user.id,
                            name: user.name
                        }
                        const token = jwt.sign(payload, process.env.SECRET,{algorithm:'HS384', expiresIn:'5h'});
                        return res.json({
                            message: 'Successfully Logged In',
                            token,
                            name:user.name, 
                            email:user.email,
                            expiry: Date.now() + (5*60*60*1000)
                        })
                    }
                    return res.status(400).json({
                        // error: 'Email and Password incorrect'
                        error: 'Password incorrect'
                    })
                })
        })
        .catch(err => res.status(400).json({error:'User not found'}))
})


// *****************************************************************************


/*
Method:     POST
Access:     Public
Desc:       Register User
*/

router.post('/new', (req, res) =>{
    const {name, email, password} = req.body;
    // validate input
        const {error, value} = JoiUserSchema.validate({name, email, password})
        if(error){
            // validating input
            return res.status(422).json({error:error.details[0].message})
        }
        else{
            // check if user exists or not
            UserModel.findOne({email: value.email})
                .then(exists =>{
                    if(exists){
                        return res.status(409).json({error:'Email already exists'})
                    }
                    bcrypt.genSalt(10).then(salt =>{
                        bcrypt.hash(value.password,salt)
                            .then(hashedPassword =>{
                                value.password = hashedPassword;
                                UserModel.create({...value})
                                    .then(()=> res.status(200).json({message:'User created. Kindly login'}))
                            })
                    })
                }).catch(err => res.status(404).json(err))

        }       
})


// *****************************************************************************



module.exports = router;