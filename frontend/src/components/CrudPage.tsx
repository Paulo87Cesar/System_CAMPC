import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { z } from 'zod';


interface Column<T> {
  label: string;
  key: keyof T | string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface CrudPageProps<T extends Record<string, any>> {
  title: string;
  endpoint: string;
  idKey: string;
  columns: Column<T>[];
  defaultForm: Partial<T>;
  renderForm: (data: Partial<T>, onChange: (field: string, val: any) => void) => React.ReactNode;
  searchKeys?: (keyof T)[];
  extraActions?: (row: T, reload: () => void) => React.ReactNode;
  validationSchema?: z.ZodSchema<any>;
}

export default function CrudPage<T extends Record<string, any>>({
  title, endpoint, idKey, columns, defaultForm, renderForm, searchKeys = [], extraActions, validationSchema
}: CrudPageProps<T>) {
  const { show } = useToast();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; editing: boolean; data: Partial<T> }>({
    open: false, editing: false, data: defaultForm
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<T[]>(endpoint);
      setRows(data);
    } catch {
      show('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [endpoint]);

  const filtered = rows.filter(row =>
    searchKeys.length === 0 || searchKeys.some(k => {
      const v = row[k as string];
      return v && String(v).toLowerCase().includes(search.toLowerCase());
    })
  );

  const openCreate = () => setModal({ open: true, editing: false, data: { ...defaultForm } });
  const openEdit = (row: T) => setModal({ open: true, editing: true, data: { ...row } });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const handleChange = (field: string, val: any) =>
    setModal(m => ({ ...m, data: { ...m.data, [field]: val } }));
const handleSave = async () => {
    try {
      // Validação Zod Corrigida
      if (validationSchema) {
        const result = validationSchema.safeParse(modal.data);
        if (!result.success) {
          // O Zod usa 'issues' para listar os erros
          const errorMsg = result.error.issues[0].message;
          show(errorMsg, 'error');
          return;
        }
      }

      if (modal.editing) {
        await api.put(`${endpoint}/${modal.data[idKey]}`, modal.data);
        show('Registro atualizado!');
      } else {
        await api.post(endpoint, modal.data);
        show('Registro criado!');
      }
      closeModal();
      load();
    } catch (e: any) {
      show(e.response?.data?.message || 'Erro ao salvar', 'error');
    }
  };

  const handleDelete = async (row: T) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      await api.delete(`${endpoint}/${row[idKey]}`);
      show('Registro excluído!');
      load();
    } catch {
      show('Erro ao excluir', 'error');
    }
  };

  return (
    <div className="page-content">
      <div className="card">
        <div className="card-header">
          <span className="card-title">{title} ({filtered.length})</span>
          <div className="toolbar">
            <div className="search-input-wrap">
              <Search size={14} />
              <input
                className="search-input"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={14} /> Novo
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={40} />
            <p>Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {columns.map(c => <th key={String(c.key)} style={{ width: c.width }}>{c.label}</th>)}
                  <th style={{ width: 90 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i}>
                    {columns.map(c => (
                      <td key={String(c.key)}>
                        {c.render ? c.render(row) : String(row[c.key as string] ?? '-')}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {extraActions?.(row, load)}
                        <button className="btn btn-ghost btn-sm" title="Editar" onClick={() => openEdit(row)}>
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Excluir"
                          style={{ color: 'var(--red)' }} onClick={() => handleDelete(row)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{modal.editing ? 'Editar' : 'Novo'} {title}</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {renderForm(modal.data, handleChange)}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {modal.editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
