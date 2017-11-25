const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken')

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());

app.use(express.static(__dirname + '/public'));

var usermap = {};

app.post('/create',(req, res) => {
    console.log('Create');
    var body = _.pick(req.body, ['user', 'password'])
    var userdata = {pass: body['password']}
    if(body['user'] in usermap) {
      res.send({
        update: 'No',
        currentUsers: usermap
      })
    }
    else {
      usermap[body['user']] = userdata
      res.send({
        update: 'Yes',
        currentUsers: usermap
      })
    }

});


app.post('/token',(req, res) => {

    var body = _.pick(req.body, ['user', 'password'])
    if(usermap[body['user']] && body['password'] == usermap[body['user']]['pass'])
    {
      var secret = body['user']
      var token = jwt.sign(body['user'], body['password'])

      res.send({
        user: body['user'],
        token
      });
    } else {
      res.send('User not exists/Wrong Password');
    }

});

app.post('/verify',(req, res) => {

    var body = _.pick(req.body, ['user', 'token'])
    if(body['user'] in usermap) {
      try{
        var valid = jwt.verify(body['token'], usermap[body['user']]['pass'])
        res.send('You are ' + valid + '.')
      }
      catch(err){
        res.send('Token not matched!');
      }
    } else {
      res.send('User not exists');
    }

});

app.listen(3000, () => {
  console.log('Re-run...');
});
