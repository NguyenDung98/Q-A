let inputBox = document.getElementById('form-input'),
    questionInput = document.getElementById("input-question"),
    authorInput = document.getElementById("input-author"),
    doneButton = document.getElementById("done-button"),
    cancelButton = document.getElementById("cancel-button"),
    table = document.getElementsByTagName('table')[0],
    voteIcons = document.getElementsByClassName('vote-icon'),
    userIdentify = document.querySelector('#user-id span'),
    sessionID = document.getElementsByTagName('body')[0].id;

// local variables
let userID = 1 + Math.random();
let userMakeVote = false; // đánh dấu người dùng vote câu hỏi hay chưa (trong trường hợp người dùng đăng nhập và mở 2 tab)
let socket = io();
// loader
let loader = document.createElement('div');
let bigLoader = loader.cloneNode(true);
loader.classList.add('loader');

bigLoader.classList.add('loader-container');
bigLoader.innerHTML += '<div></div>';
bigLoader.firstElementChild.classList.add('loader', 'big-loader');

userIdentify.innerText += userID;
inputBox.append(bigLoader);

// lấy dữ liệu từ server
axios.get(`/api/question/${sessionID}`)
    .then(questions => questions.data)
    .then(questions => {
        inputBox.removeChild(bigLoader);
        questions.forEach(question => {
            addQuestion(question)
        })
    })
    .catch(error => {
        console.log(error)
    });

function getVal() {
    if (questionInput.value.trim() === "") {
        questionInput.style.border = "1px solid red";
    }
    else {
        let user = authorInput.value.trim() ? authorInput.value.trim() : "Ẩn danh";
        let newQuestion = {
            user,
            question: questionInput.value,
            postTime: new Date(),
            session: sessionID
        };
        inputBox.append(bigLoader);
        // đẩy câu hỏi mới lên server
        axios.post('/api/question/', newQuestion)
            .then(question => question.data)
            .then(question => {
                inputBox.removeChild(bigLoader);
                socket.emit('addQuestion', question);
            })
            .catch(error => {
                alert(error);
            });

        questionInput.style.border = "2px solid #aaa";
        authorInput.style.display = "none";
        doneButton.style.display = "none";
        cancelButton.style.display = "none";
    }
    questionInput.value = "";
    document.getElementById("input-author").value = "";
}

function focusFunction() {
    authorInput.style.display = "block";
    doneButton.style.display = "block";
    cancelButton.style.display = "block";
}

function cancelAddQuestion() {
    questionInput.value = "";
    document.getElementById("input-author").value = "";
    questionInput.style.border = "2px solid #aaa";
    authorInput.style.display = "none";
    doneButton.style.display = "none";
    cancelButton.style.display = "none";
}