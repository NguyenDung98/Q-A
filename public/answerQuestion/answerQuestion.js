var commentInput = document.getElementById("comment-text");
var commentBox = document.getElementById('comment-box');
var comments = document.getElementsByClassName('comment');
var commentsNumber = document.getElementById('comment-number');
var upVoteBtns = document.getElementsByClassName('up-vote');
var downVoteBtns = document.getElementsByClassName('down-vote');
var userID = 1 + Math.random();

var socket = io(); // kênh truyền dữ liệu

axios.get('/api/answer/')
    .then(comments => comments.data)
    .then(comments => {
        comments.forEach(comment => {
            addCommentToDOM(comment)
        })
    })
    .catch(error => {
        console.log(error)
    });

function display_enter() {
    if (document.getElementById("enter-button").style.display == "none") {
        document.getElementById("enter-button").style.display = "block";
    }
}

function add_Cmt() {
    var comment = commentInput.value;
    var newComment = {comment};
    axios.post('/api/answer/', newComment)
        .then(comment => comment.data)
        .then(comment => {
            // đẩy dữ liệu qua kênh 'addComment'
            socket.emit('addComment', comment);
        })
        .catch(error => {
            alert(error);
        });
    commentInput.value = "";
}

// đẩy comment vào DOM
function addCommentToDOM(commentData) {
    var comment = document.createElement('div');
    comment.classList.add('comment');
    comment.id = commentData._id; // thêm id cho mỗi comment
    comment.innerHTML =
        `<div class=\"people\">${commentData.user} •</div>` +
        "<div class=\"time\">0 phút trước</div>" +
        `<p class="comment-content">${commentData.comment}</p>` +
        "<div class=\"vote-area\">" +
        "<div style=\"float: left;\">" +
        `<span class=\"upVote-count\">${commentData.voteUp}</span>` +
        `<button class=\"up-vote\" ><i class=\"fa fa-angle-up\"></i></button> ` +
        "<span style=\"color:#d6d6d6\">|</span>" +
        "</div>" +
        "<div>" +
        `<span class=\"downVote-count\" >${commentData.voteDown}</span>` +
        "<button class=\"down-vote\" ><i class=\"fa fa-angle-down\"></i></button> " +
        "</div>" +
        "</div>";
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
        // đẩy dữ liệu qua kênh 'moreVoteComment'
        socket.emit('moreVoteComment', sendData)
    })
}

// hàm xử lí tăng vote cho comment
// affectedButton: là phần bị ảnh hưởng cần được điều chỉnh lại (VD: 1 người chỉ có thể hoặc tăng vote hoặc giảm vote cho 1 comment)
function handleVoteComment(voteButton, affectedButton, voteData) {
    voteButton.previousElementSibling.innerHTML = voteData.count;
    if (voteData.type === "upVote") {
        axios.put(`/api/answer/${voteData.commentID}`, {voteUp: voteData.count})
            .then(comment => comment.data)
            .catch(error => {
                console.log(error)
            });
    } else {
        axios.put(`/api/answer/${voteData.commentID}`, {voteDown: voteData.count})
            .then(comment => comment.data)
            .catch(error => {
                console.log(error)
            });
    }
    if (affectedButton.firstChild.classList.contains('vote-icon-clicked') && userID === voteData.userID && !voteData.stopChaining) {
        affectedButton.firstChild.classList.remove('vote-icon-clicked');
        let count = affectedButton.previousElementSibling;
        count.classList.remove('count-changed');
        // chuyển kiểu button
        if (voteData.type === 'upVote') voteData.type = 'downVote';
        else voteData.type = 'upVote';
        // giảm biến đếm
        voteData.count = Number(count.innerText) - 1;
        voteData.stopChaining = true; // dừng việc đệ quy gián tiếp
        // đẩy dữ liệu qua kênh 'moreVoteComment'
        socket.emit('moreVoteComment', voteData)
    }
    sortComments();
}

// Hàm sắp xếp lại thứ tự ưu tiên các phản hồi
function sortComments() {
    let commentsArray = Array.from(comments);
    commentsArray.sort((a, b) => {
        let upVoteSelector = '.vote-area .upVote-count',
            downVoteSelector = '.vote-area .downVote-count';
        let orderOfA = Number(a.querySelector(upVoteSelector).innerText) - Number(a.querySelector(downVoteSelector).innerText),
            orderOfB = Number(b.querySelector(upVoteSelector).innerText) - Number(b.querySelector(downVoteSelector).innerText);
        return orderOfA < orderOfB;
    });
    for (let i = 0; i < comments.length; i++) {
        comments[i].outerHTML = commentsArray[i].outerHTML;
        // thêm sự kiện cho các vote button
        addEventToButton(upVoteBtns[i], 'upVote');
        addEventToButton(downVoteBtns[i], 'downVote');
    }
}

// kênh thêm comment
socket.on('addComment', comment => {
    addCommentToDOM(comment)
});
// kênh thêm vote
socket.on('moreVoteComment', voteData => {
    let comments = Array.from(document.getElementsByClassName('comment'));
    let voteIndex = comments.findIndex(comment => comment.id === voteData.commentID);
    if (voteData.type === 'upVote') {
        handleVoteComment(upVoteBtns[voteIndex], downVoteBtns[voteIndex], voteData)
    } else {
        handleVoteComment(downVoteBtns[voteIndex], upVoteBtns[voteIndex], voteData)
    }
});