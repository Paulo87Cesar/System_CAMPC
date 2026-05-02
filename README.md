# ERP Jovem Aprendiz — Patrulheiros Campinas

Sistema ERP estilo Salesforce, desenvolvido com **Node.js + TypeScript + MySQL** (backend) e **React + Vite + TypeScript** (frontend).

---

## 📁 Estrutura do Projeto

```
appERP/
├── src/                  # Backend (Node + TypeScript + Express)
│   ├── config/database.ts
│   ├── controllers/index.ts
│   ├── models/base.model.ts
│   ├── routes/index.ts
│   └── index.ts
├── frontend/             # Frontend (React + Vite)
│   └── src/
│       ├── pages/        # Dashboard, Jovens, Inscrições, Educadores...
│       ├── components/   # Sidebar, Topbar, CrudPage
│       └── context/      # ToastContext
├── .env                  # Credenciais do banco
└── erp_aprendiz-*/sql/   # Scripts SQL
```

---

## ⚙️ Configuração do Banco de Dados (MySQL)

1. Crie o banco:
```sql
CREATE DATABASE erp_aprendiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importe o backup:
```bash
mysql -u root -p erp_aprendiz < "erp_aprendiz-20260502T040214Z-3-001/erp_aprendiz/sql/backup_erp_aprendiz_2026.sql"
```

3. Execute o modelo v2 (novas tabelas):
```bash
mysql -u root -p erp_aprendiz < "erp_aprendiz-20260502T040214Z-3-001/erp_aprendiz/sql/erp_aprendiz_modelo_v2.sql"
```

4. Configure o `.env` na raiz do projeto:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=erp_aprendiz
PORT=3000
```

---

## 🚀 Como Rodar

### Backend (API)
```bash
cd appERP
npm install
npm run dev
# API rodando em http://localhost:3000
```

### Frontend
```bash
cd appERP/frontend
npm install
npm run dev
# Interface em http://localhost:5173
```

---

## 🗂️ Módulos Disponíveis

| Módulo       | Descrição                                      |
|-------------|------------------------------------------------|
| Dashboard   | Estatísticas gerais do sistema                  |
| Jovens      | Ficha completa do jovem aprovado                |
| Inscrições  | Formulário de inscrição + aprovação com trigger |
| Educadores  | Gestão de educadores                            |
| Projetos    | Jovem Aprendiz, OFGMT, Transformação            |
| Programas   | OFGMT 2021, OFGMT 2026...                       |
| Cursos      | Cursos com ementa e carga horária               |
| Disciplinas | Grade curricular (encontros/módulos)            |
| Turmas      | Oferta do curso por período e educador          |
| Matrículas  | Vínculo jovem × turma com status               |
| Boletins    | Notas e frequência por disciplina               |

---

## 🌐 Endpoints da API

```
GET/POST   /api/jovens
GET/PUT/DELETE /api/jovens/:id

GET/POST   /api/inscricoes
PATCH      /api/inscricoes/:id/aprovar   ← aciona trigger MySQL

GET/POST   /api/educadores
GET/POST   /api/projetos
GET/POST   /api/programas
GET/POST   /api/cursos
GET/POST   /api/disciplinas
GET/POST   /api/turmas
GET/POST   /api/matriculas
GET/POST   /api/boletim

GET        /api/dashboard/stats
```

---

## 🔧 Tecnologias

- **Backend**: Node.js, TypeScript, Express, MySQL2, dotenv, CORS
- **Frontend**: React 18, TypeScript, Vite, React Router v6, Axios, Lucide React
- **Banco**: MySQL 8.0+, utf8mb4
