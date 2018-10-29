var lecturers = ["A", "B"];
var students = ["a", "b"];
var cellCurent;
var del = function(){
	var table = this.closest('table');
	var rowId = this.closest('tr').rowIndex;
	table.deleteRow(rowId);
	updateList(table);
}
var add = function(){
	cellCurent = this;
	openForm();
}
var edit = function(){
	cellCurent = this;
	var value = this.textContent;
	document.getElementById("input").value = value;
	openForm();
}

function updateList(table){
	var list = [];
	for(var i = 0; i < table.rows.length-1; i++){
		list.push(table.rows[i].cells[0].textContent.trim());
	}
	if(table.id == 'lecturer-list'){
		lecturers = list;
	}else{
		students = list;
	}
	console.log(lecturers, students);
}
function updateTable(table, rowId, newValue){
	table.rows[rowId].cells[0].innerHTML = "<tr>"+
			"<div class=\"session\">"+
			"<div class=\"session-info\">"+
			`<div class=\"session-name\"><div class=\"name\">${newValue}</div>`+
			`</div>`+
			"</div>"+
			"</div>"+
			"</tr><br>";
}
function drawTable(id, list){
	var table = document.getElementById(id);
	for(var i = 0; i < list.length; i++){
		var newRow = table.insertRow(i);
		var cell = newRow.insertCell(0);
		newRow.id = i;
		newRow.classList.add('session');
		cell.innerHTML = 
			"<tr>"+
			"<div class=\"session\">"+
			"<div class=\"session-info\">"+
			`<div class=\"session-name\"><div class=\"name\">${list[i]}</div>`+
			`</div>`+
			"</div>"+
			"</div>"+
			"</tr><br>";
		cell.onclick = edit;
		var delCell = newRow.insertCell(1);
		delCell.innerHTML = "<div id=\"del\"><span id>x</span></div>";
		delCell.onclick = del;
	}
	var addRow = table.insertRow(list.length);
	var cellAddRow = addRow.insertCell(0);
	addRow.id = list.length;
	addRow.classList.add('session');
	cellAddRow.innerHTML = "<div class=\"session\" id=\"plus\"><button id=\"plus-button\">+</button></div>";
	cellAddRow.onclick = add;
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
	var newValue = document.getElementById("input").value;
	var table = cellCurent.closest('table');
	var rowId = cellCurent.closest('tr').rowIndex;
	if(newValue.trim().length != 0 && newValue != null){
		if(rowId == table.rows.length-1){
			cellCurent.innerHTML = "<tr>"+
				"<div class=\"session\">"+
				"<div class=\"session-info\">"+
				`<div class=\"session-name\"><div class=\"name\">${newValue}</div>`+
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
		}
		updateList(table);
		updateTable(table, rowId, newValue);
	}
	
	closeForm();
}