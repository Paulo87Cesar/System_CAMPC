import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      try {
        // Decodifica o payload do JWT (base64) sem precisar chamar a API
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          username: payload.username || payload.email || 'Usuário',
          role: payload.role || 'educador'
        };
        login(token, user);
        // Usa setTimeout para garantir que o state foi atualizado antes de navegar
        setTimeout(() => navigate('/'), 100);
      } catch (error) {
        console.error('Erro ao processar token Google:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []); // Executa apenas uma vez ao montar

  return (
    <div className="login-success-loading">
      <div className="spinner"></div>
      <p>Finalizando autenticação...</p>
    </div>
  );
}
