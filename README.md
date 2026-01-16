<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>GEABEG-BACKEND</h1>

  <p>Este é backend do nosso projeto que via conter todas a parte banco, validações, regra de negocios, e as integrações necessarias para nosso aplicação</p>

  <h2>Requisitos</h2>
  <p>Antes de começar, você precisará ter as seguintes ferramentas instaladas:</p>
  <ul>
    <li><a href="https://nodejs.org">Node.js</a> (v12 ou superior)</li>
    <li><a href="https://npmjs.com">npm</a></li>
    <li><a href="https://www.postgresql.org">postgree</a></li>
    <li><a href="https://expressjs.com/pt-br/">express</a></li>
  </ul>

  <h2>Instalação</h2>
  <p>Siga os passos abaixo para instalar e rodar a aplicação:</p>
  <ol>
    <li>Clone este repositório para o seu computador:</li>
    <pre><code>git clone https://github.com/Kurly-Klaw/Kurly-Backend.git
cd kurly-backend</code></pre>
    <li>Instale as dependências do projeto:</li>
    <pre><code>npm install</code></pre>
    <li>Edite o arquivo <code>.env</code> na raiz do projeto. Esse arquivo conterá as variáveis de ambiente necessárias para a configuração do banco de dados e outras configurações sensíveis. Um exemplo de <code>.env</code> é o seguinte:</li>
    <pre><code>PORT=3000
DB_HOST='127.0.0.1'
DB_USERNAME='postgres'
DB_PASSWORD='admin'
DB_DATABASE='kurly-database'
DB_DAILECT='postgres'
DB_PORT=5432</code></pre>
    <p><strong>Nota:</strong> Certifique-se de substituir os valores pelas informações corretas do seu banco de dados.</p>
    <li>(Opcional) Para garantir que as variáveis de ambiente sejam carregadas corretamente, você pode instalar o pacote <code>dotenv</code>:</li>
    <pre><code>npm install dotenv</code></pre>
  </ol>

  <h2>Estrutura do Projeto</h2>
  <pre><code>
nome-do-repositorio/
├── src/
│   └── serve.js             # Arquivo principal do backend Node.js
├── .env                   # Arquivo de variáveis de ambiente
├── package.json           # Dependências e scripts do projeto
└── README.md              # Este arquivo
└── src                    # Pasta que contem todos arquivos e regra de negocio  
  </code></pre>

  <p>- <code>.env</code>: Arquivo onde você configura variáveis de ambiente para o banco de dados.</p>
  <p>- <code>src/server.js</code>: Arquivo principal do servidor Node.js, que conecta ao banco de dados usando as variáveis de ambiente.</p>

  <h2>Rodando a Aplicação</h2>
  <ol>
    <li>Inicie o servidor Node.js:</li>
    <pre><code>npm start</code></pre>
    <li>A aplicação irá rodar localmente no endereço <code>http://localhost:3000</code> (ou a porta configurada no código).</li>
  </ol>

  <h2>Endpoints</h2>
  <ul>
    <li><code>GET /</code>: Retorna uma resposta simples de teste.</li>
    <li><code>POST /login</code>: Recebe credenciais de login e verifica no banco de dados.</li>
  </ul>

  <h2>Tecnologias Usadas</h2>
  <ul>
    <li><strong>Node.js</strong>: Ambiente de execução para JavaScript.</li>
    <li><strong>PostgreSQL</strong> (ou outro banco de dados de sua escolha): Sistema de gerenciamento de banco de dados.</li>
    <li><strong>dotenv</strong>: Para carregar variáveis de ambiente do arquivo <code>.env</code>.</li>
    <li><strong>pg</strong>: Biblioteca Node.js para se conectar ao PostgreSQL.</li>
    <li><strong>jsonwebtoken:</strong>: Para fazer o processo de assinature e login do usuario</li>
