var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const {checkBody} = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

//Inscription d'un nouvel utilisateur
//Vérification que tous les champs soient bien saisis
router.post('/signup', (req, res) => {
  if(!checkBody(req.body, ['firstName', 'username', 'password'])){
    res.json({result : false, error : 'Missing or empty fields'});
    return
  }
  //Check si un utilisateur n'est pas déjà inscrit sinon création d'un compte
  User.findOne({username : req.body.username}).then(data => {
    if (data === null){
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstName : req.body.firstName,
        username : req.body.username,
        password: hash,
        token : uid2(32)
      })
      newUser.save().then(newData => {
        res.json({result: true, token : newData.token})
      })
    } else {
      res.json({result: false, error : 'User already exist'})
    }
  })
});

//Connection d'un utilisateur
router.post('/signin', (req, res)  => {
  if(!checkBody(req.body, ['username', 'password'])){
    res.json({result: false, error: 'Missing or empty fields'});
    return
  }
  User.findOne({username : req.body.username}).then(data => {
    if(data && bcrypt.compareSync(req.body.password, data.password)){
      res.json({result: true, token : data.token})
    } else {
      res.json({result: false, error :' User not found or wrong password'})
    }
  })
})

router.get('/:token', (req, res) => {
  User.findOne({token : req.params.token}).then(data => {
    if(data){
      res.json({result: true, firstName : data.firstName, username : data.username})
    } else {
      res.json({result : false, error: 'User not found'})
    }
  })
})



module.exports = router;
