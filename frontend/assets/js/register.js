// Seletores
const form = document.querySelector("#form-register");
const eField = form.querySelector(".email");
const eInput = eField.querySelector("input");
const pField = form.querySelector(".password");
const pInput = pField.querySelector("input");
const eyeIcon = form.querySelector(".icon1");
const registerBtn = document.querySelector("#registerBtn");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setValidationState(field, isValid, message = "") {
  const errorText = field.querySelector(".error-txt");
  if (isValid) {
    field.classList.remove("error");
    field.classList.add("valid");
    if (errorText) errorText.innerText = "";
  } else {
    field.classList.add("error");
    field.classList.remove("valid");
    if (errorText) errorText.innerText = message;
  }
}
function validateEmail() {
  const email = eInput.value.trim();
  if (!email) {
    setValidationState(eField, false, "O campo E-mail não pode ficar em branco");
    return false;
  } else if (!emailRegex.test(email)) {
    setValidationState(eField, false, "Digite um endereço de e-mail válido");
    return false;
  } else {
    setValidationState(eField, true);
    return true;
  }
}
function validatePassword() {
  const password = pInput.value.trim();
  if (!password) {
    setValidationState(pField, false, "O campo Senha não pode ficar em branco");
    return false;
  } else {
    setValidationState(pField, true);
    return true;
  }
}
eInput.addEventListener("input", validateEmail);
pInput.addEventListener("input", validatePassword);
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Formulário enviado");
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  if (!isEmailValid  || !isPasswordValid) return;
  const email = eInput.value.trim();
  const password = pInput.value.trim();
  registerBtn.disabled = true;
  registerBtn.innerText = "Criando...";
  try {
    const response = await fetch('http://localhost:3000/api/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao registrar',
        text: data.message || 'Falha ao registrar usuário.',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Conta criada com sucesso!',
      text: 'Redirecionando para login...',
      timer: 1800,
      showConfirmButton: false
    }).then(() => {
      window.location.href = 'login.html';
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Erro ao conectar com o servidor.',
    });
  } finally {
    registerBtn.disabled = false;
    registerBtn.innerText = "Criar conta";
  }
});
eyeIcon.addEventListener("click", () => {
  const isPasswordVisible = pInput.type === "text";
  pInput.type = isPasswordVisible ? "password" : "text";
  if(isPasswordVisible){
    eyeIcon.src = "../images/icons/eye-slash-icon.svg";
    eyerIcon.alt ="Eye Slash Icon"
  }else{
    eyeIcon.src = "../images/icons/eye-icon.svg";
    eyeIcon.alt ="Eye Open Icon"
  }
  eyeIcon.style.color = "#24292d";
});
