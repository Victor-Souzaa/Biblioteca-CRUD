// Seleciona os elementos da página
const btnEditar = document.querySelector('#editar-perfil');
const modal = document.querySelector('#modal-editar');
const fecharModal = document.querySelector('#fechar-modal');
const formEdicao = document.querySelector('#form-edicao');

// URL da API para buscar e atualizar dados
const API_URL = 'http://localhost:3000/usuario/perfil';

// Abrir modal
btnEditar.addEventListener('click', () => modal.classList.remove('hidden'));

// Fechar modal
fecharModal.addEventListener('click', () => modal.classList.add('hidden'));

// Verificar resposta da API
async function verificarResposta(response) {
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.message || 'Erro na API');
  }
  return response.json();
}

// Carregar dados do perfil
async function carregarPerfil() {
  const email = localStorage.getItem('email');
  const senha = localStorage.getItem('senha');

  if (!email || !senha) {
    alert('Você não está autenticado. Faça login para acessar o perfil.');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}?email=${email}&senha=${senha}`);
    const usuario = await verificarResposta(response);

    // Preencher os campos
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('email').value = usuario.email;
    document.getElementById('endereco').value = usuario.endereco_completo;
    document.getElementById('cep').value = usuario.cep;
    document.getElementById('data_nascimento').value = usuario.data_nascimento;
    document.getElementById('status').value = usuario.bloqueado ? 'Bloqueado' : 'Ativo';
    document.getElementById('foto-perfil').src = usuario.foto_url || '../assets/default-profile.png';
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    alert('Erro ao carregar o perfil.');
  }
}

// Submeter dados atualizados
formEdicao.addEventListener('submit', async (event) => {
  event.preventDefault();

  const botaoSalvar = document.querySelector('#salvar-btn');
  botaoSalvar.disabled = true;
  botaoSalvar.textContent = 'Salvando...';

  const foto = document.getElementById('foto').files[0];
  if (foto && !foto.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido.');
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = 'Salvar';
    return;
  }

  const formData = new FormData(formEdicao);
  if (foto) formData.append('foto', foto);

  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      body: formData,
    });

    await verificarResposta(response);

    alert('Perfil atualizado com sucesso!');
    modal.classList.add('hidden');
    carregarPerfil();
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    alert('Erro ao atualizar perfil');
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = 'Salvar';
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('email');
  localStorage.removeItem('senha');
  window.location.href = '/login.html';
});

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  const email = localStorage.getItem('email');
  const senha = localStorage.getItem('senha');


  if (!email || !senha) {
    alert('E-mail ou senha não encontrados. Faça login novamente.');
    window.location.href = '/login.html';
    return;
  }

  try {
    // Enviar o e-mail e senha ao backend para buscar o perfil
    const response = await fetch(`http://localhost:3000/usuario/perfil?email=${email}&senha=${senha}`);
    const data = await response.json();

    if (response.ok) {
      // Preencher os dados do perfil no front-end
      document.getElementById('nome-usuario').textContent = data.nome;
      document.getElementById('email-usuario').textContent = data.email;
      document.getElementById('matricula-usuario').textContent = data.matricula || 'Não disponível';
      document.getElementById('endereco-usuario').textContent = data.endereco_completo || 'Não disponível';
      document.getElementById('cep-usuario').textContent = data.cep || 'Não disponível';
      document.getElementById('nascimento-usuario').textContent = new Date(data.data_nascimento).toLocaleDateString('pt-BR');
      document.getElementById('status-usuario').textContent = data.bloqueado ? 'Bloqueado' : 'Ativo';

      // Se houver foto de perfil
      if (data.foto_url) {
        document.getElementById('foto-perfil').src = data.foto_url;
      }
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    alert('Erro ao carregar perfil.');
  }
});

// Carregar dados do perfil
async function carregarPerfil() {
  const email = localStorage.getItem('email');

  if (!email) {
    alert('Você não está autenticado. Faça login para acessar o perfil.');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}?email=${email}`);
    const usuario = await verificarResposta(response);

    // Preencher os campos
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('email').value = usuario.email;
    document.getElementById('endereco').value = usuario.endereco_completo;
    document.getElementById('cep').value = usuario.cep;
    document.getElementById('data_nascimento').value = usuario.data_nascimento;
    document.getElementById('status').value = usuario.status;
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    alert('Erro ao carregar o perfil.');
  }
}

// Submeter dados atualizados
formEdicao.addEventListener('submit', async (event) => {
  event.preventDefault();

  const botaoSalvar = document.querySelector('#salvar-btn');
  botaoSalvar.disabled = true;
  botaoSalvar.textContent = 'Salvando...';

  const formData = new FormData(formEdicao);

  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      body: formData,
    });

    await verificarResposta(response);

    alert('Perfil atualizado com sucesso!');
    modal.classList.add('hidden');
    carregarPerfil();
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    alert('Erro ao atualizar perfil');
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = 'Salvar';
  }
});
