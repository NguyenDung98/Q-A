// hàm xử lí tăng vote cho comment
// affectedButton: là phần bị ảnh hưởng cần được điều chỉnh lại (VD: 1 người chỉ có thể hoặc tăng vote hoặc giảm vote cho 1 comment)
function handleVoteComment(voteButton, affectedButton, voteData) {
    voteButton.previousElementSibling.innerHTML = voteData.count;
    // if (voteData.userID === userID && !userMakeVote) {
    //     let count = voteButton.previousElementSibling;
    //     voteButton.firstChild.classList.toggle('vote-icon-clicked');
    //     count.classList.toggle('count-changed');
    // }
    // userMakeVote = false;
    commentData.set(voteData.commentID, voteData.comment);
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
    let comment = commentData.get(voteData.commentID);
    if (voteData.type === "upVote") {
        if (voteData.count > comment.voteUp.length) {
            comment.voteUp.push(userInfo.id);
            commentData.set(voteData.commentID, comment);
        } else {
            comment.voteUp = comment.voteUp.filter(userID => userID !== userInfo.id);
            commentData.set(voteData.commentID, comment);
        }
        axios.put(`/api/answer/${voteData.commentID}`, {voteUp: comment.voteUp})
            .then(comment => comment.data)
            .catch(error => {
                console.log(error)
            });
    } else {
        if (voteData.count > comment.voteDown.length) {
            comment.voteDown.push(userInfo.id);
            commentData.set(voteData.commentID, comment);
        } else {
            comment.voteDown = comment.voteDown.filter(userID => userID !== userInfo.id);
            commentData.set(voteData.commentID, comment);
        }
        axios.put(`/api/answer/${voteData.commentID}`, {voteDown: comment.voteDown})
            .then(comment => comment.data)
            .catch(error => {
                console.log(error)
            });
    }
    // đẩy dữ liệu qua kênh 'moreVoteComment'
    socket.emit('moreVoteComment', {...voteData, comment})
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
        commentData.set(comment._id, comment);
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