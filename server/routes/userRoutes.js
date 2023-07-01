const {register,login,setavatar,getallusers}= require("../controllers/usersController")


const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/setavatar/:id", setavatar);

router.get("/allusers/:id", getallusers)
//get all users except current user

module.exports = router;
