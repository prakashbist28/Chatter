const User = require('../models/usermodel')
const bcrypt = require("bcrypt")//for password encryption

module.exports.register = async(req,res,next) => {
    try{
        const {username,email,password} = req.body;

    const usernameCheck = await User.findOne({username});
    if(usernameCheck){
        return res.json({msg:"username already used", status: false})  
    }

    const emailCheck = await User.findOne({email});
    if(emailCheck){
        return res.json({msg: "Email id is already registered", status: false})
    }

    const hashedPassword = await bcrypt.hash(password, 10);//salt 
    const user = await User.create({ //to insert items into db
        email,
        username,
        password:hashedPassword,
    }); //returns user id and all info of user
    const userObj = user.toObject();
    delete userObj.password;
    return res.json({status:true, userObj })
    }
    catch (ex){
        next(ex);
    }
}

module.exports.login = async(req,res,next) => {
    try{

        const {username,password} = req.body;

    const user = await User.findOne({username});
    if(!user){
        return res.json({msg:"Incorrect username or password", status: false})  
    }

//compare passwords sent from login page of frontend with the ones in db
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.json({msg:"Incorrect username or password", status:false})
    }
    delete user.password;//we dont need password
    return res.json({status:true, user})
    }
    catch (ex){
        next(ex);
    }
}

module.exports.setavatar = async(req,res,next)=>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, 
            { isAvatarImageSet: true, avatarImage },
            { new: true } 
            );
        return res.json({
            isSet:userData.isAvatarImageSet,
            image:userData.avatarImage
        })

    } catch(ex){
        next(ex);
    }
}

module.exports.getallusers= async(req,res,next) => {
    try{
        const users= await User.find({_id: {$ne : req.params.id}}).select([ //$ne selects the documents where the value of the field is not equal to the specified value
            "email",
            "username",
            "avatarImage",
            "_id",
        ])
        return res.json(users);
    }catch(ex){
        next(ex)
    }
}