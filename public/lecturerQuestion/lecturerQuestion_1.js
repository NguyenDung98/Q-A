let inputBox = document.getElementById('form-input'),
    table = document.getElementsByTagName('table')[0],
    voteIcons = document.getElementsByClassName('vote-icon'),
    userIdentity = document.querySelector('#user-id span'),
    sessionID = document.getElementsByTagName('body')[0].id,
    surveyBtn = document.getElementById('survey-button');

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
surveyBtn.disabled = surveyCreated;

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
    let uri = location.host + location.pathname.substring(location.pathname.indexOf('/', 1));
    window.history.replaceState({}, document.title, url);
    location.href = 'http://' + uri + `/question/${questionOrder}${query}&question=${questionID}`;
}

function makeSurvey(surveyBtn, isCreated) {
    if (!isCreated) {
        const updateData = {
            survey: {
                isCreated: true
            }
        };
        axios.put(`/api/session/${sessionID}`, updateData);
    }
    surveyBtn.disabled = true;
}