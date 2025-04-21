
# 🧠 Topic & Subtopic Tracker

Uma aplicação web simples e moderna construída com React, Supabase e TypeScript que permite que cada usuário crie, edite, visualize e acompanhe seus próprios **tópicos e subtópicos de estudo**, com suporte a links, anotações e autenticação.

## 🚀 Tecnologias utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.io/) (Banco de dados, autenticação e API)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

## 🔐 Autenticação

- **Email/Senha** e **Login com Google**
- Cada usuário enxerga **somente seus próprios tópicos e subtópicos**

---

## ✍️ Funcionalidades

### Tópicos
- ✅ Criar novo tópico
- ✏️ Editar título de tópico
- 🗑️ Excluir tópico

### Subtópicos
- ✅ Adicionar subtópico com:
  - Título
  - Link externo (opcional)
  - Conteúdo (opcional)
- ✅ Marcar como concluído ou não
- 🔎 Visualizar conteúdo adicional do subtópico

### Autenticação
- Login com **email/senha**
- Cadastro de novos usuários
- Login com **Google**

---

## 📁 Estrutura de diretórios

```bash
.
├── index.tsx               # Página principal da aplicação
├── src/
│   └── components/
│       ├── Auth.tsx       # Componente de autenticação
│       └── GlobalCSS.tsx  # Estilos globais
├── lib/
│   └── supabase.ts        # Cliente Supabase
└── styles/
    └── Auth.module.css    # Estilo específico do componente Auth
```

---

## 🛠️ Como executar localmente

### Pré-requisitos

- Node.js v18+
- Conta no [Supabase](https://app.supabase.com/)

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

Crie um arquivo `.env.local` com as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Ou configure diretamente no arquivo `lib/supabase.ts`.

### 4. Execute o projeto

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Tabelas no Supabase

### Tabela: `topics`

| Coluna     | Tipo     |
|------------|----------|
| id         | integer  |
| title      | text     |
| user_id    | uuid     |
| created_at | timestamptz |

### Tabela: `subtopics`

| Coluna     | Tipo     |
|------------|----------|
| id         | integer  |
| title      | text     |
| topic_id   | integer  |
| user_id    | uuid     |
| completed  | boolean  |
| url        | text     |
| content    | text     |

---

## 📌 To Do

- [ ] Suporte a tags por tópico
- [ ] Filtro por tópicos concluídos / pendentes
- [ ] Upload de imagens nos subtópicos

---

## 🧑‍💻 Autor

Feito com ❤️ por [Seu Nome](https://github.com/seu-usuario)

---

## 📄 Licença

Este projeto está sob a licença MIT.
