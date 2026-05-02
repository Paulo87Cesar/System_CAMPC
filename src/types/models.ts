export interface Jovem {
  id_jovem?: number;
  id_inscricao?: number;
  matricula?: string;
  inativo?: string;
  data_cadastro?: string;
  nome_completo?: string;
  nome_social?: string;
  cpf?: string;
  rg?: string;
  genero?: string;
  nascimento?: string;
  naturalidade?: string;
  nacionalidade?: string;
  estado_civil?: string;
  cor_raca?: string;
  pcd?: string;
  deficiencia_descricao?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  escolaridade?: string;
  escola?: string;
  periodo?: string;
  serie?: string;
  ra?: string;
  cras?: string;
  ja_trabalhou?: string;
  ctps_assinada?: string;
  renda_familiar?: number;
  nota_final?: number;
  aprovacao_status?: string;
  observacoes_sociais?: string;
}

export interface Inscricao {
  id?: number;
  nome_completo?: string;
  cpf?: string;
  rg?: string;
  nis?: string;
  sexo?: string;
  naturalidade?: string;
  data_nascimento?: string;
  estado_civil?: string;
  cor_raca?: string;
  is_deficiente?: string;
  deficiencia_descricao?: string;
  projeto?: string;
  email?: string;
  escola_nome?: string;
  escola_escolaridade?: string;
  escola_periodo?: string;
  escola_serie?: string;
  end_cep?: string;
  end_logradouro?: string;
  end_numero?: string;
  end_bairro?: string;
  end_cidade?: string;
  telefone?: string;
  tel_contato?: string;
  status_processo?: string;
  data_cadastro?: string;
}

export interface Educador {
  id_educador?: number;
  nome: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  especialidade?: string;
  ativo?: string;
  criado_em?: string;
}

export interface Projeto {
  id_projeto?: number;
  nome_projeto: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  ativo?: string;
  criado_em?: string;
}

export interface Programa {
  id_programa?: number;
  id_projeto: number;
  nome_programa: string;
  descricao?: string;
  ano?: number;
  ativo?: string;
  criado_em?: string;
  nome_projeto?: string;
}

export interface Curso {
  id_curso?: number;
  id_programa: number;
  nome_curso: string;
  descricao?: string;
  conteudo?: string;
  carga_horaria_horas?: number;
  carga_horaria_minutos?: number;
  ativo?: string;
  criado_em?: string;
  nome_programa?: string;
}

export interface Disciplina {
  id_disciplina?: number;
  id_curso: number;
  nome_disciplina: string;
  descricao?: string;
  carga_horaria_horas?: number;
  carga_horaria_minutos?: number;
  ordem?: number;
  ativo?: string;
  nome_curso?: string;
}

export interface Turma {
  id_turma?: number;
  id_curso: number;
  id_educador?: number;
  codigo_turma: string;
  periodo?: string;
  data_inicio?: string;
  data_fim?: string;
  vagas?: number;
  local?: string;
  ativo?: string;
  criado_em?: string;
  nome_curso?: string;
  nome_educador?: string;
}

export interface MatriculaTurma {
  id_matricula?: number;
  id_jovem: number;
  id_turma: number;
  data_matricula: string;
  status_matricula?: string;
  observacoes?: string;
  criado_em?: string;
  nome_jovem?: string;
  codigo_turma?: string;
}

export interface BoletimNota {
  id_nota?: number;
  id_matricula: number;
  id_disciplina: number;
  periodo_avaliacao?: string;
  nota?: number;
  faltas?: number;
  presencas?: number;
  observacoes?: string;
  nome_disciplina?: string;
}
