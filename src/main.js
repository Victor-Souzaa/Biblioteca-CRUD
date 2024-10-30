// Função para validar campos e controlar a habilitação dos botões
function validateFields() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById('password').value.trim();

  const emailValid = isEmailValid(email);
  const passwordValid = isPasswordValid(password);

  toggleButtonState('recover-password-button', emailValid);
  toggleButtonState('login-button', emailValid && passwordValid);

  toggleErrorMessage('email-error', emailValid);
  toggleErrorMessage('password-error', passwordValid);
}

function isEmailValid(email) {
  return email && validateEmail(email);
}

function isPasswordValid(password) {
  return password !== '';
}



function togglePasswordVisibility() {
  const inputPass = document.getElementById('password');
  const btnShowPass = document.getElementById('btn-senha');
  const isPasswordType = inputPass.type === 'password';

  inputPass.type = isPasswordType ? 'text' : 'password';
  btnShowPass.classList.toggle('bi-eye-fill', isPasswordType);
  btnShowPass.classList.toggle('bi-eye-slash-fill', !isPasswordType);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na resposta da rede');
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    return null; 
  }
}

function toggleErrorMessage(errorId, isValid) {
  const errorMessage = document.getElementById(errorId);
  errorMessage.style.display = isValid ? 'none' : 'block';
}

function toggleErrorMessage(errorId, isValid) {
  const errorMessage = document.getElementById(errorId);
  if (isValid) {
    errorMessage.classList.remove('active');
  } else {
    errorMessage.classList.add('active');
  }
}


function toggleButtonState(buttonId, state) {
  document.getElementById(buttonId).disabled = !state;
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  const errors = validateForm(email, password);

  if (errors.length) {
    event.preventDefault();
    alert(errors.join('\n'));
  }
});

function validateForm(email, password) {
  const errors = [];
  
  if (!email && !password) {
    errors.push("Por favor, preencha o email e a senha.");
  } else {
    if (!email) errors.push("Por favor, preencha o email.");
    if (!validateEmail(email)) errors.push("Por favor, insira um email válido.");
    if (!password) errors.push("Por favor, preencha a senha.");
  }

  return errors;
}

function mostrarSenha() {
  const inputPass = document.getElementById('password');
  const btnShowPass = document.getElementById('btn-senha');

  if (inputPass.type === 'password') {
    inputPass.setAttribute('type', 'text');
    btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
  } else {
    inputPass.setAttribute('type', 'password');
    btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
  }
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

