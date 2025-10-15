// const messagemodel = require("../models/messagemodel");

// module.exports.addMsg = async(req,res,next) => {

//     try{
//         const {from, to,message} = req.body;
//         const data= await messagemodel.create({
//             message:{text:message},
//             users:{from, to},
//             sender: from,
//         }) 

//         if(data){
//             return res.json({msg:"Message added successfully"})
//         }
//         else{
//             return res.json({msg:"failed to add message"})
//         }

//     }catch(ex){
//         next(ex)
//     }

//  };


// module.exports.getAllMessage = async(req,res,next) => { 

//     try{
//         const {from, to} = req.body;
//         const messages = await messagemodel.find({
//             users:{
//                 $all:{from,to},
//             }
//         }).sort({ createdAt: 1})

//         const projectedMessages = messages.map((msg)=>{
//             return{
//                 fromSelf:msg.sender.toString() === from,
//                 message: msg.message.text,
//                 createdAt: msg.createdAt,
//             }
//         })
//         res.json(projectedMessages)
//     }catch(ex){
//         next(ex)
//     }

// };

const MessageModel = require("../models/messagemodel");
const mongoose = require("mongoose");

// Add a new message
module.exports.addMsg = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to], // ✅ Store as array
      sender: from,
      receiver: to,
      isRead: false, // ✅ Unread initially
    });

    if (data) {
      return res.json({ msg: "Message added successfully", status: true });
    }
    return res.json({ msg: "Failed to add message", status: false });
  } catch (ex) {
    next(ex);
  }
};

// Get all messages between two users
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Fetch all messages between two users
    const messages = await MessageModel.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });

    // Mark messages from `to` → `from` as read
    await MessageModel.updateMany(
      { sender: to, receiver: from, isRead: false },
      { $set: { isRead: true } }
    );

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
    }));

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

// ✅ Get latest message per contact with unread count
module.exports.getLatestMessages = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const latestMessages = await MessageModel.aggregate([
        // Match messages where the user is either sender or receiver
        {
          $match: {
            users: { $in: [userObjectId] },
          },
        },
        // Sort by latest messages first
        { $sort: { createdAt: -1 } },
        // Group by the other contact
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", userObjectId] },
                "$receiver",
                "$sender",
              ],
            },
            lastMessage: { $first: "$message.text" },
            lastMessageTime: { $first: "$createdAt" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$receiver", userObjectId] },
                      { $eq: ["$isRead", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            contactId: "$_id",
            lastMessage: 1,
            lastMessageTime: 1,
            unreadCount: 1,
          },
        },
        { $sort: { lastMessageTime: -1 } },
      ]);
  
      res.json(latestMessages);
    } catch (err) {
      next(err);
    }
  };
  

  module.exports.markAsRead = async (req, res, next) => {
  try {
    const { userId, contactId } = req.body;
    await MessageModel.updateMany(
      { sender: contactId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ msg: "Messages marked as read", status: true });
  } catch (ex) {
    next(ex);
  }
};
