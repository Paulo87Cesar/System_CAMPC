import React from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { CheckCircle } from 'lucide-react';
import { fetchAddressByCep } from '../utils/viaCep';
import { maskCep, maskCpf, maskPhone, maskRg } from '../utils/masks';

import { isValidCpf, InscricaoSchema } from '../utils/validation';





function statusBadge(s: string) {
  const map: Record<string, string> = { Aprovado: 'badge-green', Pendente: 'badge-yellow', Reprovado: 'badge-red', '1': 'badge-blue' };
  return <span className={`badge ${map[s] || 'badge-grey'}`}>{s || 'Pendente'}</span>;
}

interface Inscricao {
  id?: number;
  nome_completo: string;
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
  status_processo: string;
  data_cadastro?: string;
}

const defaultForm: Partial<Inscricao> = {
  nome_completo: '', cpf: '', rg: '', nis: '', sexo: '', naturalidade: '',
  data_nascimento: '', estado_civil: '', cor_raca: '', is_deficiente: 'Não',
  deficiencia_descricao: '', projeto: '', email: '', escola_nome: '',
  escola_escolaridade: '', escola_periodo: '', escola_serie: '',
  end_cep: '', end_logradouro: '', end_numero: '', end_bairro: '', end_cidade: '',
  telefone: '', tel_contato: '', status_processo: 'Pendente'
};

export default function InscricoesPage() {
  const { show } = useToast();

  const aprovar = async (id: number) => {
    if (!window.confirm('Aprovar esta inscrição? O jovem será criado automaticamente.')) return;
    try {
      await api.patch(`/inscricoes/${id}/aprovar`);
      show('Inscrição aprovada! Jovem criado via trigger.');
    } catch {
      show('Erro ao aprovar', 'error');
    }
  };

  return (
    <CrudPage<Inscricao>
      title="Inscrições"
      endpoint="/inscricoes"
      idKey="id"
      searchKeys={['nome_completo', 'cpf', 'email', 'projeto']}
      validationSchema={InscricaoSchema}
      columns={[
        { label: 'Nome', key: 'nome_completo', render: r => <button className="link-btn">{r.nome_completo}</button> },
        { label: 'CPF', key: 'cpf' },
        { label: 'Projeto', key: 'projeto' },
        { label: 'E-mail', key: 'email' },
        { label: 'Cadastro', key: 'data_cadastro', render: r => r.data_cadastro ? new Date(r.data_cadastro).toLocaleDateString('pt-BR') : '-' },
        { label: 'Status', key: 'status_processo', render: r => statusBadge(r.status_processo) },
      ]}
      defaultForm={defaultForm}
      extraActions={row => row.status_processo !== 'Aprovado' ? (
        <button className="btn btn-ghost btn-sm" title="Aprovar" style={{ color: 'var(--green)' }}
          onClick={() => row.id && aprovar(row.id)}>
          <CheckCircle size={13} />
        </button>
      ) : null}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Nome Completo *</label>
            <input type="text" value={data.nome_completo || ''} onChange={e => onChange('nome_completo', e.target.value)} />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input 
              type="text" 
              value={data.cpf || ''} 
              onChange={e => onChange('cpf', maskCpf(e.target.value))} 
              style={{ borderColor: data.cpf && !isValidCpf(data.cpf) ? 'var(--red)' : '' }}
            />
            {data.cpf && !isValidCpf(data.cpf) && <small style={{ color: 'var(--red)' }}>CPF Inválido</small>}
          </div>
          <div className="form-group">
            <label>RG</label>
            <input 
              type="text" 
              value={data.rg || ''} 
              onChange={e => onChange('rg', maskRg(e.target.value))} 
              style={{ borderColor: data.rg && data.rg.length < 8 ? 'var(--red)' : '' }}
            />
            {data.rg && data.rg.length < 8 && <small style={{ color: 'var(--red)' }}>RG inválido ou incompleto</small>}
          </div>
          <div className="form-group">
            <label>Sexo</label>
            <select value={data.sexo || ''} onChange={e => onChange('sexo', e.target.value)}>
              <option value="">Selecione</option><option>Masculino</option><option>Feminino</option>
            </select>
          </div>
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" value={data.data_nascimento || ''} onChange={e => onChange('data_nascimento', e.target.value)} />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={data.email || ''} onChange={e => onChange('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input type="text" value={data.telefone || ''} onChange={e => onChange('telefone', maskPhone(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Projeto</label>
            <input type="text" value={data.projeto || ''} onChange={e => onChange('projeto', e.target.value)} placeholder="Ex: Campinas Aprendiz" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={data.status_processo || 'Pendente'} onChange={e => onChange('status_processo', e.target.value)}>
              <option>Pendente</option><option>Aprovado</option><option>Reprovado</option>
            </select>
          </div>
          <div className="form-group">
            <label>CEP</label>
            <input 
              type="text" 
              value={data.end_cep || ''} 
              onChange={e => onChange('end_cep', maskCep(e.target.value))} 
              onBlur={async (e) => {
                const cep = e.target.value;
                if (cep.length >= 8) {
                  const address = await fetchAddressByCep(cep);
                  if (address) {
                    onChange('end_logradouro', address.logradouro);
                    onChange('end_bairro', address.bairro);
                    onChange('end_cidade', `${address.localidade} - ${address.uf}`);
                  }
                }
              }}
            />
          </div>
          <div className="form-group span-2">
            <label>Endereço</label>
            <input type="text" value={data.end_logradouro || ''} onChange={e => onChange('end_logradouro', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bairro</label>
            <input type="text" value={data.end_bairro || ''} onChange={e => onChange('end_bairro', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Cidade</label>
            <input type="text" value={data.end_cidade || ''} onChange={e => onChange('end_cidade', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Escola</label>
            <input type="text" value={data.escola_nome || ''} onChange={e => onChange('escola_nome', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Série</label>
            <input type="text" value={data.escola_serie || ''} onChange={e => onChange('escola_serie', e.target.value)} />
          </div>
        </div>
      )}
    />
  );
}
