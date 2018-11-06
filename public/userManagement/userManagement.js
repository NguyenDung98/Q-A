var cellCurent;
var list;
var editing = false;
var del = function(){
	var table = this.closest('table');
	var rowId = this.closest('tr').rowIndex;
	table.deleteRow(rowId);
	list.slice(rowId, 1);
}
var add = function(){
	cellCurent = this;
	openForm();
}
var edit = function(){
	editing = true;
	cellCurent = this;
	var value = this.textContent;
	document.getElementById("input").value = value;
	openForm();
}

axios.get(`/api/user/${userID}`)
    .then(users => users)
    .then(list = users)
    .then(users => {
        drawTable(users)
    })
    .catch(error => {
    	alert(error)
    });

function updateTable(table, rowId, newUserName){
	table.rows[rowId].cells[0].innerHTML = "<tr>"+
			"<div class=\"session\">"+
			"<div class=\"session-info\">"+
			`<div class=\"session-name\"><div class=\"name\">${newUserName}</div>`+
			`</div>`+
			"</div>"+
			"</div>"+
			"</tr><br>";
}
function drawTable(users){
	var tableLecturer = document.getElementById("lecturer-list");
	var tableStudent = document.getElementById("student-list");	
	for(var i = 0; i < list.length; i++){
		if(list[i].type == "Lecturer"){
			var newRow = tableLecturer.insertRow(i);
			var cell = newRow.insertCell(0);
			newRow.id = i;
			newRow.classList.add('session');
			cell.innerHTML = 
				"<tr>"+
				"<div class=\"session\">"+
				"<div class=\"session-info\">"+
				`<div class=\"session-name\"><div class=\"name\">${list[i].user}</div>`+
				`</div>`+
				"</div>"+
				"</div>"+
				"</tr><br>";
			cell.onclick = edit;
			var delCell = newRow.insertCell(1);
			delCell.innerHTML = "<div id=\"del\"><span id>x</span></div>";
			delCell.onclick = del;
		}else{
			if(list[i].type == "Student"){
				var newRow = tableStudent.insertRow(i);
				var cell = newRow.insertCell(0);
				newRow.id = i;
				newRow.classList.add('session');
				cell.innerHTML = 
					"<tr>"+
					"<div class=\"session\">"+
					"<div class=\"session-info\">"+
					`<div class=\"session-name\"><div class=\"name\">${list[i].user}</div>`+
					`</div>`+
					"</div>"+
					"</div>"+
					"</tr><br>";
				cell.onclick = edit;
				var delCell = newRow.insertCell(1);
				delCell.innerHTML = "<div id=\"del\"><span id>x</span></div>";
				delCell.onclick = del;
			}
		}
	}
	var addRowLecturer = tableLecturer.insertRow(tableLecturer.rows.length);
	var cellAddRowLecturer = addRowLecturer.insertCell(0);
	addRowLecturer.id = list.length;
	addRowLecturer.classList.add('session');
	cellAddRowLecturer.innerHTML = "<div class=\"session\" id=\"plus\"><button id=\"plus-button\">+</button></div>";
	cellAddRowLecturer.onclick = add;

	var addRowStudent = tableStudent.insertRow(tableStudent.rows.length);
	var cellAddRowStudent = addRowStudent.insertCell(0);
	addRowStudent.id = list.length;
	addRowStudent.classList.add('session');
	cellAddRowStudent.innerHTML = "<div class=\"session\" id=\"plus\"><button id=\"plus-button\">+</button></div>";
	cellAddRowStudent.onclick = add;
}
function show(){
	document.getElementById("session-list-container").style.display = "block";
	var btn = document.getElementById('btn');
	btn.parentNode.removeChild(btn);
	
	drawTable('lecturer-list',lecturers);
	drawTable('student-list', students);
}
function openForm() {
	// document.getElementById('session-list-container').className = 'editing';
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
	// document.getElementById('session-list-container').className = '';
    document.getElementById("myForm").style.display = "none";
}
function saveVal(){
	var newUser = document.getElementById("input").value;
	if(!editing){
		var u = {
			user: newUser,
			type: "Lecturer"?cellCurent.closest('table').id=="lecturer-list":"Student"
		}
        axios.post('/api/user/', u)
            .then(user => user.data)
            .then(user =>{
            	addUser(user)
            })
            .catch(error => {
                alert(error);
            });
	}
	else{
		editing = false;
		list[cellCurent.rowIndex].user = newUser;
		axios.put(`/api/user/${userID}`, newUser)
            .catch(error => {
                console.log(error);
            })
        cellCurent.textContent = newUser;
	}
	closeForm();
}
function addUser(newUser){
	var table = cellCurent.closest('table');
	var rowId = cellCurent.closest('tr').rowIndex;

	if(newUser.trim().length != 0 && newUser != null){
		cellCurent.innerHTML = "<tr>"+
			"<div class=\"session\">"+
			"<div class=\"session-info\">"+
			`<div class=\"session-name\"><div class=\"name\">${newUser}</div>`+
			`</div>`+
			"</div>"+
			"</div>"+
			"</tr><br>";
		var delCell = table.rows[rowId].insertCell(1);
		delCell.innerHTML = "<div id=\"del\">x</div>";
		delCell.onclick = del;

		var addRow = table.insertRow(rowId+1);
		var cellAddRow = addRow.insertCell(0);
		addRow.id = rowId+1;
		addRow.classList.add('session');
		cellAddRow.innerHTML = "<div class=\"session\" id=\"plus\"><button id = \"plus-button\">+</button></div>";
		cellAddRow.onclick = add;

		list.push(newUser);
	}
}