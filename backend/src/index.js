const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Pool } = require('pg'); // Banco de dados PostgreSQL
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, nome, email, senha, tipo_usuario, bloqueado FROM Usuario WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];

    // Verificar se o usuário está bloqueado
    if (usuario.bloqueado) {
      return res.status(403).json({ message: 'Usuário bloqueado. Não é possível realizar login.' });
    }

    // Comparação direta de senha (sem hash)
    if (senha !== usuario.senha) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    let paginaDestino;
    switch (usuario.tipo_usuario) {
      case 'Aluno':
        paginaDestino = 'http://127.0.0.1:5500/frontend/src/pages/aluno.html';
        break;
      case 'Professor':
        paginaDestino = 'http://127.0.0.1:5500/frontend/src/pages/professor.html';
        break;
      case 'Bibliotecario':
        paginaDestino = 'http://127.0.0.1:5500/frontend/src/pages/bibliotecario.html';
        break;
      case 'Administrador':
        paginaDestino = 'http://127.0.0.1:5500/frontend/src/pages/admCadastroUser.html';
        break;
      default:
        return res.status(400).json({ message: 'Tipo de usuário desconhecido' });
    }

    res.json({ message: 'Login realizado com sucesso', paginaDestino });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar o perfil do usuário
app.get('/usuario/perfil', async (req, res) => {
  const { email, senha } = req.query;  // Agora o e-mail e senha são passados como query string

  // Verificar se o e-mail e a senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail ou senha não fornecido na requisição.' });
  }

  try {
    // Consulta para buscar o perfil do usuário com base no e-mail e senha
    const result = await pool.query(
      `SELECT u.nome, u.email, u.tipo_usuario, u.matricula, u.cpf, u.endereco_completo, u.cep, u.data_nascimento, u.bloqueado, f.foto_url
       FROM Usuario u
       LEFT JOIN fotosPerfil f ON u.id = f.usuario_id
       WHERE u.email = $1 AND u.senha = $2`,  // Verifica o e-mail e senha
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado ou senha incorreta' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota de busca de livros
app.get('/livros/busca', async (req, res) => {

  try {
 
    const query = req.query.query.toLowerCase();
    const result = await pool.query(
      `SELECT * FROM titulo 
       WHERE LOWER(nome) LIKE $1 
       OR LOWER(autor) LIKE $2 
       OR LOWER(assunto) LIKE $3`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nenhum livro encontrado." });
    }

    res.json(result.rows);

  } catch (err) {
    console.error("Erro ao buscar livros:", err);
    res.status(500).send("Erro interno do servidor");
  }
});

//atualizar perfil
app.patch('/usuario/perfil', async (req, res) => {
  const { email, nome, endereco, cep, data_nascimento, status, foto_url } = req.body;

// Buscar o perfil do usuário
app.get('/usuario/perfil', async (req, res) => {
  const { email } = req.query;  // O e-mail será passado como query string

  // Verificar se o e-mail foi fornecido
  if (!email) {
    return res.status(400).json({ message: 'E-mail não fornecido na requisição.' });
  }

  try {
    // Consulta para buscar o perfil do usuário
    const result = await pool.query(
      `SELECT u.nome, u.email, u.tipo_usuario, u.matricula, u.cpf, u.endereco_completo, u.cep, u.data_nascimento, u.bloqueado, f.foto_url
       FROM Usuario u
       LEFT JOIN fotosPerfil f ON u.id = f.usuario_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

  // Verifica se o campo email está presente
  if (!email) {
    return res.status(400).json({ message: 'O campo email é obrigatório' });
  }

  try {
    // Atualiza o usuário no banco, apenas com os campos fornecidos
    const query = [];
    const values = [];
    let index = 1;

    if (nome) {
      query.push(`nome = $${index++}`);
      values.push(nome);
    }
    if (endereco) {
      query.push(`endereco_completo = $${index++}`);
      values.push(endereco);
    }
    if (cep) {
      query.push(`cep = $${index++}`);
      values.push(cep);
    }
    if (data_nascimento) {
      query.push(`data_nascimento = $${index++}`);
      values.push(data_nascimento);
    }
    if (status) {
      query.push(`status = $${index++}`);
      values.push(status);
    }

    if (query.length === 0) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar' });
    }

    // Adiciona o email no final para a cláusula WHERE
    query.push(`WHERE email = $${index}`);
    values.push(email);

    const result = await pool.query(
      `UPDATE Usuario SET ${query.join(', ')} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Se houver uma URL de foto, atualiza
    if (foto_url) {
      await pool.query(
        `INSERT INTO fotosPerfil (usuario_id, foto_url) VALUES ($1, $2)
         ON CONFLICT (usuario_id) DO UPDATE SET foto_url = $2`,
        [result.rows[0].id, foto_url]
      );
    }

    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});




// Rota para listar todos os livros 
app.get('/livros', async (req, res) => {

  try {
    const result = await pool.query('SELECT * FROM titulo');
    res.json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar livros', error);
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
});


// rota de cadastro de livro
app.post('/livros', async (req, res) => {
  const { nome, isbn, autor, editora, assunto, edicao, quantidade_exemplares } = req.body;

  try {
      // Inserir título na tabela 'titulo'
      const result = await pool.query(
          'INSERT INTO titulo (nome, isbn, autor, editora, assunto, edicao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_titulo',
          [nome, isbn, autor, editora, assunto, edicao]
      );
      const tituloId = result.rows[0].id_titulo; // ID do título inserido

      // Inserir no acervo
      const acervoResult = await pool.query(
          'INSERT INTO acervo (id_titulo, data_inclusao) VALUES ($1, CURRENT_DATE) RETURNING id_acervo',
          [tituloId]
      );
      const acervoId = acervoResult.rows[0].id_acervo; // ID do acervo inserido

      // Inserir exemplares na tabela 'exemplares'
      for (let i = 0; i < quantidade_exemplares; i++) {
          await pool.query(
              'INSERT INTO exemplares (id_acervo, estado, status_disponibilidade) VALUES ($1, $2, $3)',
              [acervoId, 'Bom', true]  // Estado padrão é 'Bom' e disponibilidade é 'true'
          );
      }

      res.status(201).json({ message: 'Título, acervo e exemplares adicionados com sucesso' });
  } catch (error) {
      console.error('Erro ao adicionar título, acervo e exemplares', error);
      res.status(500).json({ message: 'Erro ao adicionar título, acervo e exemplares', error: error.message });
  }
});





//CADASTRO de usuario
app.post('/usuarios/cadastrar', async (req, res) => {
  const { nome, email, senha, tipo_usuario, matricula, cpf, endereco_completo, cep, data_nascimento, numero_registro } = req.body;

  // Verifica se os campos obrigatórios foram preenchidos
  if (!nome || !email || !senha || !tipo_usuario || (!matricula && ['Aluno', 'Professor', 'Bibliotecário'].includes(tipo_usuario))) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios não preenchidos.' });
  }

  // Verifica se o nome tem pelo menos 2 palavras
  const nomeArray = nome.trim().split(' ');
  if (nomeArray.length < 2) {
    return res.status(400).json({ mensagem: 'O nome completo deve ter pelo menos dois nomes.' });
  }

  // Verifica se a senha tem pelo menos 8 caracteres
  if (senha.length < 8) {
    return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 8 caracteres.' });
  }

  try {
    // Verifica se o e-mail já está cadastrado, mas apenas se o tipo de usuário não for "Externo"
    if (tipo_usuario !== 'Externo') {
      const emailExiste = await pool.query('SELECT * FROM Usuario WHERE email = $1', [email]);
      if (emailExiste.rows.length > 0) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
      }
    }

    // Caso o tipo de usuário seja "Externo", podemos definir valores de email e senha como null
    const emailToInsert = tipo_usuario === 'Externo' ? null : email;
    const senhaToInsert = tipo_usuario === 'Externo' ? null : senha;

    // Definir valores para o campo 'bloqueado' e 'data_bloqueio' (por padrão, um novo usuário não estará bloqueado)
    const bloqueadoToInsert = false;  // Por padrão, o usuário não estará bloqueado
    const dataBloqueioToInsert = null; // Sem data de bloqueio inicialmente

    // Insere o usuário no banco de dados
    const novoUsuario = await pool.query(
      `INSERT INTO Usuario (nome, email, senha, tipo_usuario, matricula, cpf, endereco_completo, cep, data_nascimento, numero_registro, bloqueado, data_bloqueio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [nome, emailToInsert, senhaToInsert, tipo_usuario, matricula || null, cpf || null, endereco_completo || null, cep || null, data_nascimento || null, numero_registro || null, bloqueadoToInsert, dataBloqueioToInsert]
    );

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: novoUsuario.rows[0] });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
});




// bibliotecario
app.get('/dados-bibliotecario', async (req, res) => {
  try {
    // Conta o número de livros na tabela 'Titulo'
    const livros = await pool.query('SELECT COUNT(*) FROM Titulo');

    // Conta o número de registros de multas na tabela 'Multa'
    const multas = await pool.query('SELECT COUNT(*) FROM Multa');

    // Conta o número total de empréstimos feitos (considerando todos os empréstimos realizados)
    const emprestimos = await pool.query('SELECT COUNT(*) FROM Emprestimo');

    // Conta o número de usuários bloqueados
    const usuariosBloqueados = await pool.query('SELECT COUNT(*) FROM Usuario WHERE bloqueado = true');

    // Retorna os dados
    res.json({
      livros: livros.rows[0].count,
      multas: multas.rows[0].count,
      emprestimos: emprestimos.rows[0].count,
      usuariosBloqueados: usuariosBloqueados.rows[0].count, // Número de usuários bloqueados
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar dados.' });
  }
});



//cadastro do usuario ext
app.post('/api/usuario-externo', async (req, res) => {
  const { nomeCompleto, cpf, endereco, cep, dataNascimento } = req.body;

  if (!nomeCompleto || !cpf || !endereco || !cep || !dataNascimento) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
      // Verificar se o usuário tem multa
      const multaResult = await pool.query(
          'SELECT * FROM Multa WHERE id_usuario = (SELECT id FROM Usuario WHERE cpf = $1) AND data > CURRENT_DATE - INTERVAL \'6 months\'',
          [cpf]
      );

      if (multaResult.rows.length > 0) {
          return res.status(403).json({ message: 'Usuário está barrado por ter multa pendente.' });
      }

      // Gerar número de registro alfanumérico
      const numeroRegistro = `REG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Verificar se o tipo de usuário é "Externo" e não enviar o email
      const email = null;  // Usuário externo não tem email

      // Inserir o novo usuário no banco de dados
      const result = await pool.query(
          `INSERT INTO Usuario (nome, email, senha, tipo_usuario, matricula, cpf, endereco_completo, cep, data_nascimento, numero_registro)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [nomeCompleto, email, null, 'Externo', null, cpf, endereco, cep, dataNascimento, numeroRegistro]
      );

      const usuarioId = result.rows[0].id;

      // Retornar sucesso
      res.status(201).json({ message: 'Usuário externo cadastrado com sucesso!', id: usuarioId });
  } catch (error) {
      console.error('Erro ao cadastrar usuário externo:', error);
      res.status(500).json({ message: 'Erro ao cadastrar usuário externo. Tente novamente.' });
  }
});

// Rota para realizar a reserva de um empréstimo com base no nome do título
app.post('/api/emprestimo/reservar', async (req, res) => {
  const { nomeUsuario, emailUsuario, nomeTitulo } = req.body;

  // Verificando se todos os campos foram enviados
  if (!nomeUsuario || !emailUsuario || !nomeTitulo) {
      return res.status(400).json({ mensagem: 'Nome do usuário, e-mail e título são obrigatórios.' });
  }

  try {
      // Buscar o usuário pelo nome e e-mail
      const usuarioResult = await pool.query(
          'SELECT id FROM usuario WHERE nome = $1 AND email = $2', 
          [nomeUsuario, emailUsuario]
      );

      if (usuarioResult.rows.length === 0) {
          return res.status(400).json({ mensagem: 'Usuário não encontrado.' });
      }

      const usuarioId = usuarioResult.rows[0].id;

      // Verificar se o usuário já tem uma reserva pendente
      const reservaPendentes = await pool.query(
          'SELECT * FROM reserva WHERE id_usuario = $1 AND status_reserva = $2', 
          [usuarioId, 'Pendente']
      );

      if (reservaPendentes.rows.length > 0) {
          return res.status(400).json({ mensagem: 'Você já tem uma reserva pendente.' });
      }

      // Buscar o título pelo nome
      const tituloResult = await pool.query(
          'SELECT id_titulo FROM titulo WHERE nome ILIKE $1',
          [nomeTitulo]
      );

      if (tituloResult.rows.length === 0) {
          return res.status(400).json({ mensagem: 'Título não encontrado.' });
      }

      const idTitulo = tituloResult.rows[0].id_titulo;

      // Buscar o acervo e verificar a disponibilidade de exemplares
      const acervoResult = await pool.query(
          'SELECT id_acervo FROM acervo WHERE id_titulo = $1',
          [idTitulo]
      );

      if (acervoResult.rows.length === 0) {
          return res.status(400).json({ mensagem: 'Acervo não encontrado.' });
      }

      const idAcervo = acervoResult.rows[0].id_acervo;

      // Verificar se há exemplares disponíveis
      const exemplarResult = await pool.query(
          'SELECT id_exemplar FROM exemplares WHERE id_acervo = $1 AND status_disponibilidade = true LIMIT 1',
          [idAcervo]
      );

      if (exemplarResult.rows.length === 0) {
          return res.status(400).json({ mensagem: 'Nenhum exemplar disponível.' });
      }

      const exemplarId = exemplarResult.rows[0].id_exemplar;

      // Criar a reserva
      const reservaResult = await pool.query(
          'INSERT INTO reserva (id_usuario, id_exemplar, status_reserva) VALUES ($1, $2, $3) RETURNING *',
          [usuarioId, exemplarId, 'Pendente']
      );

      return res.status(201).json({ mensagem: 'Reserva realizada com sucesso!', reserva: reservaResult.rows[0] });

  } catch (error) {
      console.error('Erro ao realizar a reserva:', error);
      res.status(500).json({ mensagem: 'Erro ao realizar a reserva. Tente novamente.' });
  }
});




// Listar reservas pendentes
app.get('/api/emprestimo/reservas', async (req, res) => {
  try {
    const reservas = await pool.query(`
      SELECT 
        r.id AS id_reserva,
        u.nome AS usuario_nome,
        t.nome AS exemplar_titulo,
        r.data_reserva AS data_solicitacao,
        r.status_reserva
      FROM reserva r
      JOIN usuario u ON r.id_usuario = u.id
      JOIN exemplares e ON r.id_exemplar = e.id_exemplar
      JOIN acervo a ON e.id_acervo = a.id_acervo
      JOIN titulo t ON a.id_titulo = t.id_titulo
      WHERE r.status_reserva = 'Pendente'
    `);
    res.json({ reservas: reservas.rows });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({ mensagem: 'Erro ao listar reservas.', erro: error.message });
  }
});



// Rota para confirmar um empréstimo após a reserva
app.post('/api/emprestimo/confirmar', async (req, res) => {
  const { idReserva, idBibliotecario } = req.body;

  try {
    const reservaResult = await pool.query(
      'SELECT id_usuario, id_exemplar FROM reserva WHERE id = $1 AND status_reserva = $2',
      [idReserva, 'Pendente']
    );

    if (reservaResult.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Reserva não encontrada ou já processada.' });
    }

    const { id_usuario, id_exemplar } = reservaResult.rows[0];

    // Inserir um novo empréstimo, agora considerando a coluna 'data_renovacao'
    await pool.query(
      'INSERT INTO emprestimo (data_pegou, id_usuario, id_exemplar, data_renovacao) VALUES (CURRENT_DATE, $1, $2, NULL)',
      [id_usuario, id_exemplar]
    );

    // Atualizar o status da reserva
    await pool.query(
      'UPDATE reserva SET status_reserva = $1 WHERE id = $2',
      ['Confirmada', idReserva]
    );

    res.status(200).json({ mensagem: 'Empréstimo confirmado com sucesso!' });
  } catch (error) {
    console.error('Erro ao confirmar empréstimo:', error);
    res.status(500).json({ mensagem: 'Erro ao confirmar o empréstimo.', erro: error.message });
  }
});



// Renova empréstimo
app.post('/api/emprestimo/renovar', async (req, res) => {
  const { emprestimoId } = req.body;

  try {
    // Verificar se o empréstimo está ativo e pode ser renovado (não devolvido e sem renovação prévia)
    const emprestimoResult = await pool.query(
      'SELECT * FROM Emprestimo WHERE id = $1 AND data_devolveu IS NULL',
      [emprestimoId]
    );

    if (emprestimoResult.rows.length === 0) {
      return res.status(400).json({ mensagem: 'Empréstimo não encontrado ou já foi devolvido.' });
    }

    const emprestimo = emprestimoResult.rows[0];

    // Verificar se já foi renovado
    if (emprestimo.data_renovacao) {
      return res.status(400).json({ mensagem: 'Este empréstimo já foi renovado e não pode ser renovado novamente.' });
    }

    // Atualizar a data de devolução e registrar a data de renovação
    await pool.query(
      'UPDATE Emprestimo SET data_renovacao = NOW(), data_devolveu = NOW() + INTERVAL \'15 days\' WHERE id = $1',
      [emprestimoId]
    );

    res.status(200).json({ mensagem: 'Empréstimo renovado com sucesso!' });

  } catch (error) {
    console.error('Erro ao renovar o empréstimo:', error);
    res.status(500).json({ mensagem: 'Erro ao renovar o empréstimo.', erro: error.message });
  }
});


// Nova rota separada para listar empréstimos renováveis ou renovados
app.get('/api/emprestimo/renovacoes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id, u.nome AS usuario_nome, t.nome AS titulo_livro, 
             e.data_pegou, e.data_renovacao
      FROM Emprestimo e
      JOIN Usuario u ON u.id = e.id_usuario
      JOIN Exemplares ex ON ex.id_exemplar = e.id_exemplar
      JOIN Acervo a ON a.id_acervo = ex.id_acervo
      JOIN Titulo t ON t.id_titulo = a.id_titulo
      WHERE e.data_devolveu IS NULL
      AND (e.data_pegou + INTERVAL '15 days' > NOW() OR e.data_renovacao IS NOT NULL)
    `);
    res.status(200).json({ renovacoes: result.rows });
  } catch (error) {
    console.error('Erro ao buscar empréstimos para renovação:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar empréstimos para renovação.', erro: error.message });
  }
});


// Rota para registrar devolução de livro
app.post('/api/devolucao', async (req, res) => {
  const { emprestimoId, exemplarId, estadoLivro, multa, usuarioId } = req.body;

  try {
    // Verificar se o empréstimo está em aberto
    const emprestimoResult = await pool.query('SELECT * FROM Emprestimo WHERE id = $1 AND data_devolveu IS NULL', [emprestimoId]);

    if (emprestimoResult.rows.length === 0) {
      return res.status(400).json({ mensagem: 'Empréstimo não encontrado ou já devolvido.' });
    }

    // Registrar a devolução
    const devolucaoResult = await pool.query(
      'UPDATE Emprestimo SET data_devolveu = NOW(), estado_livro = $1 WHERE id = $2 RETURNING *',
      [estadoLivro, emprestimoId]
    );

    // Verificar se há multa a ser cobrada
    let multaValor = multa;
    if (!multaValor) {
      // Se a multa não foi fornecida, calcular com base no atraso
      const diasAtraso = Math.floor((new Date() - new Date(emprestimoResult.rows[0].data_pegou)) / (1000 * 60 * 60 * 24));
      multaValor = diasAtraso > 0 ? 20 + diasAtraso : 0;
    }

    if (multaValor > 0) {
      await pool.query(
        'INSERT INTO Multa (id_usuario, id_emprestimo, valor, data) VALUES ($1, $2, $3, NOW())',
        [usuarioId, emprestimoId, multaValor]
      );
    }

    res.status(200).json({ mensagem: 'Livro devolvido com sucesso!', devolucao: devolucaoResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao realizar devolução.' });
  }
});


// Multas
// Endpoint para listar as multas
app.get('/api/multas', async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT u.nome, e.data_pegou, e.data_devolveu, m.valor, m.data
          FROM Emprestimo e
          JOIN Usuario u ON e.id_usuario = u.id
          LEFT JOIN Multa m ON e.id = m.id_emprestimo
          WHERE e.data_devolveu IS NULL
      `);

      const multas = result.rows.map(row => {
          const diasAtraso = Math.ceil((new Date() - new Date(row.data_devolveu)) / (1000 * 60 * 60 * 24));
          const diasTolerancia = row.renovado ? 30 : 15;
          const valorMulta = 20 + (diasAtraso - diasTolerancia) * 1;

          return {
              usuario: row.nome,
              dataEmprestimo: row.data_pegou,
              dataDevolucao: row.data_devolveu,
              valor: valorMulta > 0 ? valorMulta : 0,
              status: valorMulta > 0 ? 'Pendente' : 'Pago'
          };
      });

      res.status(200).json(multas);
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao listar as multas.' });
  }
});

// Endpoint para cobrar a multa
app.post('/api/multa/cobrar', async (req, res) => {
  const { emprestimoId, usuarioId } = req.body;

  try {
      // Verificar se o usuário tem multas
      const multasResult = await pool.query('SELECT * FROM Multa WHERE id_usuario = $1 AND data > NOW() - INTERVAL \'6 months\'', [usuarioId]);

      if (multasResult.rows.length >= 1) {
          return res.status(400).json({ mensagem: 'Usuário está barrado por ter multa recente.' });
      }

      const emprestimoResult = await pool.query('SELECT * FROM Emprestimo WHERE id = $1', [emprestimoId]);

      if (emprestimoResult.rows.length === 0) {
          return res.status(400).json({ mensagem: 'Empréstimo não encontrado.' });
      }

      const diasAtraso = Math.floor((new Date() - new Date(emprestimoResult.rows[0].data_pegou)) / (1000 * 60 * 60 * 24));
      const multa = diasAtraso > 0 ? 20 + diasAtraso : 0;

      if (multa > 0) {
          await pool.query(
              'INSERT INTO Multa (id_usuario, id_emprestimo, valor, data) VALUES ($1, $2, $3, NOW())',
              [usuarioId, emprestimoId, multa]
          );
      }

      res.status(200).json({ mensagem: 'Multa cobrada com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao cobrar a multa.' });
  }
});

app.get('/calcular-multas', async (req, res) => {
  try {
      // Obter todos os empréstimos não devolvidos
      const result = await pool.query(`
          SELECT e.id, e.data_pegou, e.data_devolveu, e.data_renovacao, u.id AS usuario_id, u.tipo_usuario
          FROM Emprestimo e
          JOIN Usuario u ON e.id_usuario = u.id
          WHERE e.data_devolveu IS NULL
      `);

      const multas = [];

      for (let emprestimo of result.rows) {
          const { id, data_pegou, data_devolveu, data_renovacao, usuario_id, tipo_usuario } = emprestimo;
          let diasAtraso = 0;
          let multa = 0;
          let dataLimite;

          // Calcular dias de atraso
          const hoje = new Date();
          const dataEmprestimo = new Date(data_pegou);
          const dataRenovacao = data_renovacao ? new Date(data_renovacao) : null;

          if (dataRenovacao) {
              dataLimite = new Date(dataRenovacao);
              dataLimite.setDate(dataLimite.getDate() + 30); // 30 dias de tolerância após renovação
          } else {
              dataLimite = new Date(dataEmprestimo);
              dataLimite.setDate(dataLimite.getDate() + 15); // 15 dias de tolerância
          }

          // Calcular a diferença em dias
          diasAtraso = Math.ceil((hoje - dataLimite) / (1000 * 60 * 60 * 24));

          if (diasAtraso > 0) {
              multa = 20 + diasAtraso; // R$20 fixo + R$1 por dia de atraso
          }

          // Aplicar lógica de bloqueio para usuário externo
          if (tipo_usuario === 'Externo' && multa > 0) {
              await pool.query(`
                  UPDATE Usuario SET bloqueado = TRUE, data_bloqueio = $1
                  WHERE id = $2
              `, [hoje, usuario_id]);
          }

          // Adicionar multa à lista
          if (multa > 0) {
              multas.push({ usuario_id, multa });
              await pool.query(`
                  INSERT INTO Multa (valor, data, id_usuario)
                  VALUES ($1, $2, $3)
              `, [multa, hoje, usuario_id]);
          }
      }

      res.status(200).json({ mensagem: 'Multas calculadas e aplicadas', multas });
  } catch (error) {
      console.error('Erro ao calcular multas:', error);
      res.status(500).json({ mensagem: 'Erro ao calcular multas' });
  }
});

 // Atualizar o status da multa para paga
app.post('/pagar/:id', async (req, res) => {
  try {
      const { id } = req.params;

      await pool.query(`
          UPDATE Multa SET status = 'Paga' WHERE id = $1
      `, [id]);

      res.status(200).json({ mensagem: 'Multa paga com sucesso!' });
  } catch (error) {
      console.error('Erro ao pagar multa:', error);
      res.status(500).json({ mensagem: 'Erro ao pagar multa' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


