// var hide = getElementByClassName("hide");
var newEventModal = document.getElementById("new-event-modal");
var eventNameInput = document.getElementById("event-name");
var eventPassword = document.getElementById("event-pass");
var eventBegin = document.getElementById("begin-time");
var eventEnd = document.getElementById("end-time");
var eventList = document.getElementById("event-list");
var userID = document.getElementsByTagName('body')[0].id;
let socket = io();

//hộp dropdown
function dropclick() {
    var click = document.getElementById("dropContent");
    if (click.className.indexOf("w3-show") === -1) {
        click.className += " w3-show";
    } else {
        click.className = click.className.replace(" w3-show", "");
    }
}

// lấy dữ liệu từ server
axios.get(`/api/session`)
    .then(sessions => sessions.data)
    .then(sessions => {
        handleAddSessions(sessions);
    })
    .catch(error => {
        console.log(error)
    });


//hiển thị khi di chuột vào sesion
function mOver(obj) {
    var l = obj.children[0].children;
    l[0].children[0].style.opacity = 0.3;
    l[1].style.opacity = 0.3;
    // l[2].style.opacity = 0.3;
    // l[0].children[1].children[0].style.visibility = "visible";  //dấu x
    // l[0].children[2].children[0].style.visibility = "visible";  //dấu đóng mở
    if (l[0].children[2].children[0].getAttribute("id") === "active") {    //kiểm tra điều kiện để khi đóng session không hiện nút load nữa
        l[5].style.visibility = "visible";   //load
    } else if (l[0].children[2].getAttribute("id") === "inactive") {
        l[5].disabled = true;
    }
}

//hiển thị khi di chuột ra ngoài sesion
function mOut(obj) {
    var l = obj.children[0].children;
    if (l[0].children[2].children[0].getAttribute("id") === "active") {    //kiểm tra điều kiện để khi đóng session không hiện nút load nữa
        l[0].children[0].style.opacity = 1;
        l[1].style.opacity = 1;
        // l[2].style.opacity = 1;
    }
    l[5].style.visibility = "hidden";
    // l[0].children[1].children[0].style.visibility = "hidden";
    // l[0].children[2].children[0].style.visibility = "hidden";
}

window.onclick = function (event) {
    if (event.target === newEventModal) {
        newEventModal.style.display = "none";
    }
};

//thêm phiên hỏi đáp
function addSession(newSession) {
    var newEvent = document.createElement("div");
    newEvent.id = newSession._id;
    newEvent.classList.add("w3-col");
    newEvent.classList.add("s3");
    let beginDate = new Date(newSession.beginDate),
        endDate = new Date(newSession.endDate);

    newEvent.innerHTML = "<div class=\"w3-card w3-white w3-round-medium\" style=\"margin: 15px 10px 5px 0\" onmouseover=\"mOver(this)\" onmouseout=\"mOut(this)\">" +
        "  <div class=\"w3-container\" style=\"padding: 5px 10px;position: relative;height: 240px;\">" +
        "	  <div class=\"w3-bar\">" +
        `		  <label class=\"w3-bar-item w3-large w3-text-teal\" style=\"display: block; padding-left: 0\">${newSession.eventCode}</label>` +
        "		  <div class=\"tooltip w3-bar-item w3-right w3-padding-small\" style='padding: 0 !important'>" +
        "             <button class=\" hide inherit-button w3-button w3-padding-small\" style=\"cursor: pointer;opacity:1.0\">" +
        "			     <i class=\"fas fa-times\"></i>" +
        "		      </button> " +
        "             <span class='tooltiptext'>Xóa phiên</span>" +
        "          </div>" +
        "		  <div class=\"tooltip w3-bar-item w3-right w3-padding-small\" style='padding: 0 !important;'>" +
        "             <button id=\"active\" class=\"hide inherit-button w3-button w3-padding-small\" >" +
        "                <i class=\"fas fa-minus\"></i>" +
        "		      </button> " +
        "             <span class='tooltiptext'>Đóng phiên</span>" +
        "          </div>" +
        "	  </div>" +
        `	  <label class=\"w3-xlarge\" style=\"display: block;\">${newSession.eventName}</label>` +
        `	  <label class=\"w3-small\" style=\"display: block; opacity: 0.5;\">${beginDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</label>` +
        "	  <br><br>" +
        `	  <a href='/session/${newSession.eventCode}?id=${newSession._id}' class=\"w3-button hide w3-teal w3-hover-teal loadingBtn\">Truy cập</a>` +
        "  </div>" +
        "</div>";

    if (newSession.isClosed) {
        let obj = newEvent.querySelector('.fa-minus').parentElement;
        closeDOMSession(obj);
    }
    eventList.insertBefore(newEvent, eventList.childNodes[0]);
    // closeNewEventBox();
}

//đẩy dữ liệu qua kênh session
function getVal() {
    let eventName = eventNameInput.value;
    let eventCode = eventPassword.value;
    let beginDate = eventBegin.value;
    let endDate = eventEnd.value;
    if (eventNameInput === "") {
        alert("Hãy thêm tên sự kiện");
    }
    else if (eventCode === "") {
        alert("Hãy thêm mã sự kiện");
    }
    else if (beginDate === "") {
        alert("Sự kiện chưa có ngày bắt đầu");
    }
    else if (endDate === "") {
        alert("Sự kiện chưa có ngày kết thúc");
    } else {
        let newSession = {
            eventName,
            eventCode,
            beginDate,
            endDate
        };
        // đẩy phiên mới lên server
        axios.post('/api/session/', newSession)
            .then(session => session.data)
            .then(session => {
                // inputBox.removeChild(bigLoader);
                socket.emit('addSession', session);
            })
            .catch(error => {
                alert(error);
            });
    }
}

// đóng phiên hỏi đáp (DOM)
function closeDOMSession(obj) {
    let parentContainData = obj.parentElement.parentElement.parentElement.parentElement.parentElement;
    obj.parentNode.parentNode.parentNode.classList.add("fade");
    obj.setAttribute("onclick", "activeSession(this)");
    obj.setAttribute("id", "inactive");
    obj.nextElementSibling.innerText = "Mở phiên";
    var child = obj.children;
    child[0].setAttribute("class", "fas fa-check");
    mOver(parentContainData.children[0]);
    mOut(parentContainData.children[0]);
}

// kích hoạt phiên hỏi đáp (DOM)
function activateDOMSession(obj) {
    let parentContainData = obj.parentElement.parentElement.parentElement.parentElement.parentElement;
    obj.parentNode.parentNode.parentNode.classList.remove("fade");
    obj.setAttribute("onclick", "closeSession(this)");
    obj.setAttribute("id", "active");
    obj.nextElementSibling.innerText = "Đóng phiên";
    var child = obj.children;
    child[0].setAttribute("class", "fas fa-minus");

    mOver(parentContainData.children[0]);
    mOut(parentContainData.children[0]);
}

function getVal() {
    // let user = authorInput.value.trim() ? authorInput.value.trim() : "Ẩn danh";
    let eventName = eventNameInput.value;
    let eventCode = eventPassword.value;
    let beginDate = eventBegin.value;
    let endDate = eventEnd.value;
    if (eventNameInput === "") {
        alert("Hãy thêm tên sự kiện");
    }
    else if (eventCode === "") {
        alert("Hãy thêm mã sự kiện");
    }
    else if (beginDate === "") {
        alert("Sự kiện chưa có ngày bắt đầu");
    }
    else if (endDate === "") {
        alert("Sự kiện chưa có ngày kết thúc");
    } else {
        let newSession = {
            eventName,
            eventCode,
            beginDate,
            endDate,
            user: userID
        };
        axios.post('/api/session/', newSession)
            .then(session => session.data)
            .then(session => {
                // inputBox.removeChild(bigLoader);
                socket.emit('addSession', session);
            })
            .catch(error => {
                alert(error);
            });
    }
}

function handleAddSessions(sessions) {
    const filteredSessions = sessions.reduce((accumulator, session) => {
        if (accumulator[session.user.username]) {
            accumulator[session.user.username].push(session);
        }
        else accumulator[session.user.username] = [session];
        return accumulator;
    }, {});
    //DOM
    let count = 1;
    let eventListParent = eventList.parentElement;
    for (let lecturer in filteredSessions) {
        const lecturerInfoNode = createSepratorEventSign(filteredSessions[lecturer][0].user.fullName, filteredSessions[lecturer][0].user.username);
        eventListParent.insertBefore(lecturerInfoNode, eventList);
        filteredSessions[lecturer].forEach(session => {
            addSession(session)
        });
        eventListParent.appendChild(addNewEventList(count));
        eventList = eventListParent.lastElementChild;
        count++;
    }
    eventListParent.removeChild(eventListParent.lastElementChild);
}

function addNewEventList(count) {
    let newEventList = document.createElement('div');
    newEventList.classList.add('w3-row');
    newEventList.id = 'event-list-' + count;
    return newEventList;
}

function createSepratorEventSign(fullName, username) {
    let separator = document.createElement('p');
    separator.innerHTML = '<span class="sub-lecturer-title">Tên giảng viên: </span>' + fullName;
                            // + `<span class="sub-lecturer-title"> (username: ${username})</span>`;
    separator.classList.add('lecturer-info');
    return separator;
}

// kênh thêm phiên hỏi đáp
socket.on('addSession', session => {
    addSession(session);
    // todo: fix
});

// kênh cập nhật phiên hỏi đáp
socket.on('updateSession', session => {
    let updatedElement = document.getElementById(session._id);
    let obj = updatedElement.querySelectorAll('.fas')[1].parentElement;
    if (session.isClosed) {
        closeDOMSession(obj);
    } else {
        activateDOMSession(obj);
    }
});