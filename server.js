// ./server.js
// Load dependencies
var express = require('express');
var mongoose = require('mongoose');
var morgan       = require('morgan');
var bodyParser = require('body-parser');
var user = require('./app/model.js');
var cors = require('cors');
var app = express();

app.use(cors());


var app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/dbtest');


app.use(bodyParser.json())
app.post('/login-with-facebook', async(res,req)=>{
   
    const accessToken = req.body
    const userID = req.body
    console.log(accessToken,userID)
    const response = await fetch(`https://graph.facebook.com/v3.1/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`);
    const json = await response.json()

    console.log(response)
    console.log(json)

    if(json.id === userID){
        const resp = await user.findOne({facebookID:userID})
        if(resp){
            res.json({status:'Ok', data:'Te has logeado'})
        }else {
            const person = new user({
                name :'somenthing',
                facebookID:userID,
                accessToken
            })
                await person.save()
            res.json({status:'Ok', data:'Te has registrado y logeado correctamente'})
        }
    }else {
        res.json({status:'error',data:'No se ha podido logear'})
    }
})


app.set('port', process.env.PORT || 3000);

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Routes
require('./routes')(app);

var port = app.get('port');
app.listen(port, function () {
    console.log('App running at ' + port);
});
