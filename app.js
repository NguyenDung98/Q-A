let express = require("express"),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    http = require("http").Server(app),
    io = require('socket.io')(http),
    questionRoute = require('./routes/question'),
    answerRoute = require('./routes/comment'),
    sessionRoute = require('./routes/session'),
    appRoute = require('./routes/index'),
    userRoute = require('./routes/user');

// cau hinh express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'Nothing',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use('', questionRoute);
app.use('', answerRoute);
app.use('', sessionRoute);
app.use('/api/user', userRoute);
app.use('', appRoute);

io.on('connection', socket => {
    // kenh cau hoi
    socket.on('addQuestion', question => {
        io.emit('addQuestion', question)
    });
    socket.on('moreVoteQuestion', vote => {
        io.emit('moreVoteQuestion', vote)
    });
    // kenh phan hoi
    socket.on('addComment', comment => {
        io.emit('addComment', comment)
    });
    socket.on('moreVoteComment', vote => {
        io.emit('moreVoteComment', vote);
    });
    // kenh session
    socket.on('addSession', session => {
        io.emit('addSession', session)
    });
    socket.on('updateSession', session => {
        io.emit('updateSession', session)
    });
    socket.on('deleteSession', sessionID => {
        io.emit('deleteSession', sessionID)
    })
});

http.listen(3000, () => {
    console.log("App is running!");
});