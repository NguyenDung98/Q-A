let inputBox = document.getElementById('form-input'),
    questionInput = document.getElementById("input-question"),
    authorInput = document.getElementById("input-author"),
    doneButton = document.getElementById("done-button"),
    cancelButton = document.getElementById("cancel-button"),
    table = document.getElementsByTagName('table')[0],
    voteIcons = document.getElementsByClassName('vote-icon'),
    userIdentity = document.querySelector('#user-id span'),
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

userIdentity.innerText += userID;
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

// sửa lại url khi tải lại trang
window.onkeydown = (e) => {
    if (e.which === 116) {
        e.preventDefault();
        location.href = url;
    }
};

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
            session: sessionID,
            order: table.rows.length + 1
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

// Thêm câu hỏi mới
function addQuestion(newQuestion) {
    let replyButton = document.createElement("input");
    replyButton.type = "button";
    replyButton.classList.add("reply-button");
    replyButton.value = "Reply";

    let newRow = table.insertRow(0);

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);

    newRow.data = {
        postTime: newQuestion.postTime
    };
    newRow.id = newQuestion._id;
    newRow.classList.add('question-block');
    cell1.innerHTML =
        "<i class=\"fas fa-caret-up vote-icon\"></i><br>" +
        `<span class=\"vote-count\">${newQuestion.vote}</span><br>` +
        "<span>lượt</span>";
    cell1.classList.add("vote-zone");
    cell2.innerHTML =
        `<span class="author">${newQuestion.user}</span><br>` +
        `<span class="question">${newQuestion.question}</span>`;
    // xử lí khoảng xuống dòng khi có nhiều dòng được thêm vào
    let breakLines = newQuestion.question.length / 88; // mỗi dòng có trung bình 88 kí tự
    for (let i = 0; i < 3 - breakLines; i++) {
        cell2.innerHTML += '<br/>';
    }
    if (breakLines > 2) cell2.innerHTML += '<br/>';
    cell2.innerHTML += `<a type="button" onclick="gotoAnswerPage('${newQuestion._id}', '${newQuestion.order}')" class="reply-button">${newQuestion.comment} phản hồi</a>`;
    // sap xep lai cac cau hoi
    sortQuestions();
}

function gotoAnswerPage(questionID, questionOrder) {
    window.history.replaceState({}, document.title, url);
    location.href = clean_uri + `/question/${questionOrder}${query}&question=${questionID}`;
}