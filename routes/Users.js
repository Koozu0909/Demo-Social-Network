const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const {jwt, sign} = require('jsonwebtoken');
const {validateToken} = require('../middlewares/AuthMiddleware');
const { route } = require("./Posts");


router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user){ res.json({ error: "User Doesn't Exist" });}
  else{
    bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
            res.json({ error: "Wrong Username And Password Combination" });
        }
        else{
        const accessToken = sign({username:user.username, id: user.id}, "importantToken")
        res.json({token:accessToken, username:user.username, id:user.id});
        }
      });
  }
});


router.get("/basicinfo/:id" , async (req,res)=>{
  const id = req.params.id;
  const user = await Users.findByPk(id, {attributes:{exclude:['password']}})
  res.json(user);
})


router.get("/check" ,validateToken, (req,res) =>{
  res.json(req.user)
})

router.put("/changepassword", validateToken, async (req,res)=>{
  const {oldPassword, newPassword} = req.body;
  const username = req.user.username;
  const user = await Users.findOne({ where: { username: username } });

    bcrypt.compare(oldPassword, user.password).then((match) => {
        if (!match) {
            res.json({ error: "Wrong Password Combination" });
        }
        else{
          bcrypt.hash(newPassword, 10).then(async (hash) => {
          await Users.update({password: hash},{where:{ username: username}});
          });
          res.json("SUCCESS CHANGE");
        }
      });
})


module.exports = router;
