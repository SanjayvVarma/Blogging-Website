const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthModel } = require("../models")
require("dotenv").config();

const signUp = async (req,res) => {

    try{

        const {userName, password, email} = req.body;
        const SALT_ROUND = process.env.SALT_ROUND;

        if(!userName || !password || !email){
            const errObj = {
                statusCode : 404,
                message : "Please give all require details"
            }
            throw new Error(JSON.stringify(errObj));
        };

        const userExists = await AuthModel.findOne({email : email});

        if(userExists){
            const errObj = {
                statusCode : 404,
                message : "User already exists"
            }

            throw new Error(JSON.stringify(errObj));
        }

        const salt = await bcrypt.genSalt(Number(SALT_ROUND));
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new AuthModel({
            userName,
            email,
            password : hashedPassword
        });

        const user = await newUser.save();
        res.status(201).json({
            message : "Account creation successful",
            userId : user._id
        });

    }catch(err){
        
        const error = JSON.parse(err.message);
        return res.status(error.statusCode || 500).json({
            message : error.message || "INTERNAL SERVER ERROR OCCURED"
        })

    };
};

const logIn =async (req,res) => {

    try{
        
        const {email,password} = req.body;
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        if(!email || !password){

            const errObj = {
                statusCode : 404,
                message : "Please enter all required credentials"
            }

            throw new Error(JSON.stringify(errObj));
        }

        const user = await AuthModel.findOne({email : email});

        if(!user){

            const errObj = {
                statusCode : 400,
                message : "Invalid credentials"
            }
            throw new Error(JSON.stringify(errObj));

        }

        const userVerification = await bcrypt.compare(password,user.password);

        if(!userVerification){

            const errObj = {
                statusCode : 400,
                message : "Invalid credentials"
            }
            throw new Error(JSON.stringify(errObj));

        }

        let token = jwt.sign({
            userId : user._id
        },JWT_SECRET_KEY,{expiresIn : 60 * 60});

        token = `Bearer ${token}`;

        user.token = token;

        user.save();


        res.status(200).json({
            message : "Login successful",
            token : token
        })

    }catch(err){

        const error = JSON.parse(err.message);
        return res.status(error.statusCode || 500).json({
            message : error.message || "INTERNAL SERVER ERROR OCCURED"
        })

    }

};

const logOut =async (req,res) => {

    await AuthModel.findByIdAndUpdate(req.user._id,{token : null});
    res.status(200).json({
        message : "Logout succesfull"
    })

};

module.exports = {
    signUp,
    logIn,
    logOut
}