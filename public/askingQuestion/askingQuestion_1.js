let inputBox = document.getElementById('form-input'),
    questionInput = document.getElementById("input-question"),
    surveyModal = document.getElementById('survey-modal'),
    doneButton = document.getElementById("done-button"),
    cancelButton = document.getElementById("cancel-button"),
    table = document.getElementsByTagName('table')[0],
    voteIcons = document.getElementsByClassName('vote-icon'),
    userIdentity = document.querySelector('#user-id span'),
    sessionID = document.getElementsByTagName('body')[0].id;

// local variables
let userMakeVote = false; // đánh dấu người dùng vote câu hỏi hay chưa (trong trường hợp người dùng đăng nhập và mở 2 tab)
let socket = io();
let questionData = new Map();
// loader
let loader = document.createElement('div');
let bigLoader = loader.cloneNode(true);

loader.classList.add('loader');

bigLoader.classList.add('loader-container');
bigLoader.innerHTML += '<div></div>';
bigLoader.firstElementChild.classList.add('loader', 'big-loader');

userIdentity.innerText += userInfo.fullName;
inputBox.append(bigLoader);

if (surveyCreated && !userHasTakenSurvey) {
    surveyModal.classList.remove('hidden');
}

// lấy dữ liệu từ server
axios.get(`/api/question/${sessionID}`)
    .then(questions => questions.data)
    .then(questions => {
        inputBox.removeChild(bigLoader);
        questions.forEach(question => {
            questionData.set(question._id, question);
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
        let newQuestion = {
            user: userInfo.id,
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
                question.userFullName = userInfo.fullName;
                socket.emit('addQuestion', question);
            })
            .catch(error => {
                alert(error);
            });

        questionInput.style.border = "2px solid #aaa";
        // authorInput.style.display = "none";
        doneButton.style.display = "none";
        cancelButton.style.display = "none";
    }
    questionInput.value = "";
    // document.getElementById("input-author").value = "";
}

function focusFunction() {
    // authorInput.style.display = "block";
    doneButton.style.display = "block";
    cancelButton.style.display = "block";
}

function cancelAddQuestion() {
    questionInput.value = "";
    // document.getElementById("input-author").value = "";
    questionInput.style.border = "2px solid #aaa";
    // authorInput.style.display = "none";
    doneButton.style.display = "none";
    cancelButton.style.display = "none";
}

// Thêm câu hỏi mới
function addQuestion(newQuestion) {
    const fullName = newQuestion.userFullName ? newQuestion.userFullName : newQuestion.user.fullName;
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
        `<span class=\"vote-count\">${newQuestion.vote.length}</span><br>` +
        "<span>lượt</span>";
    cell1.classList.add("vote-zone");
    cell2.innerHTML =
        `<span class="author">${fullName}</span><br>` +
        `<span class="question">${newQuestion.question}</span>`;
    // xem liệu người dùng đã bình chọn cho câu hỏi hay chưa
    userMakeVote = newQuestion.vote.some(userID => userID === userInfo.id);
    if (userMakeVote) cell1.children[0].classList.add('vote-icon-clicked');
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

function closeSurveyModal() {
    surveyModal.classList.add('hidden');
}

window.onclick = (e) => {
    if (e.target.id === 'survey-modal') {
        surveyModal.classList.add('hidden');
    }
};