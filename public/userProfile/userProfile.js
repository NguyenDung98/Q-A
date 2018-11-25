var fullName = document.getElementById("fullName");
var newPass = document.getElementById("new-pass");
var reNewPass = document.getElementById("re-newpass")

function saveClick() {
    if (fullName.value.trim() === "") {
        fullName.style.border = "1px solid red";
    } else {
        if (newPass.value.trim() === "") {
            axios.put(`/api/user/${userID}`, {
                fullName: fullName.value
            })
                .then(() => {
                    alert("Cập nhật thành công! Mời bạn đăng nhập lại");
                    location.href = '/logout';
                })
                .catch(error => {
                    console.log(error);
                })
        } else {
            if (newPass.value === reNewPass.value) {
                axios.put(`/api/user/${userID}`, {
                    fullName: fullName.value,
                    password: newPass.value
                })
                    .then(() => {
                        alert("Cập nhật thành công! Mời bạn đăng nhập lại");
                        location.href = '/logout';
                    })
                    .catch(error => {
                        console.log(error);
                    })
            } else {
                document.getElementById("error2").style.display = "block";
                console.log("avd");
            }
        }
        // else{
        // 	// document.getElementById("error1").style.display = "block";
        // }
    }
}