let inputBox = document.getElementById('form-input'),
    table = document.getElementsByTagName('table')[0],
    voteIcons = document.getElementsByClassName('vote-icon'),
    userIdentity = document.querySelector('#user-id span'),
    sessionID = document.getElementsByTagName('body')[0].id,
    surveyBtn = document.getElementById('survey-button'),
    reportModal = document.getElementById('report-modal'),
    reportChart = document.getElementById('report-chart'),
    feedbackModal = document.getElementById('feedback-modal'),
    feedbackContent = document.querySelector('#feedback-modal .modal-body');

let chart = null;
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

function showReportModal() {
    reportModal.classList.remove('hidden');
    axios.get(`/api/session/${sessionID}`)
        .then(data => data.data)
        .then(data => {
            const filteredData = data.survey.data.reduce((accumulator, currentValue) => {
                if (currentValue.answer === 0) {
                    accumulator[0] += 1;
                } else {
                    accumulator[1] += 1;
                }
                return accumulator;
            }, [0, 0]);
            createChart(filteredData);
        })
}

function closeReportModal() {
    reportModal.classList.add('hidden');
    feedbackModal.classList.add('hidden');
}

function showFeedbackModal() {
    feedbackModal.classList.remove('hidden');
    let feedbackDOM;
    axios.get(`/api/session/${sessionID}`)
        .then(data => data.data)
        .then(data => {
            feedbackDOM = data.survey.data.map(data => {
                if (data.feedback) {
                    return `
                    <div>
                        <p class="author">${data.user.fullName}</p>
                        <p class="question-block">${data.feedback}</p>
                        <hr>
                    </div>`;
                }
            });
            feedbackContent.innerHTML = '';
            feedbackDOM.forEach(feedback => {
                feedbackContent.innerHTML += feedback;
            });
        });
}

window.onclick = (e) => {
    if (e.target.id === 'report-modal') {
        reportModal.classList.add('hidden');
    }
    if (e.target.id === 'feedback-modal') {
        feedbackModal.classList.add('hidden');
    }
};

function createChart(data) {
    if (!chart) {
        chart = new Chart(reportChart, {
            type: 'doughnut',
            data: {
                labels: ["Không tốt", "Tốt"],
                datasets: [{
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ]
                }]
            },
            options: {
                responsive: true,
                legend: {
                    labels: {
                        fontSize: 25
                    },
                },
                tooltips: {
                    titleFontSize: 25,
                    bodyFontSize: 25
                },
                title: {
                    display: true,
                    text: 'Thống kê khảo sát của sinh viên về giờ học',
                    fontSize: 40,
                    fontFamily: 'Roboto,Helvetica,Arial,Microsoft YaHei,SimHei,sans-serif'
                }
            }
        });
    } else {
        chart.data.datasets.forEach(oldData => {
            oldData.data = data;
        });
        chart.update();
    }
}