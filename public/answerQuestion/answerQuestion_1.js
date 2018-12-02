var commentInput = document.getElementById("comment-text");
var commentBox = document.getElementById('comment-box');
var comments = document.getElementsByClassName('comment');
var commentsNumber = document.getElementById('comment-number');
var upVoteBtns = document.getElementsByClassName('up-vote');
var downVoteBtns = document.getElementsByClassName('down-vote');
var userID = userInfo.id;
var questionID = document.getElementsByTagName('body')[0].id;

var userMakeVote = false;
var socket = io(); // kênh truyền dữ liệu
var commentData = new Map();

axios.get(`/api/answer/${questionID}`)
    .then(comments => comments.data)
    .then(comments => {
        comments.forEach(comment => {
            commentData.set(comment._id, comment);
            addCommentToDOM(comment)
        })
    })
    .catch(error => {
        alert(error);
    });

function display_enter() {
    if (document.getElementById("enter-button").style.display === "none") {
        document.getElementById("enter-button").style.display = "block";
    }
}

function add_Cmt() {
    var comment = commentInput.value;
    var newComment = {comment, question: questionID, postTime: new Date(), user: userInfo.id};
    if (comment) {
        axios.post('/api/answer/', newComment)
            .then(comment => comment.data)
            .then(comment => {
                axios.put(`/api/question/${questionID}`, {comment: comments.length + 1})
                    .then(() => {
                        comment.userFullName = userInfo.fullName;
                        socket.emit('addComment', comment);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                alert(error);
            });
    }
    commentInput.value = "";
}

// sửa lại url khi tải lại trang
window.onkeydown = (e) => {
    if (e.which === 116) {
        e.preventDefault();
        location.href = url;
    }
};

// đẩy comment vào DOM
function addCommentToDOM(commentData) {
    const fullName = commentData.userFullName ? commentData.userFullName : commentData.user.fullName;
    var comment = document.createElement('div');
    date =  new Date(commentData.postTime);

    const correctAnswerDOM = {
        displaySign: commentData.isRightAnswer ? "" : 'hidden',
        displayBtn: commentData.isRightAnswer ? "checked-activated" : ''
    };
    const markCorrectDOM = userInfo.role === 'lecturer' && userInfo.id === sessionOwner.id ?
        "<div style='display: inline'>" +
        `<button class=\"check-btn\" onclick="toggleRightAnswer(this)"><i class=\"fas fa-check ${correctAnswerDOM.displayBtn}\"></i></button> ` +
        "</div>" : "";
        comment.data = {
        postTime: commentData.postTime
    };
    comment.classList.add('comment');
    comment.id = commentData._id; // thêm id cho mỗi comment
    comment.innerHTML =
        `<div class=\"people\">${fullName}&nbsp&nbsp&nbsp•</div>` +
        `<div class=\"time\">${date.toLocaleTimeString()}&nbsp&nbsp&nbsp${date.toLocaleDateString()}
            <span class="lecturer-review ${correctAnswerDOM.displaySign}"><i class="fas fa-star"></i> Câu trả lời đúng</span></div>` +
        `<p class="comment-content">${commentData.comment}</p>` +
        "<div class=\"vote-area\">" +
            "<div style=\"float: left;\">" +
                `<span class=\"upVote-count\">${commentData.voteUp.length}</span> ` +
                `<button class=\"up-vote\" ><i class=\"fa fa-angle-up\"></i></button> ` +
                "<span style=\"color:#d6d6d6\">|</span>" +
            "</div>" +
            "<div style='display: inline'>" +
                `<span class=\"downVote-count\" >${commentData.voteDown.length}</span> ` +
                "<button class=\"down-vote\" ><i class=\"fa fa-angle-down\"></i></button> " +
                "<span style=\"color:#d6d6d6\">|</span>" +
            "</div>" +
        markCorrectDOM
        + "</div>";
    // xem liệu người dùng đã bình chọn cho phản hồi hay chưa
    let voteUpBtn = comment.querySelector('.up-vote');
    let voteDownBtn = comment.querySelector('.down-vote');
    let userMakeUpVote = commentData.voteUp.some(userID => userID === userInfo.id);
    let userMakeDownVote = commentData.voteDown.some(userID => userID === userInfo.id);
    if (userMakeUpVote) {
        voteUpBtn.previousElementSibling.classList.add('count-changed');
        voteUpBtn.children[0].classList.add('vote-icon-clicked');
    }
    if (userMakeDownVote) {
        voteDownBtn.previousElementSibling.classList.add('count-changed');
        voteDownBtn.children[0].classList.add('vote-icon-clicked');
    }

    commentBox.append(comment);
    // cap nhat lai so luong comment
    commentsNumber.innerText = (Number(commentsNumber.innerText) + 1).toString();
    sortComments();
}

function addEventToButton(button, type) {
    button.addEventListener('click', function () {
        let count = this.previousElementSibling;
        let sendData = {
            type,
            count: 0,
            commentID: this.parentElement.parentElement.parentElement.id,
            userID
        };
        this.firstChild.classList.toggle('vote-icon-clicked');
        count.classList.toggle('count-changed');
        if (count.classList.contains('count-changed')) {
            sendData.count = Number(count.innerText) + 1;
        } else {
            sendData.count = Number(count.innerText) - 1;
        }
        userMakeVote = true;
        updateVoteToServer(sendData)
    })
}

function toggleRightAnswer(checkBtn) {
    const commentElement = checkBtn.parentNode.parentNode.parentNode;
    const lecturerReview = commentElement.querySelector('.lecturer-review');
    checkBtn.children[0].classList.toggle('checked-activated');
    lecturerReview.classList.toggle('hidden');
    if (!lecturerReview.classList.contains('hidden')) {
        axios.put(`/api/answer/${commentElement.id}`, {isRightAnswer: true})
    } else {
        axios.put(`/api/answer/${commentElement.id}`, {isRightAnswer: false})
    }
}