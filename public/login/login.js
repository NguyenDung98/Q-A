var loginButton = document.getElementById("login-button");
var userName = document.getElementById("username");
var password = document.getElementById("password");

function loginClick(){
	if(userName.value.trim() == ""){
		userName.style.border = "1px solid red";
	}
	if(password.value.trim() == ""){
		password.style.border = "1px solid red";
	}
	else{
		if(username.value == "admin" && password.value == "admin"){
   			window.location.href = "http://localhost:3000/session";
		}
		else{
			document.getElementById("error").style.display = "block";
		}
	}
}