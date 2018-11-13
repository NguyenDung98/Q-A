var commentInput = document.getElementById("comment-text");
var commentBox = document.getElementById('comment-box');
var comments = document.getElementsByClassName('comment');
var commentsNumber = document.getElementById('comment-number');
var upVoteBtns = document.getElementsByClassName('up-vote');
var downVoteBtns = document.getElementsByClassName('down-vote');
var userID = 1 + Math.random();
var questionID = document.getElementsByTagName('body')[0].id;

var socket = io(); // kênh truyền dữ liệu

axios.get(`/api/answer/${questionID}`)
    .then(comments => comments.data)
    .then(comments => {
        comments.forEach(comment => {
            addCommentToDOM(comment)
        })
    })
    .catch(() => {
        window.location.href = '/asking';
    });

function display_enter() {
    if (document.getElementById("enter-button").style.display === "none") {
        document.getElementById("enter-button").style.display = "block";
    }
}

function add_Cmt() {
    var comment = commentInput.value;
    var newComment = {comment, question: questionID, postTime: new Date()};
    if (comment) {
        axios.post('/api/answer/', newComment)
            .then(comment => comment.data)
            .then(comment => {
                axios.put(`/api/question/${questionID}`, {comment: comments.length + 1})
                    .then(() => {
                        // đẩy dữ liệu qua kênh 'addComment'
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
    var comment = document.createElement('div');
    date =  new Date(commentData.postTime);

    comment.data = {
        postTime: commentData.postTime
    };
    comment.classList.add('comment');
    comment.id = commentData._id; // thêm id cho mỗi comment
    comment.innerHTML =
        `<div class=\"people\">${commentData.user}&nbsp&nbsp&nbsp•</div>` +
        `<div class=\"time\">${date.toLocaleTimeString()}&nbsp&nbsp&nbsp${date.toLocaleDateString()}</div>` +
        `<p class="comment-content">${commentData.comment}</p>` +
        "<div class=\"vote-area\">" +
        "<div style=\"float: left;\">" +
        `<span class=\"upVote-count\">${commentData.voteUp}</span> ` +
        `<button class=\"up-vote\" ><i class=\"fa fa-angle-up\"></i></button> ` +
        "<span style=\"color:#d6d6d6\">|</span>" +
        "</div>" +
        "<div>" +
        `<span class=\"downVote-count\" >${commentData.voteDown}</span> ` +
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
        updateVoteToServer(sendData)
    })
}

// hàm xử lí tăng vote cho comment
// affectedButton: là phần bị ảnh hưởng cần được điều chỉnh lại (VD: 1 người chỉ có thể hoặc tăng vote hoặc giảm vote cho 1 comment)
function handleVoteComment(voteButton, affectedButton, voteData) {
    voteButton.previousElementSibling.innerHTML = voteData.count;
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
        updateVoteToServer(voteData)
    }
    sortComments();
}

// Hàm sắp xếp lại thứ tự ưu tiên các phản hồi
function sortComments() {
    let commentsArray = Array.from(comments);
    let upVoteSelector = '.vote-area .upVote-count',
        downVoteSelector = '.vote-area .downVote-count';
    // sắp xếp dựa trên số phiếu cho mỗi phản hồi
    commentsArray.sort((a, b) => {
        let orderOfA = Number(a.querySelector(upVoteSelector).innerText) - Number(a.querySelector(downVoteSelector).innerText),
            orderOfB = Number(b.querySelector(upVoteSelector).innerText) - Number(b.querySelector(downVoteSelector).innerText);
        return compare(orderOfB, orderOfA);
    });
    // nhóm các phản hồi cùng số vote
    commentsArray = commentsArray.reduce((accumulator, currentValue) => {
        let currentArray = accumulator[accumulator.length - 1];
        if (accumulator.length === 0) {
            accumulator.push([]);
            accumulator[accumulator.length - 1].push(currentValue);
        } else {
            const currentItemVote = Number(currentValue.querySelector(upVoteSelector).innerText) - Number(currentValue.querySelector(downVoteSelector).innerText),
                previousItemVote = Number(currentArray[currentArray.length - 1].querySelector(upVoteSelector).innerText) - Number(currentArray[currentArray.length - 1].querySelector(downVoteSelector).innerText);
            if (currentItemVote !== previousItemVote) {
                accumulator.push([]);
                accumulator[accumulator.length - 1].push(currentValue);
            } else {
                currentArray.push(currentValue);
            }
        }
        return accumulator;
    }, []);
    // sắp xếp nhóm các câu hỏi theo thòi gian được đăng lên
    commentsArray = commentsArray.map(sameVoteComments => sameVoteComments.sort((a, b) => {
        const postTime_a = a.data.postTime,
            postTime_b = b.data.postTime;
        return compare(postTime_b, postTime_a);
    }));
    commentsArray = commentsArray.reduce((accumulator, currentValue) => {
        accumulator.push(...currentValue);
        return accumulator;
    }, []);
    for (let i = 0; i < comments.length; i++) {
        comments[i].outerHTML = commentsArray[i].outerHTML;
        comments[i].data = commentsArray[i].data;
        // thêm sự kiện cho các vote button
        addEventToButton(upVoteBtns[i], 'upVote');
        addEventToButton(downVoteBtns[i], 'downVote');
    }
}

// hàm cập nhật số vote cho comment
function updateVoteToServer(voteData) {
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
    // đẩy dữ liệu qua kênh 'moreVoteComment'
    socket.emit('moreVoteComment', voteData)
}

// hàm so sánh
function compare(val_1, val_2) {
    if (val_1 < val_2) {
        return -1;
    } else if (val_1 > val_2) {
        return 1;
    }
    return 0;
}

// kênh thêm comment
socket.on('addComment', comment => {
    if (comment.question === questionID) {
        addCommentToDOM(comment)
    }
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