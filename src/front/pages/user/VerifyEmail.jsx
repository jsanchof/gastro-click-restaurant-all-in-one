import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

export const VerifyEmail = () => {

    const navigate = useNavigate();   

    useEffect(() => {
        const timer = setTimeout(() => {
          navigate('/login');
        }, 5000); // Redirect after 5 seconds
    
        return () => clearTimeout(timer);
      }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
        </div>
        <h2 className="mb-3">Su cuenta ha sido verificada!</h2>
        <p className="mb-0">Va a ser redirigido a la pagina para Iniciar sesión</p>
        <div className="progress mt-4" style={{ height: '5px' }}>
          <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};