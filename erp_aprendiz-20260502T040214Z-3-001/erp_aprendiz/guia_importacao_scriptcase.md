# 📘 Guia Detalhado — Criação das 12 Aplicações no ScriptCase 9

> **Projeto:** Patrulheiros_System  
> **Conexão:** conn_mysql → banco `erp_aprendiz`  
> **ScriptCase:** v9.13.018

---

## ⚠️ Por que não é possível importar diretamente?

Os arquivos `.bkp` do ScriptCase usam um formato proprietário baseado em **serialização PHP** (`serialize()`) com centenas de atributos internos que variam conforme a versão. Gerar esses arquivos externamente causaria erros de importação. A única forma confiável é **criar as aplicações dentro do ScriptCase**.

> [!TIP]
> **Atalho importante:** Você já tem o `grid_inscricao_2026` funcionando. Para cada novo Grid, você pode **duplicá-lo** e apenas alterar o SQL e os campos. Isso é muito mais rápido.

---

## 🔧 Antes de Começar

1. Abra o ScriptCase no navegador
2. Selecione o projeto **Patrulheiros_System**
3. Verifique se a conexão **conn_mysql** está funcionando:
   - Menu: **Projeto → Conexões → conn_mysql → Testar Conexão**
4. Se ainda não executou o script do modelo v2, execute agora no MySQL

---

## Aplicação 1 — Grid: Educadores

### 1.1 Criar o Grid

1. Clique em **Nova Aplicação** (botão verde no topo)
2. Selecione **Consulta (Grid)**
3. Na tela que aparece:
   - **Nome da aplicação:** `grid_educador`
   - **Conexão:** `conn_mysql`
4. Na tela de SQL, cole:

```sql
SELECT id_educador, nome, email, cpf, telefone, especialidade, ativo
FROM educador
ORDER BY nome
```

5. Clique em **Criar**

### 1.2 Configurar os rótulos dos campos

Após a criação, vá em **Campos** no menu lateral e renomeie:

| Campo | Rótulo |
|---|---|
| `id_educador` | ID |
| `nome` | Nome |
| `email` | E-mail |
| `cpf` | CPF |
| `telefone` | Telefone |
| `especialidade` | Especialidade |
| `ativo` | Ativo |

### 1.3 Criar o Formulário vinculado

1. Clique em **Nova Aplicação → Formulário**
2. **Nome:** `form_educador`
3. **Conexão:** `conn_mysql`
4. **Tabela:** selecione `educador`
5. Marque todos os campos **exceto** `id_educador` (é auto-increment) e `criado_em`
6. Clique em **Criar**
7. No campo `ativo`, altere o tipo para **Select** com opções:
   - `S` = Sim
   - `N` = Não

### 1.4 Vincular Grid ao Formulário

1. Volte ao `grid_educador`
2. No menu lateral, vá em **Aplicações → Ligação**
3. Clique em **Nova Ligação**
4. **Tipo:** Formulário de Edição
5. **Aplicação:** `form_educador`
6. **Parâmetros:** `id_educador` = `id_educador`
7. Marque: ✅ Inserir, ✅ Alterar, ✅ Excluir
8. Clique **Salvar**

---

## Aplicação 2 — Grid: Projetos

### 2.1 Criar o Grid

1. **Nova Aplicação → Consulta (Grid)**
2. **Nome:** `grid_projeto`
3. **SQL:**

```sql
SELECT id_projeto, nome_projeto, descricao, data_inicio, data_fim, ativo
FROM projeto
ORDER BY nome_projeto
```

4. **Rótulos:**

| Campo | Rótulo |
|---|---|
| `id_projeto` | ID |
| `nome_projeto` | Nome do Projeto |
| `descricao` | Descrição |
| `data_inicio` | Data Início |
| `data_fim` | Data Fim |
| `ativo` | Ativo |

### 2.2 Criar Formulário

1. **Nova Aplicação → Formulário**
2. **Nome:** `form_projeto`
3. **Tabela:** `projeto`
4. Marque: `nome_projeto`, `descricao`, `data_inicio`, `data_fim`, `ativo`
5. Campo `ativo` → tipo **Select** → S=Sim, N=Não
6. Campo `data_inicio` e `data_fim` → tipo **Data**

### 2.3 Vincular

- Grid `grid_projeto` → Ligação → `form_projeto`
- Parâmetro: `id_projeto` = `id_projeto`

---

## Aplicação 3 — Grid: Programas

### 3.1 Criar o Grid

1. **Nome:** `grid_programa`
2. **SQL:**

```sql
SELECT p.id_programa, p.nome_programa, pj.nome_projeto, p.ano, p.ativo
FROM programa p
JOIN projeto pj ON pj.id_projeto = p.id_projeto
ORDER BY p.nome_programa
```

3. **Rótulos:** ID, Nome do Programa, Projeto, Ano, Ativo

### 3.2 Criar Formulário

1. **Nome:** `form_programa`
2. **Tabela:** `programa`
3. Marque: `id_projeto`, `nome_programa`, `descricao`, `ano`, `ativo`

### 3.3 Configurar o Lookup FK — Campo `id_projeto`

Este é o passo mais importante para campos que referenciam outras tabelas:

1. No `form_programa`, clique no campo **`id_projeto`**
2. Na aba **Tipo de Dados**, selecione **Select**
3. Vá na aba **Lookup de Edição**
4. Configure:
   - **Método de lookup:** Automático (Auto-Select)
   - **SQL:**
     ```sql
     SELECT id_projeto, nome_projeto FROM projeto WHERE ativo = 'S' ORDER BY nome_projeto
     ```
   - **Valor armazenado:** `id_projeto`
   - **Valor exibido:** `nome_projeto`
5. Clique **Salvar**

### 3.4 Vincular

- `grid_programa` → `form_programa` → `id_programa` = `id_programa`

---

## Aplicação 4 — Grid: Cursos

### 4.1 Criar o Grid

1. **Nome:** `grid_curso`
2. **SQL:**

```sql
SELECT c.id_curso, c.nome_curso, p.nome_programa,
       c.carga_horaria_horas, c.carga_horaria_minutos, c.ativo
FROM curso c
JOIN programa p ON p.id_programa = c.id_programa
ORDER BY c.nome_curso
```

3. **Rótulos:** ID, Nome do Curso, Programa, CH (horas), CH (min), Ativo

### 4.2 Criar Formulário

1. **Nome:** `form_curso`
2. **Tabela:** `curso`
3. Campos: `id_programa`, `nome_curso`, `descricao`, `conteudo`, `carga_horaria_horas`, `carga_horaria_minutos`, `ativo`

### 4.3 Lookup FK — Campo `id_programa`

- **SQL do lookup:**
  ```sql
  SELECT id_programa, nome_programa FROM programa WHERE ativo = 'S' ORDER BY nome_programa
  ```

### 4.4 Vincular: `grid_curso` → `form_curso` → `id_curso`

---

## Aplicação 5 — Grid: Disciplinas

### 5.1 Criar o Grid

1. **Nome:** `grid_disciplina`
2. **SQL:**

```sql
SELECT d.id_disciplina, d.nome_disciplina, c.nome_curso,
       d.ordem, d.carga_horaria_horas, d.carga_horaria_minutos, d.ativo
FROM disciplina d
JOIN curso c ON c.id_curso = d.id_curso
ORDER BY c.nome_curso, d.ordem
```

3. **Rótulos:** ID, Disciplina, Curso, Ordem, CH (h), CH (min), Ativo

### 5.2 Criar Formulário

1. **Nome:** `form_disciplina`
2. **Tabela:** `disciplina`
3. Campos: `id_curso`, `nome_disciplina`, `descricao`, `carga_horaria_horas`, `carga_horaria_minutos`, `ordem`, `ativo`

### 5.3 Lookup FK — Campo `id_curso`

```sql
SELECT id_curso, nome_curso FROM curso WHERE ativo = 'S' ORDER BY nome_curso
```

### 5.4 Vincular: `grid_disciplina` → `form_disciplina` → `id_disciplina`

---

## Aplicação 6 — Grid: Turmas

### 6.1 Criar o Grid

1. **Nome:** `grid_turma`
2. **SQL:**

```sql
SELECT t.id_turma, t.codigo_turma, c.nome_curso, e.nome AS educador,
       t.periodo, t.data_inicio, t.data_fim, t.vagas, t.ativo
FROM turma t
JOIN curso c ON c.id_curso = t.id_curso
LEFT JOIN educador e ON e.id_educador = t.id_educador
ORDER BY t.codigo_turma
```

3. **Rótulos:** ID, Código, Curso, Educador, Período, Início, Fim, Vagas, Ativo

### 6.2 Criar Formulário

1. **Nome:** `form_turma`
2. **Tabela:** `turma`
3. Campos: `id_curso`, `id_educador`, `codigo_turma`, `periodo`, `data_inicio`, `data_fim`, `vagas`, `local`, `ativo`

### 6.3 Lookups FK (dois campos)

**Campo `id_curso`:**
```sql
SELECT id_curso, nome_curso FROM curso WHERE ativo = 'S' ORDER BY nome_curso
```

**Campo `id_educador`:**
```sql
SELECT id_educador, nome FROM educador WHERE ativo = 'S' ORDER BY nome
```

**Campo `periodo`:** tipo **Select** com opções fixas:
- `Matutino` = Matutino
- `Vespertino` = Vespertino
- `Noturno` = Noturno
- `Integral` = Integral

### 6.4 Vincular: `grid_turma` → `form_turma` → `id_turma`

---

## Aplicação 7 — Grid: Cadastro de Jovens

### 7.1 Criar o Grid

1. **Nome:** `grid_cadastro_jovem`
2. **SQL:**

```sql
SELECT id_jovem, matricula, nome_completo, cpf, genero,
       municipio, inativo, aprovacao_status, data_cadastro
FROM cadastro_jovem
ORDER BY nome_completo
```

3. **Rótulos:** ID, Matrícula, Nome, CPF, Gênero, Município, Inativo, Status, Data Cadastro

### 7.2 Criar Formulário

1. **Nome:** `form_cadastro_jovem`
2. **Tabela:** `cadastro_jovem`
3. Marque os campos principais:
   - `nome_completo`, `nome_social`, `cpf`, `rg`, `genero`, `nascimento`, `estado_civil`, `cor_raca`
   - `email`, `telefone`, `celular`
   - `cep`, `endereco`, `numero`, `bairro`, `municipio`
   - `escolaridade`, `escola`, `periodo`, `serie`
   - `matricula`, `inativo`, `aprovacao_status`, `data_cadastro`
   - `observacoes_sociais`
4. Campo `inativo` → Select: N=Não, S=Sim
5. Campo `aprovacao_status` → Select: Em Análise, Aprovado, Reprovado

### 7.3 Vincular: `grid_cadastro_jovem` → `form_cadastro_jovem` → `id_jovem`

---

## Aplicação 8 — Grid: Matrículas

### 8.1 Criar o Grid

1. **Nome:** `grid_matricula_turma`
2. **SQL:**

```sql
SELECT mt.id_matricula, j.nome_completo AS jovem, t.codigo_turma AS turma,
       mt.data_matricula, mt.status_matricula
FROM matricula_turma mt
JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
JOIN turma t ON t.id_turma = mt.id_turma
ORDER BY mt.data_matricula DESC
```

3. **Rótulos:** ID, Jovem, Turma, Data Matrícula, Status

### 8.2 Criar Formulário

1. **Nome:** `form_matricula_turma`
2. **Tabela:** `matricula_turma`
3. Campos: `id_jovem`, `id_turma`, `data_matricula`, `status_matricula`, `observacoes`

### 8.3 Lookups FK

**Campo `id_jovem`:**
```sql
SELECT id_jovem, nome_completo FROM cadastro_jovem WHERE inativo = 'N' ORDER BY nome_completo
```

**Campo `id_turma`:**
```sql
SELECT id_turma, codigo_turma FROM turma WHERE ativo = 'S' ORDER BY codigo_turma
```

**Campo `status_matricula`:** Select com opções:
- Cursando, Concluído, Desistente, Reprovado, Transferido

### 8.4 Vincular: `grid_matricula_turma` → `form_matricula_turma` → `id_matricula`

---

## Aplicação 9 — Grid: Boletim / Notas

### 9.1 Criar o Grid

1. **Nome:** `grid_boletim_nota`
2. **SQL:**

```sql
SELECT bn.id_nota, j.nome_completo AS jovem, d.nome_disciplina,
       bn.periodo_avaliacao, bn.nota, bn.faltas, bn.presencas
FROM boletim_nota bn
JOIN matricula_turma mt ON mt.id_matricula = bn.id_matricula
JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
JOIN disciplina d ON d.id_disciplina = bn.id_disciplina
ORDER BY j.nome_completo, d.ordem
```

3. **Rótulos:** ID, Jovem, Disciplina, Período, Nota, Faltas, Presenças

### 9.2 Criar Formulário

1. **Nome:** `form_boletim_nota`
2. **Tabela:** `boletim_nota`
3. Campos: `id_matricula`, `id_disciplina`, `periodo_avaliacao`, `nota`, `faltas`, `presencas`, `observacoes`

### 9.3 Lookups FK

**Campo `id_matricula`:**
```sql
SELECT mt.id_matricula, CONCAT(j.nome_completo, ' — ', t.codigo_turma) AS descricao
FROM matricula_turma mt
JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
JOIN turma t ON t.id_turma = mt.id_turma
ORDER BY j.nome_completo
```

**Campo `id_disciplina`:**
```sql
SELECT id_disciplina, nome_disciplina FROM disciplina WHERE ativo = 'S' ORDER BY nome_disciplina
```

### 9.4 Vincular: `grid_boletim_nota` → `form_boletim_nota` → `id_nota`

---

## Aplicação 10 — Grid: Núcleo Familiar

### 10.1 Criar o Grid

1. **Nome:** `grid_inscricao_familia`
2. **SQL:**

```sql
SELECT f.id, i.nome_completo AS inscrito, f.parentesco,
       f.nome_parente, f.cpf_parente, f.salario_parente
FROM inscricao_familia f
JOIN inscricao_2026 i ON i.id = f.id_inscricao
ORDER BY i.nome_completo
```

3. **Rótulos:** ID, Inscrito, Parentesco, Nome do Parente, CPF, Salário

### 10.2 Criar Formulário

1. **Nome:** `form_inscricao_familia`
2. **Tabela:** `inscricao_familia`
3. Campos: `id_inscricao`, `parentesco`, `nome_parente`, `cpf_parente`, `salario_parente`

### 10.3 Lookup FK — Campo `id_inscricao`

```sql
SELECT id, nome_completo FROM inscricao_2026 ORDER BY nome_completo
```

### 10.4 Vincular: `grid_inscricao_familia` → `form_inscricao_familia` → `id`

---

## Aplicação 11 — Grid (View): Boletim Completo

> [!NOTE]
> Esta é uma **view** do banco — somente consulta, **sem formulário**.

### 11.1 Criar o Grid

1. **Nome:** `grid_vw_boletim_jovem`
2. **SQL:**

```sql
SELECT nome_jovem, matricula_jovem, nome_projeto, nome_programa,
       nome_curso, codigo_turma, nome_disciplina, periodo_avaliacao,
       nota, faltas, presencas, status_matricula, educador
FROM vw_boletim_jovem
ORDER BY nome_jovem, ordem_disciplina
```

3. **Rótulos:**

| Campo | Rótulo |
|---|---|
| `nome_jovem` | Jovem |
| `matricula_jovem` | Matrícula |
| `nome_projeto` | Projeto |
| `nome_programa` | Programa |
| `nome_curso` | Curso |
| `codigo_turma` | Turma |
| `nome_disciplina` | Disciplina |
| `periodo_avaliacao` | Período |
| `nota` | Nota |
| `faltas` | Faltas |
| `presencas` | Presenças |
| `status_matricula` | Status |
| `educador` | Educador |

4. **NÃO** vincular formulário (somente leitura)

---

## Aplicação 12 — Grid (View): Matrículas por Jovem

### 12.1 Criar o Grid

1. **Nome:** `grid_vw_matriculas_jovem`
2. **SQL:**

```sql
SELECT nome_jovem, matricula_jovem, nome_projeto, nome_programa,
       nome_curso, codigo_turma, periodo, data_inicio, data_fim,
       data_matricula, status_matricula, educador
FROM vw_matriculas_jovem
ORDER BY nome_jovem, data_matricula
```

3. **Rótulos:** Jovem, Matrícula, Projeto, Programa, Curso, Turma, Período, Início, Fim, Data Matrícula, Status, Educador

4. **NÃO** vincular formulário (somente leitura)

---

## ✅ Checklist Final

Após criar todas as aplicações, marque cada item:

- [ ] `grid_educador` + `form_educador` — vinculados
- [ ] `grid_projeto` + `form_projeto` — vinculados
- [ ] `grid_programa` + `form_programa` — vinculados (lookup `id_projeto`)
- [ ] `grid_curso` + `form_curso` — vinculados (lookup `id_programa`)
- [ ] `grid_disciplina` + `form_disciplina` — vinculados (lookup `id_curso`)
- [ ] `grid_turma` + `form_turma` — vinculados (lookups `id_curso` + `id_educador`)
- [ ] `grid_cadastro_jovem` + `form_cadastro_jovem` — vinculados
- [ ] `grid_matricula_turma` + `form_matricula_turma` — vinculados (lookups `id_jovem` + `id_turma`)
- [ ] `grid_boletim_nota` + `form_boletim_nota` — vinculados (lookups `id_matricula` + `id_disciplina`)
- [ ] `grid_inscricao_familia` + `form_inscricao_familia` — vinculados (lookup `id_inscricao`)
- [ ] `grid_vw_boletim_jovem` — somente consulta ✓
- [ ] `grid_vw_matriculas_jovem` — somente consulta ✓
- [ ] **Gerar código** de todas as aplicações (F5)
- [ ] **Testar** cada Grid e Formulário

---

> [!TIP]
> **Dica de produtividade:** Comece duplicando o `grid_inscricao_2026` existente:
> 1. Clique direito sobre ele → **Duplicar Aplicação**
> 2. Renomeie para `grid_educador`
> 3. Vá em **SQL** e substitua o SELECT
> 4. Em **Campos**, remova os antigos e reconfigure os novos
> 
> Isso preserva o tema, botões e configurações visuais automaticamente.

