const btnLogout = document.querySelector('#logout');
const token = localStorage.getItem('token');

btnLogout.addEventListener('click', logout);

if (!token || token.trim() === '') {
    window.location.href = 'login.html';
}

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem("userId");
    window.location.href = '../../index.html';
}