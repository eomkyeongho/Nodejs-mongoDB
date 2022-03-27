const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoDBNamespace } = require('mongodb');
app.use(bodyParser.urlencoded({extended: true}));

var db;
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.scygd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err, client)
{
    if (err) return console.log(err);

    db = client.db('ToDoApp');

    app.listen(8080, function() 
    {
        console.log('listening on 8080...');
    });
});

app.get('/', function(request, response)
{
    response.sendFile(__dirname + '/index.html');
});

app.get('/write', function(request, response)
{
    response.sendFile(__dirname + '/write.html');
});

app.get('/list', function(request, response)
{
    db.collection('post').find().toArray(function(err, result)
    {
        response.render('list.ejs', { posts : result });
    });
});

app.post('/add', function(request, response)
{
    db.collection('counter').findOne({name:'postNum'}, function(err, result)
    {
        db.collection('post').insertOne({_id : result.totalPost + 1, title : request.body.title, date : request.body.date}, function(err, result)
        {
            console.log('저장 완료');
            db.collection('counter').updateOne({name:'postNum'}, { $inc : {totalPost:1}}, function(){})
        });
    });
    response.write("<script>alert('success')</script>");
    response.write("<script>window.location=\"/list\"</script>");
});

app.delete('/delete', function(request, response)
{
    request.body._id = parseInt(request.body._id);
    db.collection('post').deleteOne(request.body, function(err, result){});
    response.write("<script>alert('success')</script>");
    response.write("<script>window.location=\"/list\"</script>");
});