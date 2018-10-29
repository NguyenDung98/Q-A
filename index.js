let express       = require("express"),
    app           = express(),
    bodyParser    = require('body-parser'),
    http          = require("http").Server(app),
    io            = require('socket.io')(http),
    questionRoute = require('./routes/question');
    answerRoute   = require('./routes/answer');
// cau hinh express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use('/api/question', questionRoute);
app.use('/api/answer', answerRoute);
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/askingQuestion.html");
});

app.get('/answer', (req, res) => {
    res.sendFile(__dirname + "/views/answerQuestion.html");
});

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
    })
});

http.listen(3000, () => {
    console.log("App is running!");
});