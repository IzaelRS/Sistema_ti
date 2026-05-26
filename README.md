# Documentação da Intranet TI

Este documento detalha as configurações técnicas de segurança, monitoramento e criação de logs configurados no backend (`server.js`).

## 🛡️ Segurança e Rate Limit (Anti-Spam)

Para proteger a aplicação contra abusos, ataques de força bruta (tentativas infinitas de senha) e sobrecarga do servidor, existem políticas de bloqueio ("Rate Limit") baseadas no IP de quem acessa:

| Funcionalidade | Rota | Limite de Requisições | Tempo de Bloqueio | Comportamento após o limite |
| :--- | :--- | :--- | :--- | :--- |
| **Tentativas de Login** | `POST /api/login` | **10** | **15 Minutos** | Retorna Erro `429`: "Muitas tentativas de login. Tente novamente em 15 minutos." |
| **Upload de Arquivos** | `POST /api/upload` e `POST /api/documents` | **20** | **1 Hora** | Retorna Erro `429`: "Limite de uploads atingido. Tente novamente em 1 hora." |
| **Navegação Geral na API** | Todas em `/api/*` | **200** | **1 Minuto** | Retorna Erro `429`: "Muitas requisições. Aguarde um momento." |

> *A configuração destes recursos está disponível no arquivo `server.js` na seção de comentários `// --- Rate Limiters ---`.*

---

## 📊 Logs e Rastreabilidade

O servidor utiliza o pacote `morgan` para registrar todas as requisições que chegam. Elas são gravadas de duas formas:
1. **Console (Terminal):** Ao executar o servidor em desenvolvimento, as informações ficam limpas e coloridas no prompt de comando. Dados sigilosos submetidos pelo usuário (como a `password`) recebem censura e são exibidos como `***`.
2. **Arquivo (Disco):** Todo acesso é inserido como histórico no arquivo localizado em `logs/access.log`. A pasta `logs/` está definida para não ir para o controle de versão.

---

## 🩺 Monitoramento (Health Check)

Para conferir o estado do servidor sem precisar olhar o console — ideal para criar dashboards de estabilidade — utilize este endpoint.

**Rota:** `GET /api/health`

**Responde com:** O tempo em que o servidor está rodando (uptime) e estatísticas em tempo real de consumo da memória e da CPU, nesse formato e exemplo:

```json
{
    "status": "ok",
    "timestamp": "2026-04-18T12:00:00.000Z",
    "uptime": "120 minutos",
    "memory": {
        "used": "45 MB",
        "total": "90 MB"
    },
    "system": {
        "platform": "win32",
        "freeMemory": "1500 MB",
        "cpuLoad": "1.5"
    }
}
```

---

## 🖥️ Módulos e Telas da Aplicação

O sistema Intranet TI é composto pelas seguintes interfaces (Single Page Application), acessíveis pelo menu lateral:

### 1. Listagem Geral (Procedimentos e FAQs)
- **Objetivo:** Central Base de Conhecimento da equipe de TI.
- **Funcionalidade:** Permite aos usuários cadastrarem, buscarem e visualizarem guias práticos, tutoriais e manuais. Possui alternância entre visualização em Tabela e Cards. Ao abrir um procedimento, possui um poderoso editor visual em blocos e sumários.

### 2. Documentos
- **Objetivo:** Repositório de arquivos estáticos.
- **Funcionalidade:** Interface voltada para *upload*, listagem e exclusão de arquivos como PDF, PNG, JPG ou WEBP. Ideal para guardar formulários da empresa, drivers ou manuais não editáveis.

### 3. Contas (Gestão Financeira/Contratos)
- **Objetivo:** Controle de faturas, contratos e licenças técnicas atreladas à TI.
- **Funcionalidade:** O módulo consolida contas recorrentes e avulsas com 3 visualizações (Lista, Calendário e Dashboard). Conta com alerta automático inteligente (aba Notificações) que alerta sobre contas pendentes, vencidas ou prestes a vencer.

### 4. Timeline (Painel de Ocorrências)
- **Objetivo:** Painel de monitoramento situacional de incidentes ou demandas em andamento.
- **Funcionalidade:** Relógio visual que acompanha eventos técnicos da TI classificados por categoria (Atendimento, Internet, Infra, Sistemas, Integrações). Eventos *Em Ocorrência* pulsam em vermelho contínuo na tela, servindo como uma ótima ferramenta para projetar em monitores e acompanhar interrupções de sistemas e seus SLAs.

### 5. Usuários (Apenas Administradores)
- **Objetivo:** ACL e controle de acesso da plataforma.
- **Funcionalidade:** Interface restrita à gerência para criação, visualização e deleção de novos usuários com suporte a perfis de acesso. A gestão de senhas já conta com algoritmo de segurança `bcrypt` no banco de dados.

### 6. Minha Conta
- **Objetivo:** Perfil do usuário logado.
- **Funcionalidade:** Permite ao próprio usuário visualizar/editar os dados básicos do seu perfil da sessão ativa, bem como realizar a mudança da sua senha de acesso.

---

## 🚀 Guia Prático de Deploy (Colocando em Produção)

Como esta aplicação utiliza **SQLite** no Backend e **Vite** no Frontend, colocá-la em produção num Windows Server, Linux VPS ou provedora na nuvem é algo ágil, pois elimina-se a necessidade de gerenciar SGBDs robustos como MySQL/PostgreSQL. O banco de dados rodará contido dentro dos próprios arquivos da pasta.

### Passo 1: Construção do Frontend (Build)
Na máquina local do Desenvolvedor, é necessário traduzir e minificar o código HTML/CSS/JS do `/src` para a versão compilada que abastecerá o Backend:
```bash
npm run build
```
Uma pasta chamada `/dist` será gerada na raiz contendo os arquivos prontos.

### Passo 2: Transferência de Arquivos
Você precisará transferir para a máquina que atuará como servidora apenas os arquivos que importam.
**✅ O que enviar (via Git, FTP, ZIP, etc):**
- Os arquivos chaves isolados: `server.js`, `database.js`, `timeline_routes.js`
- Lista de dependências: `package.json` e `package-lock.json`
- A recém-criada pasta compilada `/dist`
- A pasta estática `/public`
- *(Opcional)* Você pode criar lá ou enviar as pastas vazias `uploads/` e `logs/`. A pasta `timeline/` pode ser enviada se contiver arquivos estáticos específicos do módulo.

**❌ O que NÃO enviar:**
- `node_modules/` (Muta conforme O.S)
- `/src` (Trata-se de código cru)

### Passo 3: O Banco de Dados
A maior conveniência do **SQLite** é que o banco não é um serviço rodando de fundo que precisa ser iniciado, ele é um arquivo bruto físico e interpretado de modo "serverless" pela aplicação Express. As regras são simples:
1. **Começando do zero:** Se a aplicação for hospedada sem os arquivos de dados, quando ela sentir a primeira chamada que envolva o BD, os controladores criarão sozinhos os arquivos zerados na raiz gerando automaticamente o administrador da empresa (`Usuário TI` e `admin123`).
2. **Importando dados do desenvolvimento:** Se a sua intranet na sua máquina contem a contabilidade do mês ou os registros verdadeiros do setor, basta copiar o arquivo físico `intranet.db` (do Root) e o colar na raiz do servidor.
*Nota de Servidor: Garanta que o diretório inteiro seja detentor de Permissões de Escrita pelo dono do serviço web. Sem escita, o SQLite será lido estritamente como "Read-Only".*

### Passo 4: Executando no Ambiente Servidor
Com todos arquivos hospedados no local escolhido, acesse o terminal do servidor, e execute:
```bash
# 1. Instalar as dependências do Node limpas para produção
npm install --production

# 2. Instalar globalmente o Gestor de Processos (PM2)
npm install -g pm2

# 3. Inicializar a Aplicação Web em Segundo Plano
pm2 start server.js --name "Intranet-TI"

# 4. Gravar essa tarefa para ser auto-iniciada se a máquina for reiniciada (Boot Persistence)
pm2 startup
pm2 save
```

Após o disparo dessa configuração, toda sua aplicação base, endpoints de monitoramento de saúde (health), painel estático, autenticação criptografada ACL e anti-DDoS e brute force integrados deverão operar normalmente pela porta `:3000` ou aquela configurada dentro de proxies e hosts virtualizados de cada datacenter.

---

## 🔄 Como Atualizar e Criar Novas Funcionalidades (Workflow)

Quando você for implementar novidades (ex: adicionar um chat, refazer uma tela, criar novas tabelas), siga este roteiro exato para não quebrar a aplicação em produção nem perder dados:

### 1. Desenvolvimento (Na sua Máquina Local)
Sempre desenvolva e teste na sua própria máquina e não no servidor oficial.
*   **Para mexer no visual ou nos scripts da tela:** Edite os arquivos dentro da pasta `src/` (arquivos CSS, JS e componentes) e o `index.html`. Você pode usar o comando `npm run dev` para ver as alterações de layout em tempo real no navegador.
*   **Para mexer no Backend ou nas lógicas de Banco:** Edite os arquivos `server.js` (Rotas da API) ou adicione códigos no `database.js`.

### 2. Mudanças de Banco de Dados (Migrations Seguras)
Se a sua nova funcionalidade precisar de uma **nova coluna no banco de dados**, NUNCA mande um banco de dados novo. Em vez disso, abra o arquivo `database.js` e adicione um script para adicionar a coluna na hora da inicialização usando `ALTER TABLE`.**Exemplo (como já feito antes):**
```javascript
// O código adiciona a coluna, e se a função crachar dizendo que a coluna já existe no db de produção, ele só ignora:
db.run("ALTER TABLE accounts ADD COLUMN sua_coluna_nova TEXT", () => { });
```
*Isso garante que ao enviar para o servidor, a sua API vai modelar o banco antigo automaticamente sem esbarrar no que já existia.*

### 3. Empacotando a Atualização (Build)
Sua novidade local da máquina está lida e testada?
1. Pare o seu servidor local.
2. Rode `npm run build` no terminal. Esse comando vai pegar o fruto de todo o seu trabalho na interface (no diretório `/src`) e substituir no pacote protegido do diretório compilado (`/dist`).

### 4. Enviando a Evolução para Produção (Update)
**MUITO CUIDADO NESTE PASSO!** Você precisará transferir a atualização local para o servidor onde o software já está morando.

*   ✅ **O QUE PODE SUBSTITUIR E SOBRESCREVER:** Substitua tranquilamente seus `server.js`, `database.js`, a nova pasta compilada `/dist`, a pasta `/public` e o arquivo `package.json`.
*   ❌ **O QUE VOCÊ NUNCA PODE SUBSTITUIR:** Nunca jogue o arquivo preenchido `intranet.db` do teste do seu PC ali, caso contrário você deletará todo o histórico financeiro e de eventos da TI verdadeira do servidor;
*   ❌ **NÃO MEXA:** Na pasta `/uploads` (isso matará imagens velhas) nem na pasta `/logs`.

### 5. Aplicando e Reiniciando
Lá no terminal do seu servidor final de produção, dê o xeque-mate para recarregar o sistema:
```bash
# Caso você tenha precisado de um pacote novo npm na feature
npm install --production

# Recarrega as rotas da sua aplicação sem a derrubar com violência ("Zero-downtime Reboot")
pm2 reload Intranet-TI
```
*Tudo pronto e seguro! O seu web-app subirá as novas interfaces de imediato aos usuários preservando integralmente tudo.*
