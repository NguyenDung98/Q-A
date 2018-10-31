// var hide = getElementByClassName("hide");
var newEventModal = document.getElementById("new-event-modal");
var eventName = document.getElementById("event-name");
var eventPassword = document.getElementById("event-pass");
var eventBegin = document.getElementById("begin-time");
var eventEnd = document.getElementById("end-time");
var eventList = document.getElementById("event-list");

let socket = io();

function dropclick() {
    var click = document.getElementById("dropContent");
    if (click.className.indexOf("w3-show") == -1) {
        click.className += " w3-show";
    } else {
        click.className = click.className.replace(" w3-show", "");
    }
}

// loader
// let loader = document.createElement('div');
// let bigLoader = loader.cloneNode(true);
// loader.classList.add('loader');

// bigLoader.classList.add('loader-container');
// bigLoader.innerHTML += '<div></div>';
// bigLoader.firstElementChild.classList.add('loader', 'big-loader');

// // userIdentify.innerText += userID;
// eventList.append(bigLoader);

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
    obj.style.opacity = "0.1";
    var l = obj.children[0].children;
    l[5].style.visibility = "visible";
    l[0].children[1].style.visibility = "visible";
}

function mOut(obj) {
    obj.style.opacity = "1.0";
    var l = obj.children[0].children;
    l[5].style.visibility = "hidden";
    l[0].children[1].style.visibility = "hidden";
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
}

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
        endDate   = new Date(newSession.endDate);

        newEvent.innerHTML = "<div class=\"w3-card w3-white w3-round-medium\" style=\"margin: 15px 5px 5px 5px; cursor: pointer;\" onmouseover=\"mOver(this)\" onmouseout=\"mOut(this)\">" +
        "  <div class=\"w3-container\" style=\"padding: 5px 10px;\">" +
        "	  <div class=\"w3-bar\">" +
        `		  <label class=\"w3-bar-item w3-large w3-text-teal\" style=\"display: block;\">${newSession.eventCode}</label>` +
        "		  <button class=\"w3-bar-item w3-right hide inherit-button w3-button w3-hover-teal\" style=\"cursor: pointer;opacity:1.0\" onclick=\"deleteEvent(this)\">" +
        "			  <i class=\"fa fa-close\"></i>" +
        "		  </button>" +
        "	  </div>" +
        `	  <label class=\"w3-xlarge\" style=\"display: block;\">${newSession.nameEvent}</label>` +
        `	  <label class=\"w3-small\" style=\"display: block; opacity: 0.5;\">${beginDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</label>` +
        "	  <br><br>" +
        "	  <a href='/asking' target=_blank type=\"button\" class=\"w3-button w3-block hide w3-teal w3-hover-teal\" style=\"opacity:1.0\">Load</a>" +
        "  </div>" +
        "</div>";

    // var eventList = document.getElementById("event-list");
    eventList.insertBefore(newEvent, eventList.childNodes[0]);

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
    let nameEvent = eventName.value;
    let eventCode = eventPassword.value;
    let beginDate = eventBegin.value;
    let endDate = eventEnd.value;
    if (nameEvent === "") {
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
            nameEvent,
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