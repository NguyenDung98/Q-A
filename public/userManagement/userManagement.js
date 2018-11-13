var cellCurent;

var lecturers = [];
var students = [];
var editing = false;
var adding = false;
var del = function(){
    var table = this.closest('table');
    var rowId = this.closest('tr').rowIndex;
    table.deleteRow(rowId);
    var userId;
    if(table.id == "lecturer-list")
        userId = lecturers[rowId].id;
    else
        userId = students[rowId].id;
    axios.put(`/api/user/del/${userId}`)
        .catch(error => {
            console.log(error);
        });
    if(table.id == "lecturer-list")
        lecturers.splice(rowId, 1);
    else
        students.splice(rowId, 1);

};
var add = function(){
    console.log("add")
    cellCurent = this;
    adding = true;
    openForm();
};
var edit = function(){
    editing = true;
    cellCurent = this;
    var value = this.textContent;
    document.getElementById("input").value = value;
    openForm();
};

axios.get('/api/user/')
    .then(users => users)
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
    console.log(users.data)
    for(var i = 0; i < users.data.length; i++){
        var user = {
            id: users.data[i]._id,
            role: users.data[i].role,
            user: users.data[i].user,
            username: users.data[i].username,
            password: users.data[i].password
        };
        console.log(user);
        if(user.role == "Lecturer")
            lecturers.push(user);
        else
            students.push(user);
    }
    console.log(lecturers, students);
    var tableLecturer = document.getElementById("lecturer-list");
    var tableStudent = document.getElementById("student-list");

    for(var i = 0; i < lecturers.length; i++){
        // if(list[i].role == "Lecturer"){
        console.log('Lecturer');
        var newRow = tableLecturer.insertRow(i);
        var cell = newRow.insertCell(0);
        newRow.id = i;
        newRow.classList.add('session');
        cell.innerHTML =
            "<tr>"+
            "<div class=\"session\">"+
            "<div class=\"session-info\">"+
            `<div class=\"session-name\"><div class=\"name\">${lecturers[i].user}</div>`+
            `</div>`+
            "</div>"+
            "</div>"+
            "</tr><br>";
        cell.onclick = edit;
        var delCell = newRow.insertCell(1);
        delCell.innerHTML = "<div id=\"del\"><span id>x</span></div>";
        delCell.onclick = del;
    }
    var addRowLecturer = tableLecturer.insertRow(tableLecturer.rows.length);
    var cellAddRowLecturer = addRowLecturer.insertCell(0);
    addRowLecturer.id = lecturers.length;
    addRowLecturer.classList.add('session');
    cellAddRowLecturer.innerHTML = "<div class=\"session\" id=\"plus\"><button id=\"plus-button\">+</button></div>";
    cellAddRowLecturer.onclick = add;
    for(var i = 0; i < students.length; i++){
        // }else{
        // if(list[i].role == "Student"){
        var newRow = tableStudent.insertRow(i);
        var cell = newRow.insertCell(0);
        newRow.id = i;
        newRow.classList.add('session');
        cell.innerHTML =
            "<tr>"+
            "<div class=\"session\">"+
            "<div class=\"session-info\">"+
            `<div class=\"session-name\"><div class=\"name\">${students[i].user}</div>`+
            `</div>`+
            "</div>"+
            "</div>"+
            "</tr><br>";
        cell.onclick = edit;
        var delCell = newRow.insertCell(1);
        delCell.innerHTML = "<div id=\"del\"><span id>x</span></div>";
        delCell.onclick = del;
        // }
        // }
    }

    var addRowStudent = tableStudent.insertRow(tableStudent.rows.length);
    var cellAddRowStudent = addRowStudent.insertCell(0);
    addRowStudent.id = students.length;
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
    var role = "Student";
    if(cellCurent.closest('table').id=="lecturer-list") role = "Lecturer";
    let u = {
        user: newUser,
        username: newUser,
        role: role
    };
    if(adding == true){
        adding = false;
        axios.post('/api/user/', u)
            .then(user => user.data)
            .then(user => {
                addUser(user)
            })
            .catch(error => {
                console.log(error)
            });
    }
    if(editing == true){
        editing = false;

        if(cellCurent.closest('table').id == 'lecturer-list'){
            lecturers[cellCurent.closest('tr').rowIndex].user = newUser;
            userId = lecturers[cellCurent.closest('tr').rowIndex].id
        }
        else {
            students[cellCurent.closest('tr').rowIndex].user = newUser;
            userId = students[cellCurent.closest('tr').rowIndex].id
        }
        axios.put(`/api/user/${userId}`, u)
            .catch(error => {
                console.log(error);
            })
        cellCurent.innerHTML = "<tr>"+
            "<div class=\"session\">"+
            "<div class=\"session-info\">"+
            `<div class=\"session-name\"><div class=\"name\">${newUser}</div>`+
            `</div>`+
            "</div>"+
            "</div>"+
            "</tr><br>";
    }
    closeForm();
}
function addUser(newUser){
    var table = cellCurent.closest('table');
    var rowId = cellCurent.closest('tr').rowIndex;

    if(newUser.user.trim().length != 0 && newUser != null){
        cellCurent.innerHTML = "<tr>"+
            "<div class=\"session\">"+
            "<div class=\"session-info\">"+
            `<div class=\"session-name\"><div class=\"name\">${newUser.user}</div>`+
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

        if(table.id == "lecturer-list")
            lecturers.push(newUser);
        else
            students.push(newUser)
    }
}