# Intranet TI - Documentação do Projeto

Este projeto é um portal corporativo de TI estruturado como um **monorepo** com Workspaces do NPM. Ele gerencia bases de conhecimento (procedimentos), documentações estáticas, controle financeiro de contas, incidentes em tempo real (timeline) e monitoramento de saúde de servidores, APIs e redes.

---

## 🚀 Arquitetura e Estrutura do Monorepo

O projeto está estruturado em `/apps` contendo:

- **Frontend (`apps/frontend`)**: Single Page Application (SPA) moderna e rápida desenvolvida em HTML, CSS Vanilla (altamente customizado com variáveis dinâmicas e design premium) e JavaScript. Em produção, é construída através do **Vite** e servida de forma performática pelo servidor **Nginx**.
- **Backend (`apps/backend`)**: API RESTful desenvolvida em **Node.js** com **TypeScript** e **Express**. Utiliza o **TypeORM** como ORM integrado ao banco de dados relacional **PostgreSQL**, gerenciando conexões, consultas tipadas e migrações estruturadas.

---

## 🛠️ Tecnologias Principais

- **Frontend**: Vite, JavaScript (ES6+), Nginx (Produção), CSS Vanilla (com design responsivo, animações sutis e paletas de cores refinadas).
- **Backend**: Node.js, TypeScript, Express, TypeORM, bcrypt (segurança de credenciais), multer (gestão de uploads), morgan (sistema de logs de acesso com censura automática de senhas no console).
- **Banco de Dados**: PostgreSQL 15.
- **Orquestração**: Docker & Docker Compose.

---

## 🖥️ Módulos e Telas da Aplicação

1. **Listagem Geral (Procedimentos e FAQs)**:
   - Central de base de conhecimento com busca inteligente.
   - Alternância entre visualização em Tabela e Cards.
   - Editor visual em blocos e sumário dinâmico.
2. **Documentos**:
   - Repositório corporativo para upload de arquivos estáticos (PDFs, imagens PNG/JPG/WEBP).
   - Interface segura para upload, listagem detalhada e deleção de arquivos.
3. **Contas (Gestão Financeira & Contratos)**:
   - Gerenciamento e controle de faturas, licenças de software e contratos de TI.
   - 3 visões complementares: Lista, Calendário e Dashboard de Despesas.
   - Aba de Notificações com alertas inteligentes de contas vencidas ou próximas do vencimento.
4. **Timeline (Painel de Ocorrências)**:
   - Painel situacional para monitoramento de incidentes ou instabilidades do setor de TI.
   - Eventos categorizados (Atendimento, Internet, Infraestrutura, Sistemas, Integrações) com alertas visuais intermitentes (pulso em vermelho) para ocorrências ativas.
5. **Usuários (Restrito a Administradores)**:
   - Controle de acesso (ACL) para criação, visualização e remoção de usuários com criptografia `bcrypt` para armazenamento de senhas.
6. **Minha Conta**:
   - Ajustes de dados do perfil do usuário logado e alteração de senha de acesso.

---

## 🩺 Monitoramento & Diagnóstico (Novas Funcionalidades)

O sistema possui um painel de controle e monitoramento avançado de infraestrutura, dividido nas seguintes abas:

### 1. Status de APIs Externas
Monitoramento em tempo real de latência (tempo de ping em milissegundos) e integridade de APIs externas e locais:
- **PABX Gnew API** (Integração com telefonia)
- **Infocar API** (Dados veiculares)
- **Autentique API** (GraphQL - assinaturas digitais)
- **Sinch API** (Envio de SMS)
- **Pluga API** (Automação de webhooks)
- **Banco de Dados Local** (PostgreSQL)
*Lentidões ou falhas críticas geram alertas automáticos registrados imediatamente no histórico do banco.*

### 2. Diagnóstico em Tempo Real do PABX Gnew
Integração via proxy seguro com os diagnósticos nativos do servidor de telefonia Gnew, exibindo:
- **Espaço em Disco**: Exibição detalhada por partições e montagem (alertas preventivos ao atingir 80% e críticos a partir de 95% de uso).
- **Memória RAM**: Monitoramento de consumo atual da memória RAM (alerta crítico ao atingir 90% de uso).
- **Fail2Ban**: Histórico de IPs bloqueados e tentativas falhas de segurança no Asterisk.
- **Firewall**: Regras de iptables ativas e chains de entrada/saída.
- **Serviços (systemd)**: Status detalhado e logs de execução dos daemons do PABX (Asterisk, online-go, gnew_cdr, dialplan, webhook, etc.).
- **Rede**: IP externo público detectado, portas abertas em escuta (LISTEN), tabela de roteamento do kernel e interfaces ativas.

### 3. Histórico de Eventos e Alertas
Um feed persistente de eventos de monitoramento (`monitoring_events`):
- Armazena as mudanças de status (de online para offline) de APIs e falhas de limites de hardware.
- Busca textual inteligente e filtros refinados por nível de gravidade (`Info`, `Alerta` e `Crítico`) e intervalo de datas.
- Paginação dinâmica de alta performance e opção de limpar logs de histórico pelo painel administrativo.

### 4. Infraestrutura (Lansweeper Switch Monitoring)
- Integração direta com a API do **Lansweeper** para monitorar switches locais na infraestrutura da empresa.
- Exibe o status da comunicação de cada switch (Online/Offline) facilitando a detecção imediata de quedas físicas na rede.

---

## 🛡️ Segurança e Rate Limit (Anti-Spam)

Para proteger o backend Express contra abusos de requisições e ataques de força bruta, o sistema possui regras de rate-limiting (baseadas em IP de origem):
- **Tentativas de Login** (`POST /api/login`): Máximo de **10** requisições por IP a cada 15 minutos (Erro 429).
- **Upload de Arquivos** (`POST /api/upload` e `/api/documents`): Limite de **20** requisições por IP a cada 1 hora (Erro 429).
- **Rotas Gerais da API** (`/api/*`): Máximo de **200** requisições por IP a cada 1 minuto (Erro 429).

---

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v18+)
- Docker e Docker Compose (caso opte por rodar em contêineres)

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e configure os dados:
```env
# Banco de Dados PostgreSQL
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=intranet_ti

# Integração PABX Gnew
GNEW_USERNAME=usuario_gnew
GNEW_PASSWORD=senha_gnew

# Integração Lansweeper
LANSWEEPER_URL=https://192.168.0.92
LANSWEEPER_USER=admin
LANSWEEPER_PASS=senha_lansweeper
```

---

### Opção A: Execução via Docker (Recomendado)
A forma mais ágil de rodar todo o ambiente de forma isolada, com banco e hot-reloading configurados.

1. Suba todo o ambiente local (PostgreSQL + Express Backend + Vite Frontend):
   ```bash
   npm run docker:local:up
   ```
   *O frontend estará acessível em `http://localhost:5173` e a API rodando em `http://localhost:3000`.*
   *As alterações nos códigos locais das pastas `/apps` refletirão instantaneamente dentro do contêiner.*

2. Para parar os serviços locais:
   ```bash
   npm run docker:local:down
   ```

---

### Opção B: Execução Nativa (Sem Docker)
Ideal para desenvolvedores que preferem rodar o Node.js de forma nativa e conectar a um SGBD PostgreSQL local.

1. Instale as dependências de todo o projeto (o monorepo utiliza npm workspaces para instalar em todas as pastas automaticamente):
   ```bash
   npm install
   ```

2. Certifique-se de que o banco de dados definido no seu arquivo `.env` já existe no PostgreSQL local.

3. Inicie os serviços locais:
   - **Para rodar a API (Backend)**:
     ```bash
     npm run backend:dev
     ```
     *(Inicia o TypeScript usando `ts-node` e ativa o `nodemon` na porta `3000`)*
   - **Para rodar a Interface (Frontend)**:
     ```bash
     npm run frontend:dev
     ```
     *(Inicia o servidor de desenvolvimento do Vite em `http://localhost:5173`)*

> [!NOTE]
> Ao iniciar o backend pela primeira vez, as migrations do TypeORM serão executadas e os dados iniciais padrão (Seeds), como o usuário `ti@empresa.com.br` com a senha `admin123` e os tópicos padrões da timeline, serão criados automaticamente.

---

## 🚀 Guia Prático de Deploy (Produção)

### Opção A: Deploy com Docker (Recomendado)
Ideal para implantar a aplicação completa com banco isolado e de forma rápida.

1. No servidor de produção, configure as variáveis de ambiente no arquivo `.env`.
2. Execute o build e inicialize os contêineres de produção:
   ```bash
   npm run docker:up
   ```
   *Este comando utiliza o `docker-compose.yml` para:*
   - Provisionar um contêiner PostgreSQL com volume mapeado para persistência de dados.
   - Compilar o backend TypeScript (`tsc`) e executá-lo em modo de produção na porta `3000`.
   - Compilar o frontend Vite e encapsulá-lo com um servidor Nginx otimizado na porta `80` (configurado para roteamento SPA e proxy da API).

3. Para encerrar os serviços em produção:
   ```bash
   npm run docker:down
   ```

---

### Opção B: Deploy Manual no Servidor
Caso seu servidor não suporte Docker:

1. **Build do Frontend**:
   Na sua máquina de desenvolvimento ou esteira de CI/CD, execute:
   ```bash
   npm run frontend:build
   ```
   *Isso gerará os arquivos estáticos compilados em `apps/frontend/dist`.*

2. **Build do Backend**:
   Transpile o código TypeScript para JavaScript na pasta do backend:
   ```bash
   npm run backend:build
   ```
   *Isso gerará o código pronto para produção em `apps/backend/dist`.*

3. **Arquivos para o Servidor**:
   Transfira para o servidor:
   - A pasta `apps/backend/dist` (código do servidor compilado).
   - O arquivo `apps/backend/package.json` e `apps/backend/package-lock.json`.
   - A pasta de arquivos compilados do frontend `apps/frontend/dist`.
   - A pasta de imagens estáticas `/public` (se houver uploads).

4. **Instalar Dependências de Produção**:
   No servidor, acesse a pasta do backend e execute:
   ```bash
   npm install --production
   ```

5. **Gerenciar Processo com PM2**:
   Para garantir que o backend Express fique online de forma contínua e reinicie se houver falhas:
   ```bash
   # Instalar gerenciador de forma global
   npm install -g pm2

   # Iniciar o servidor
   pm2 start dist/server.js --name "Intranet-TI-Backend"

   # Configurar inicialização junto com o boot do sistema operacional
   pm2 startup
   pm2 save
   ```

6. **Configuração de Servidor Web (Nginx ou Apache)**:
   Configure o Nginx apontando a pasta raiz (root) para o diretório `apps/frontend/dist` na porta `80` e realize o redirecionamento (Proxy Reverso) de `/api` para `http://localhost:3000/api`.

---

## 🔄 Fluxo de Migrations (Alterações no Banco de Dados)

Nenhum ajuste estrutural de tabelas e colunas deve ser feito manualmente no SGBD PostgreSQL. Sempre utilize o fluxo do TypeORM:

1. **Alterar Entidades**: Realize as modificações necessárias nos arquivos de entidade em `apps/backend/src/entities/`.
2. **Gerar a Migration**: Execute o comando informando o nome da nova migração:
   ```bash
   npm run backend:migration:generate -- apps/backend/src/migrations/NomeDaSuaMigration
   ```
3. **Aplicar Localmente**: Teste a migração no seu ambiente de desenvolvimento:
   ```bash
   npm run backend:migration:run
   ```
4. **Execução em Produção**: O backend Express foi configurado para rodar `AppDataSource.runMigrations()` automaticamente na inicialização, aplicando todas as migrations pendentes no banco de produção sem intervenção manual.
