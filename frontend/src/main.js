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
  return email && validateEmail(email);
}

function isPasswordValid(password) {
  return password !== "";
}

function togglePasswordVisibility() {
  const inputPass = document.getElementById("password");
  const btnShowPass = document.getElementById("btn-senha");
  const isPasswordType = inputPass.type === "password";

  inputPass.type = isPasswordType ? "text" : "password";
  btnShowPass.classList.toggle("bi-eye-fill", isPasswordType);
  btnShowPass.classList.toggle("bi-eye-slash-fill", !isPasswordType);
}

// Função para mostrar a senha
function mostrarSenha() {
  const inputPass = document.getElementById("password");
  const btnShowPass = document.getElementById("btn-senha");

  if (inputPass.type === "password") {
    inputPass.setAttribute("type", "text");
    btnShowPass.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
  } else {
    inputPass.setAttribute("type", "password");
    btnShowPass.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
  }
}

// Função para fazer a requisição de login no back-end
document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede o envio normal do formulário

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validação simples do formulário
  if (!email || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Chama a API para autenticação
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha: password })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);  // Adiciona um log para verificar o que a API retorna
    if (data.paginaDestino) {
      // Redireciona para a página do tipo de usuário retornado
      window.location.href = data.paginaDestino;
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Erro ao realizar login:', error);
    alert('Erro ao realizar login.');
  });
});

// Função de autenticação via API
async function authenticateUser(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/authenticate", {  // Certifique-se de que a URL da API está correta
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      return data; // Sucesso, retorna os dados (incluindo role)
    } else {
      throw new Error(data.message || "Erro ao autenticar usuário");
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return { success: false };
  }
}

// Função para alternar o estado do botão
function toggleButtonState(buttonId, state) {
  document.getElementById(buttonId).disabled = !state;
}

function toggleErrorMessage(errorId, isValid) {
  const errorMessage = document.getElementById(errorId);
  if (isValid) {
    errorMessage.classList.remove("active");
  } else {
    errorMessage.classList.add("active");
  }
}

