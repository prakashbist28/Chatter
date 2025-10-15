// const mongoose = require('mongoose');

// const messageSchema= new mongoose.Schema({
//     message:{
//         text: {
//             type:String,
//             required: true,
//         },
//     },
//     users: Array,
//     sender : {
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true,
//     },
//     },

//     {
//         timestamps:true,
//     }  
// );

// module.exports = mongoose.model("Messages", messageSchema)

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId], // ✅ Always store users as array
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // ✅ false by default
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

module.exports = mongoose.model("Messages", messageSchema);
