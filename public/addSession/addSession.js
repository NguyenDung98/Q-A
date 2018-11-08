// var hide = getElementByClassName("hide");
var newEventModal = document.getElementById("new-event-modal");
var eventNameInput = document.getElementById("event-name");
var eventPassword = document.getElementById("event-pass");
var eventBegin = document.getElementById("begin-time");
var eventEnd = document.getElementById("end-time");
var eventList = document.getElementById("event-list");
let socket = io();


//hộp dropdown


function dropclick() {
    var click = document.getElementById("dropContent");
    if (click.className.indexOf("w3-show") == -1) {
        click.className += " w3-show";
    } else {
        click.className = click.className.replace(" w3-show", "");
    }
}

// lấy dữ liệu từ server
axios.get('/api/session/')
    .then(sessions => sessions.data)
    .then(sessions => {
        // eventList.removeChild(bigLoader);
        sessions.forEach(session => {
            addSession(session)
        })
    })
    .catch(error => {
        console.log(error)
    });

//hiển thị khi di chuột vào sesion
function mOver(obj) {
    var l = obj.children[0].children;
    l[0].children[0].style.opacity = 0.5;
    l[1].style.opacity = 0.5;
    l[2].style.opacity = 0.5;
    l[0].children[1].style.visibility = "visible";  //dấu x
    l[0].children[2].style.visibility = "visible";  //dấu đóng mở
    if (l[0].children[2].getAttribute("id") == "active") {    //kiểm tra điều kiện để khi đóng session không hiện nút load nữa
        l[5].style.visibility = "visible";   //load
    } else if (l[0].children[2].getAttribute("id") == "inactive") {
        l[5].disabled = true;
    }
}

//hiển thị khi di chuột ra ngoài sesion
function mOut(obj) {
    var l = obj.children[0].children;
    l[0].children[0].style.opacity = 1;
    l[1].style.opacity = 1;
    l[2].style.opacity = 1;
    l[5].style.visibility = "hidden";
    l[0].children[1].style.visibility = "hidden";
    l[0].children[2].style.visibility = "hidden";
}

//xóa phiên hỏi đáp
function deleteEvent(obj) {
    var r = window.confirm("Bạn chắc chắn xóa phiên hỏi đáp này?");
}


function parseMonth(value) {
    var res = "";

    switch (value) {
        case 1:
            res = "Feb";
            break;
        case 2:
            res = "Mar";
            break;
        case 3:
            res = "Apr";
            break;
        case 4:
            res = "May";
            break;
        case 5:
            res = "Jun";
            break;
        case 6:
            res = "Jul";
            break;
        case 7:
            res = "Aug";
            break;
        case 8:
            res = "Sep";
            break;
        case 9:
            res = "Oct";
            break;
        case 10:
            res = "Nov";
            break;
        case 11:
            res = "Dec";
            break;
        default:
            res = "Jan";
    }

    return res;
}

function mOver(obj) {
    var l = obj.children[0].children;
    l[0].children[0].style.opacity = 0.3;
    l[1].style.opacity = 0.3;
    l[2].style.opacity = 0.3;
    l[5].style.visibility = "visible";
    l[0].children[1].style.visibility = "visible";
    l[0].children[2].style.visibility = "visible";
}

function mOut(obj) {
    var l = obj.children[0].children;
    l[0].children[0].style.opacity = 1;
    l[1].style.opacity = 1;
    l[2].style.opacity = 1;
    l[5].style.visibility = "hidden";
    l[0].children[1].style.visibility = "hidden";
    l[0].children[2].style.visibility = "hidden";
}

function deleteEvent(obj) {
    var r = window.confirm("Are you sure to delete this event?");

    if (r) {
        obj.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(obj.parentNode.parentNode.parentNode.parentNode);
    }
}

function newEventBox() {
    newEventModal.style.display = "block";
}

function closeNewEventBox() {
    newEventModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == newEventModal) {
        newEventModal.style.display = "none";
    }
};


//thêm phiên hỏi đáp

function addSession(newSession) {
    // if (eventName.value==""){
    // 	alert("Hãy thêm tên sự kiện");
    // }
    // else if(eventPassword.value==""){
    // 	alert("Hãy thêm mã sự kiện");
    // }
    // else if (eventBegin.value==""){
    // 	alert("Sự kiện chưa có ngày bắt đầu");
    // }
    // else if (eventBegin.value==""){
    // 	alert("Sự kiện chưa có ngày kết thúc");
    // }
    // else{
    // 	// var bg = eventBegin.value;
    // var db = new Date(bg);
    // var dayb = db.getDate();
    // var monthb = parseMonth(db.getMonth());
    // var yearb = db.getFullYear();

    // var ed = eventEnd.value;
    // var de = new Date(ed);
    // var daye = de.getDate();
    // var monthe = parseMonth(de.getMonth());
    // var yeare = de.getFullYear();

    // var time = "";

    // if (yearb == yeare){
    // 	if (monthb == monthe) {
    // 		time = dayb + " - " + daye + " " + monthb + " " + yearb;
    // 	}
    // 	else{
    // 		time = dayb + " " + monthb + " - " + daye + " " + monthe + " " + yearb;
    // 	}
    // }
    // else{
    // 	time = dayb + " " + monthb + " " + yearb + " - " + daye + " " + monthe + " " + yeare;
    // }


    var newEvent = document.createElement("div");
    newEvent.classList.add("w3-col");
    newEvent.classList.add("s3");
    let beginDate = new Date(newSession.beginDate),
        endDate = new Date(newSession.endDate);

    newEvent.innerHTML = "<div class=\"w3-card w3-white w3-round-medium\" style=\"margin: 15px 10px 5px 0; cursor: pointer;\" onmouseover=\"mOver(this)\" onmouseout=\"mOut(this)\">" +
        "  <div class=\"w3-container\" style=\"padding: 5px 10px;\">" +
        "	  <div class=\"w3-bar\">" +
        `		  <label class=\"w3-bar-item w3-large w3-text-teal\" style=\"display: block; padding-left: 0\">${newSession.eventCode}</label>` +
        "		  <button class=\"w3-bar-item w3-right hide inherit-button w3-button w3-hover-teal\" style=\"cursor: pointer;opacity:1.0\" onclick=\"deleteEvent(this)\">" +
        "			  <i class=\"fa fa-close\"></i>" +
        "		  </button>" +
        "         <button id=\"active\" class=\"w3-bar-item w3-right hide inherit-button w3-button w3-hover-teal\" onclick=\"closeSession(this)\">" +
        "             <i class=\"fa fa-minus-circle\"></i>" +
        "	  </div>" +
        `	  <label class=\"w3-xlarge\" style=\"display: block;\">${newSession.eventName}</label>` +
        `	  <label class=\"w3-small\" style=\"display: block; opacity: 0.5;\">${beginDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</label>` +
        "	  <br><br>" +

        `	  <a href='/session/${newSession._id}' type=\"button\" class=\"w3-button w3-block hide w3-teal w3-hover-teal\" style=\"opacity:1.0; visibility:hidden; border-radius:5px\">Load</a>` +
        "  </div>" +
        "</div>";

    eventList.insertBefore(newEvent, eventList.childNodes[0]);
    closeNewEventBox();

}

//đẩy dữ liệu qua kênh addSession
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

//khóa phiên hỏi đáp
function closeSession(obj) {
    alert("Phiên hỏi đáp đã được đóng!");
    obj.parentNode.parentNode.classList.add("fade");
    obj.setAttribute("onclick", "activeSession(this)");
    obj.setAttribute("id", "inactive");
    var child = obj.children;
    child[0].setAttribute("class", "fa fa-check-circle");
}

//kích hoạt phiên hỏi đáp
function activeSession(obj) {
    alert("Phiên hỏi đáp đã được kích hoạt!");
    obj.parentNode.parentNode.classList.remove("fade");
    obj.setAttribute("onclick", "closeSession(this)");
    obj.setAttribute("id", "active");
    var child = obj.children;
    child[0].setAttribute("class", "fa fa-minus-circle");

    // var eventList = document.getElementById("event-list");
    // eventList.insertBefore(newEvent, eventList.childNodes[0]);

    // eventList.append(bigLoader);
    // đẩy phiên hỏi đáp mới lên server
    // axios.post('/api/question/', newSession)
    //     .then(session => session.data)
    //     .then(session => {
    //         // eventList.removeChild(bigLoader);
    //         socket.emit('addSession', session);
    //     })
    //     .catch(error => {
    //         alert(error);
    //     });

    closeNewEventBox();

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
            endDate
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
    // inputBox.append(bigLoader);
    // đẩy câu hỏi mới lên server

}


// kênh thêm phiên hỏi đáp
socket.on('addSession', session => {
    addSession(session)
});
