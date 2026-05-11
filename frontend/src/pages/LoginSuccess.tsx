import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Opcional: Buscar dados do usuário para completar o perfil no context
      const fetchUser = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          login(token, data.user);
          navigate('/');
        } catch (error) {
          console.error('Erro ao validar token Google:', error);
          navigate('/login');
        }
      };
      
      fetchUser();
    } else {
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="login-success-loading">
      <div className="spinner"></div>
      <p>Finalizando autenticação...</p>
    </div>
  );
}
