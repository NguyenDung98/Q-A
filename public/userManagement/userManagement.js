let tableBody = document.getElementById('user-list'),
    userForm = document.getElementById('user-form'),
    fullNameInput = document.getElementById('fullname'),
    usernameInput = document.getElementById('username'),
    passwordInput = document.getElementById('password'),
    roleSelect    = document.getElementById('role');

let socket = io();

axios.get('/api/user')
    .then(users => users.data)
    .then(users => {
        users.forEach(user => {
            addDataToRow(user);
        })
    })
    .catch(error => {
        console.log(error);
    });

//hộp dropdown
function dropclick() {
    var click = document.getElementById("dropContent");
    if (click.className.indexOf("w3-show") === -1) {
        click.className += " w3-show";
    } else {
        click.className = click.className.replace(" w3-show", "");
    }
}

function addDataToRow(userData) {
    let newRow = tableBody.insertRow();
    newRow.data = {
        id: userData._id
    };
    let roleNode = document.createElement('select');
    roleNode.disabled = true; // không cho người dùng chỉnh sửa
    roleNode.innerHTML =
        `
            <option value="lecturer">Giảng viên</option>
            <option value="student">Sinh viên</option>
        `;
    for (let i = 0; i < roleNode.options.length; i++) {
        if (roleNode.options[i].value === userData.role) roleNode.options[i].setAttribute('selected', true);
    }

    newRow.insertCell().innerText = userData.fullName;
    newRow.insertCell().innerText = userData.username;
    newRow.insertCell().innerText = userData.password;
    newRow.insertCell().innerHTML = roleNode.outerHTML +
        `<button class="delete-btn" onclick="handleDeleteBtnClick(this)"><i class="fas fa-trash-alt"></i></button>
         <button class="edit-btn" onclick="handleEditBtnClick(this)"><i class="fas fa-edit"></i></button>`;
    const originalRow = newRow.cloneNode(true);
    listenSpecialKeyEvent(newRow, originalRow);
}

function handleEditBtnClick(editBtn) {
    let row = editBtn.parentElement.parentElement;
    row.contentEditable = !row.isContentEditable;
    if (row.isContentEditable) {
        row.cells[3].children[0].disabled = false; // cho phép người dùng chỉnh sửa
        editBtn.innerHTML = '<i class=\"fas fa-check\"></i>';
        row.focus();
        row.classList.add('focus');
    }
    else {
        row.cells[3].children[0].disabled = true; // không cho phép người dùng chỉnh sửa
        updateUserData(row);
        row.classList.remove('focus');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    }
}

function handleDeleteBtnClick(deleteBtn) {
    let row = deleteBtn.parentElement.parentElement;
    row.parentElement.deleteRow(row.sectionRowIndex);
    axios.delete(`/api/user/${row.data.id}`)
        .then(user => user.data)
        .then(user => {
            console.log(user);
        })
        .catch(error => {
            console.log(error);
        })
}

function updateUserData(row) {
    const roleSelectedIndex = row.cells[3].children[0].selectedIndex;
    const roleSelected = row.cells[3].children[0].item(roleSelectedIndex).value;
    let updatedData = {
        fullName: row.cells[0].innerText,
        username: row.cells[1].innerText,
        password: row.cells[2].innerText,
        role: roleSelected
    };
    axios.put(`/api/user/${row.data.id}`, updatedData)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
}

function cancelEditRow(row, editBtn, originalRow) {
    row.contentEditable = !row.isContentEditable;
    row.classList.remove('focus');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    row.innerHTML = originalRow.innerHTML;
}

function listenSpecialKeyEvent(row, originalRow) {
    row.addEventListener('keydown', e => {
        const editBtn = row.cells[3].children[1];
        if (e.which === 27) {
            cancelEditRow(row, editBtn, originalRow);
        } else if (e.which === 13) {
            handleEditBtnClick(editBtn)
        }
    })
}

userForm.addEventListener('submit', e => {
    e.preventDefault();
    const userData = {
        fullName: fullNameInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
        role: roleSelect.value
    };
    axios.post('/api/user', userData)
        .then(user => user.data)
        .then(user => {
            userForm.reset();
            if (checkIfUserHasProperty(user)) {
                addDataToRow(user);
            }
        })
        .catch(error => {
            console.log(error);
        })
});


function checkIfUserHasProperty(user) {
    let count = 0;
    for (let prop in user) {
        count++;
    }
    return count;
}