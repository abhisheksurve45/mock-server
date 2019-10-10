const express = require('express')
const bodyParser = require("body-parser");
const { MongoClient, url } = require('./db/mongo')

const port = 8005
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/get-player', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sports");
        dbo.collection("playerData").find({}, {projection:{'_id':0 }}).toArray(function(err, result) {
          if (err) res.send({'code':500, 'message':'Please try after sometime!', 'data': []});
          res.send({'code':200, 'message':'success', 'data': result});
        });
    });
})


app.delete('/delete-player/:id', (req, res) => {
    MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sports");
        dbo.collection("playerData").deleteOne({'id': parseInt(req.params.id)}, function(err, obj) {
          if (err) res.send({'code':400, 'message':'Player does not exist!', 'data': []});
          res.send({'code':200, 'message': obj.result.n + ' player removed!', 'data': []});
        });
    });
})

app.post('/add-player', (req, res) => {
    MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sports");
        if(req.body.name && req.body.avg){
            dbo.collection("playerData").insertOne({id : parseInt(Math.random() * 100, 10),name : req.body.name,average : parseInt(req.body.avg)} , function(err, response) {
            if (err) res.send({'code':503, 'message':'Please try after sometime!', 'data': []});;
                res.send({'code':200, 'message': 'Successfully added player!', 'data': []});
              });
            }else{
                res.send({'code':400, 'message': 'All fields are necessary!', 'data': []});
            }
    });
})

//middleware
app.use(function(req, res, next){
    res.send({'code':404, 'message':'The server can not find the requested page!', 'data': []});
});

app.listen(port, () => console.log('Listening on port ' + port))
