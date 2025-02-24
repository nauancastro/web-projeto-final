# BarberTime

BarberTime é uma plataforma web que simplifica a gestão de agendamentos e serviços para barbearias comunitárias. A aplicação oferece uma interface intuitiva para clientes realizarem suas reservas, enquanto barbearias e administradores têm ferramentas simples para gerenciar horários, serviços e equipe.

## Membros da Equipe

- Nauan Aires (536825)
- Fernando Castro (509954)

## Arquitetura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Implementado em HTML, CSS (Tailwind) e JavaScript, localizado em [frontend/](frontend/).  
  Utiliza práticas modernas de UI/UX, como menus mobile em overlay, e é totalmente responsivo.

- **Backend**: Desenvolvido em TypeScript com Node.js utilizando a ferramenta strapi e estruturado para servir uma API REST, localizado em [barbertime-api/](barbertime-api/).  
  Conta com configurações específicas em [barbertime-api/config/](barbertime-api/config/) e integração com banco de dados SQLite ([data.db](barbertime-api/database/data.db)).

## Tecnologias Utilizadas

### Frontend

- HTML, CSS e JavaScript
- [Tailwind CSS](frontend/tailwind.config.js) para estilização e layout responsivo
- Layouts modernos com menus mobile sobrepostos para melhor experiência do usuário

### Backend

- Strapi como principal ferramenta
- Node.js com TypeScript ([tsconfig.json](barbertime-api/tsconfig.json))
- Banco de dados SQLite ([data.db](barbertime-api/database/data.db))
- Estrutura modular de API configurada em [barbertime-api/config/api.ts](barbertime-api/config/api.ts)
- Integração com variáveis de ambiente via [.env](barbertime-api/.env)

## Funcionalidades

### Cliente

- Visualizar horários disponíveis e agendar serviços
- Remarcar e desfazer agendamentos

### Barbeiro

- Visualizar reservas destinadas
- Reagendar e excluir atendimentos

### Administrador da Barbearia

- Atribuir cargos a usuários do sistema
- Editar e excluir usuários do sistema

### Usuário Não Logado

- Consultar informações sobre a barbearia, serviços e profissionais
- Realizar cadastro para acessar funcionalidades

## Rotas da API

A API REST exposta pelo backend atende às principais entidades da aplicação. Segue uma tabela exemplificando as rotas:

| Método | Endpoint                        | Descrição                                     |
| ------ | ------------------------------- | --------------------------------------------- |
| GET    | `/api/users`                    | Listar todos os barbeiros                               |
| DELETE    | `/api/users/:id`                    | Excluir um id em específico                              |
| GET    | `/api/reservas`                 | Obter a lista de reservas feita para o usuário em questão                                    |
| POST    | `/api/reservas`                 | Criar uma reserva                                    |
| DELETE  | `/api/reservas/:id`                 | Excluir uma reserva em específico                                    |
| PUT    | `/api/reservas/:documentId`                 | Modificar a Reserva em questão                                    |
| GET    | `/api/find-by-barbeiro`             | Listar agendamentos feitos para o barbeiro em questão  |
| GET   | `/api/find-by-cliente`             | Listar agendamentos feitos pelo cliente em questão                     |

Consulte [barbertime-api/config/api.ts](barbertime-api/config/api.ts) para mais detalhes sobre as configurações das rotas e endpoints.

## Instruções de Configuração

### Backend

1. Acesse o diretório [barbertime-api/](barbertime-api/).
2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo .env.
4. Execute o servidor de desenvolvimento

    ```sh
    npm run develop
    ```

### Frontend

1. Acesse o diretório [frontend/](frontend/).
2. Instale as dependências:

    ```sh
    npm install
    ```

3. Execute o servidor de desenvolvimento:

    ```sh
    npm run dev
    ```

### Contribuição

Se você deseja contribuir, sinta-se à vontade para abrir issues ou enviar pull requests. Todas as contribuições são bem-vindas!

### Licença

Este projeto é licenciado sob a MIT License.
