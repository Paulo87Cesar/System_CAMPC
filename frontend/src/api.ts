import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor para adicionar o token em cada requisição
api.interceptors.request.use(config => {
  const token = localStorage.getItem('@ERP:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função para baixar PDFs com token correto
export const downloadPDF = async (url: string, filename?: string) => {
  const token = localStorage.getItem('@ERP:token');
  if (!token) {
    throw new Error('Token não fornecido');
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao baixar PDF');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    throw error;
  }
};

export default api;
