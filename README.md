# Sistema de Biblioteca

Este projeto visa criar um sistema de biblioteca com funcionalidades completas para gestão de empréstimos, devoluções, multas e pesquisa de títulos. O sistema tem diferentes tipos de usuários, como Usuário Externo, Aluno, Professor, Bibliotecário e Administrador, cada um com permissões e funcionalidades específicas.

## Funcionalidades

### Perfil de Usuários

1. **Usuário Externo**
   - **Cadastro**: Nome completo, CPF, endereço completo com CEP, data de nascimento.
   - **Empréstimo**: Pode pegar até 1 título.
   - **Multas**: Caso tenha multa, fica barrado por 6 meses a partir da devolução.
   - **Consulta**: Pode realizar pesquisa de títulos, autores e assuntos.
   - **Sem login**: Não necessita de login para acessar o sistema.

2. **Aluno**
   - **Cadastro**: Nome de Login e senha.
   - **Empréstimo**: Pode pegar até 2 títulos.
   - **Multas**: Pode acumular até 2 multas.
   - **Cancelamento de reserva**: Pode cancelar reservas realizadas.
   - **Pesquisa**: Pode pesquisar livros.

3. **Professor**
   - **Cadastro**: Nome de Login e senha.
   - **Empréstimo**: Sem limite de títulos.
   - **Cancelamento de reserva**: Pode cancelar reservas realizadas.

4. **Bibliotecário**
   - **Cadastro**: Nome de Login e senha.
   - **Empréstimo**: Pode realizar empréstimos.
   - **Devolução**: Pode registrar a devolução dos livros e verificar o estado do exemplar.
   - **Multas**: Pode calcular multas e registrar o pagamento.
   - **Cadastro de livros**: Pode cadastrar novos livros no acervo.
   - **Validação de empréstimos**: Apenas o bibliotecário pode validar empréstimos.

5. **Administrador**
   - **Cadastro**: Nome de Login e senha.
   - **Gestão de usuários**: Pode cadastrar novos usuários, incluindo professores e bibliotecários.
   - **Gestão de acervo**: Pode gerenciar exemplares e títulos no sistema.

### Operações

- **Empréstimo**
  - Qualquer usuário pode fazer uma reserva online.
  - A reserva é cancelada automaticamente se não for retirada em até 2 dias.
  - O prazo de devolução é de 15 dias após o empréstimo.
  - Renovação de empréstimo por mais 15 dias.
  - A renovação e o empréstimo podem ser cancelados.

- **Devolução**
  - O usuário pode devolver os livros dentro do prazo estipulado.
  - O estado do exemplar deve ser registrado como 'Bom' ou 'Danificado'.
  - Se houver multa, ela é aplicada.

- **Cobrança de Multa**
  - Multa é cobrada a partir do 15º dia se o livro não for renovado.
  - Se renovado, a cobrança é feita a partir do 30º dia.
  - O valor da multa é de R$ 20,00, acrescido de R$ 1,00 por dia de atraso.

## Como Rodar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu_usuario/repositorio.git


## Contato

Caso tenha dúvidas ou sugestões, entre em contato:

- *Nome:* João Victor 
- *GitHub:* https://github.com/Victor-Souzaa/Biblioteca
