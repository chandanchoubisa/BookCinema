var express = require("express"),
    fs = require('fs'),
    port = process.env.PORT || 2595;
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chandanchoubisa24@gmail.com',
        pass: '*********'
    }
});

var bookings = [];
var app = express();
//app.use(express.logger());
app.use(express.json());
app.use(express.urlencoded());
app.set("view options", {
    layout: false
});
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('public/index.html');
});

app.get('/movies', function(req, res) {
    var movies = require('./data/movies.json');
    res.json(movies);
});


app.get('/bookings', function(req, res) {
    res.json(bookings);
});

app.post('/book', function(req, res) {
    var data = {
        'qty': req.body.qty,
        'date': req.body.date,
        'id': req.body.movie_id,
        'name': req.body.movie_name
    };
    bookings.push(data);
    //console.log(data.qty);
    // res.render('public/tmpl/bookings.html');
    res.json(bookings);
});
app.post('/test', function(req, res) {
    console.log(req.body);
})
app.post('/userInfo', function(req, res) {
    console.log(req.body);
    //var mailOptions = {};
    let mailOptions = {
        from: 'chandanchoubisa24@gmail.com',
        to: req.body.emailId,
        subject: 'Tickets for your show Confirmed',
        text: 'Your tickets for the show ' + req.body.seats + ' Enjoy it'
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(req.body.emailId);
            console.log('Email sent: ' + info.response);
            console.log("hello sir");

        }
    })
});
app.listen(port);
console.log('Express server running at http://localhost:' + port);