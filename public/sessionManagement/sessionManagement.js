
// ---------------------------------------------- DANH SACH BIEN --------------------------------------------------

var addSessionBtn = document.getElementById("add-session-btn");                      // nut them session
var addSessionBox = document.getElementById("add-session-box");                      // Hop thoai them session
var closeModalAddSessionBtn = document.getElementById("close-modal-add-session");    // nut dong hop thoai them session
var cancelAddSessionBtn = document.getElementById("cancel-add-session-btn");         // nut huy them sesison
var confirmAddBtn = document.getElementById("confirm-add-btn");                      // nut xac nhan them sesison

var sesssionName = document.getElementById("session-name");                          // hop text ten sesison
var beginTime = document.getElementById("begin-time");                               // thoi gian bat dau
var endTime = document.getElementById("end-time");                                   // thoi gian ket thuc

var sessionList = document.getElementById("list");                                   // danh sach cac session hien co

// ------------------------------------ DANH SACH CAC HAM TINH TOAN, CHUAN HOA ----------------------------------------

// chuyen gia tri thang tu dang so sang dang chu
function parseMonth(value){
	var res = "";

	switch(value){
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

// chon buoi (am hay pm)
function setPeriod(h){
	return (h<12) ? "am" : "pm";
}

// chuyen gia tri gio ve dang nho hon 12
function parseHour(h){
	return h%12;
}

// reset gia tri trong hop thoai them session
function reset(){
	sesssionName.value = "";
	beginTime.value = "";
	endTime.value = "";
}

function parseMinutes(m){
	return (m < 10) ? ("0"+m) : m;
}

// ----------------------------------------- DANH SACH CAC HAM TINH NANG CUA TRANG WEB ------------------------------

// mo hop thoai them session
addSessionBtn.onclick = function() {
	addSessionBox.style.display = "block";
}

//dong hop thoai them sessison
closeModalAddSessionBtn.onclick = function() {
	reset();
	addSessionBox.style.display = "none";
}

// an chuot bat ky ngoai hop thoai them session thi tu dong dong hop thoai
window.onclick = function(event) {
    if (event.target == addSessionBox) {
    	reset();
        addSessionBox.style.display = "none";
    }
}

// huy them session
cancelAddSessionBtn.onclick = function(){
	reset();
	addSessionBox.style.display = "none";
}

// them session
confirmAddBtn.onclick = function(){

	// kiem tra xem cac o nhap thong tin con trong khong, neu con trong thi dua ra thong bao
	if (sesssionName.value==""){
		alert("Tên phiên hỏi đáp vẫn bị bỏ trống");
	}
	else if (beginTime.value==""){
		alert("Thời gian bắt đầu vẫn bị bỏ trống!");
	}
	else if (endTime.value==""){
		alert("Thời gian kết thúc vẫn bị bỏ trống!");
	}
	else{
		// Lay cac gia tri thoi gian cua thoi diem bat dau session
		var bg = beginTime.value;
		var db = new Date(bg);
		var dayb = db.getDate();
		var monthb = parseMonth(db.getMonth());
		var hourb = parseHour(db.getHours());
		var minb = parseMinutes(db.getMinutes());
		var periodb = setPeriod(db.getHours());

		// Lay cac gia tri thoi gian cua thoi diem ket thuc session
		var ed = endTime.value;
		var de = new Date(ed);
		var daye = de.getDate();
		var monthe = parseMonth(de.getMonth());
		var houre = parseHour(de.getHours());
		var mine = parseMinutes(de.getMinutes());
		var periode = setPeriod(de.getHours());

		//Tao Session moi
		var newSession = document.createElement("div");
		newSession.classList.add("w3-bar");
		newSession.classList.add("w3-hover-light-gray");
		newSession.classList.add("w3-margin");
		newSession.innerHTML = "<div class=\"w3-bar-item\">" +
						 "	<label class=\"w3-small w3-text-gray\" style=\"display: block;\">" + dayb + " " + monthb + " " + hourb + ":" + minb + periodb + " - "  + daye + " " + monthe + " " + houre + ":" + mine + periode + "</label>" +
						 "	<label style=\"display: block;\">" + sesssionName.value + "</label>" +
						 "</div>" +
						 "<button class=\"w3-bar-item w3-right session-option end-session\" onclick=\"endSession(this)\">" + 
						 "	<i class=\"fa fa-close\" style=\"display: block;\"></i>" +
						 "	<label style=\"display: block; cursor: pointer;\">Kết thúc</label>" +
						 "</button>" +
						 "<button class=\"w3-bar-item w3-right session-option close-session\" onclick=\"closeSession(this)\">" +
							"<i class=\"fa fa-minus-circle\" style=\"display: block;\"></i>" +
							"<label style=\"display: block; cursor: pointer;\">Đóng</label>" +
						 "</button>";

		//Them session vao van ban
		sessionList.appendChild(newSession);

		// reset lai hop thoai them session
		reset();

		// dong hop thoai them session
		addSessionBox.style.display = "none";
	}	
}

function endSession(obj){
	var r = window.confirm("Bạn có chắc muốn kết thúc phiên hỏi đáp này?");
	if(r){
		obj.parentNode.parentNode.removeChild(obj.parentNode);
	}
}

function closeSession(obj){
	alert("Phiên hỏi đáp đã được đóng!");
	obj.parentNode.classList.add("fade");
	obj.setAttribute("onclick","activeSession(this)");
	var child = obj.children;
	child[0].setAttribute("class","fa fa-check-circle");
	child[1].innerHTML = "Kích hoạt";
}

function activeSession(obj){
	alert("Phiên hỏi đáp đã được kích hoạt!");
	obj.parentNode.classList.remove("fade");
	obj.setAttribute("onclick","closeSession(this)");
	var child = obj.children;
	child[0].setAttribute("class","fa fa-minus-circle");
	child[1].innerHTML = "Đóng";
}
