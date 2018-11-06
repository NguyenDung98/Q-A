let express       = require("express"),
    app           = express(),
    bodyParser    = require('body-parser'),
    http          = require("http").Server(app),
    io            = require('socket.io')(http),
    questionRoute = require('./routes/question'),
    answerRoute   = require('./routes/comment'),
    sessionRoute  = require('./routes/session'),
    appRoute      = require('./routes/app');
    userRoute     = require('./routes/user');

// cau hinh express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use('/api/question', questionRoute);
app.use('/api/answer', answerRoute);
app.use('/api/session', sessionRoute);
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
    // kenh them session
    socket.on('addSession', session => {
        io.emit('addSession', session)
    })
});

http.listen(3000, () => {
    console.log("App is running!");
});