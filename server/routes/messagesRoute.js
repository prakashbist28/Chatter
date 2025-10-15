const { addMsg, getAllMessage, getLatestMessages, markAsRead } = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/addmsg", addMsg);
router.post("/getmsg", getAllMessage);

// Get latest messages with unread counts
router.get("/latest/:userId", getLatestMessages);

// Mark messages as read
router.post("/mark-read", markAsRead);

module.exports = router;
