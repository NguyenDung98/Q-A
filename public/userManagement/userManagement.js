let tableBody = document.getElementById('user-list');

axios.get('/api/user')
    .then(users => users.data)
    .then(users => {
        users.forEach(user => {
            let newRow = tableBody.insertRow();
            addDataToRow(newRow, user);
        })
    })
    .catch(error => {
        console.log(error);
    });

function addDataToRow(row, userData) {
    row.data = {
        id: userData._id
    };
    row.insertCell().innerText = userData.fullName;
    row.insertCell().innerText = userData.username;
    row.insertCell().innerText = userData.password;
    row.insertCell().innerHTML =
        `${userData.role}<button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                         <button class="edit-btn" onclick="handleEditBtnClick(this)"><i class="fas fa-edit"></i></button>`;
    const originalRow = row.cloneNode(true);
    listenSpecialKeyEvent(row, originalRow);
}

function handleEditBtnClick(editBtn) {
    let row = editBtn.parentElement.parentElement;
    row.contentEditable = !row.isContentEditable;
    if (row.isContentEditable) {
        editBtn.innerHTML = '<i class=\"fas fa-check\"></i>';
        row.focus();
        row.classList.add('focus');
    }
    else {
        updateUserData(row);
        row.classList.remove('focus');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    }
}

function updateUserData(row) {
    let updatedData = {
        fullName: row.cells[0].innerText,
        username: row.cells[1].innerText,
        password: row.cells[2].innerText,
        role: row.cells[3].innerText
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