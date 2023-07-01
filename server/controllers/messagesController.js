const messagemodel = require("../models/messagemodel");

module.exports.addMsg = async(req,res,next) => {

    try{
        const {from, to,message} = req.body;
        const data= await messagemodel.create({
            message:{text:message},
            users:{from, to},
            sender: from,
        }) 

        if(data){
            return res.json({msg:"Message added successfully"})
        }
        else{
            return res.json({msg:"failed to add message"})
        }

    }catch(ex){
        next(ex)
    }

 };


module.exports.getAllMessage = async(req,res,next) => { 

    try{
        const {from, to} = req.body;
        const messages = await messagemodel.find({
            users:{
                $all:{from,to},
            }
        }).sort({updatedAt: 1})

        const projectedMessages = messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString() === from,
                message: msg.message.text,
            }
        })
        res.json(projectedMessages)
    }catch(ex){
        next(ex)
    }

};