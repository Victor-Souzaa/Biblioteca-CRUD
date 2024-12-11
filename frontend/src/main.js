// Função para validar os campos e controlar a habilitação dos botões
function validateFields() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailValid = isEmailValid(email);
  const passwordValid = isPasswordValid(password);

  toggleButtonState("recover-password-button", emailValid);
  toggleButtonState("login-button", emailValid && passwordValid);

  toggleErrorMessage("email-error", emailValid);
  toggleErrorMessage("password-error", passwordValid);
}

function isEmailValid(email) {
  return email && validateEmail(email); // Supondo que validateEmail já está implementada
}

function isPasswordValid(password) {
  return password !== "";
}

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
  const inputPass = document.getElementById("password");
  const btnShowPass = document.getElementById("btn-senha");
  const isPasswordType = inputPass.type === "password";

  inputPass.type = isPasswordType ? "text" : "password";
  btnShowPass.classList.toggle("bi-eye-fill", isPasswordType);
  btnShowPass.classList.toggle("bi-eye-slash-fill", !isPasswordType);
}

// Função genérica para chamada à API
async function callApi(url, method, body) {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro na API");
    return data;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

// Função para tratar o login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const data = await callApi("http://localhost:3000/login", "POST", {
      email,
      senha: password,
    });

    localStorage.setItem("email", email); // Armazena apenas o e-mail
    window.location.href = data.paginaDestino;
  } catch (error) {
    alert(error.message);
  }
}

// Listeners
document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("btn-senha").addEventListener("click", togglePasswordVisibility);

// Funções auxiliares para estado de botões e mensagens de erro
function toggleButtonState(buttonId, state) {
  document.getElementById(buttonId).disabled = !state;
}

function toggleErrorMessage(errorId, isValid) {
  const errorMessage = document.getElementById(errorId);
  errorMessage.classList.toggle("active", !isValid);
}
