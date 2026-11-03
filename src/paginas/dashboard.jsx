import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();
  const usuarioGuardado = JSON.parse(localStorage.getItem('registraIpUsuario'));

  const cerrarSesion = () => {
    localStorage.removeItem('registraIpUsuario');
    navigate('/');
  };

  return (
    <div className="tarjeta-formulario" style={{ maxWidth: '480px', textAlign: 'center' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ 
          fontSize: '0.8rem', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          fontWeight: '700', 
          color: 'var(--color-primario)' 
        }}>
          Panel de Creador
        </span>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          ¡Bienvenido, {usuarioGuardado?.nombre || 'Creador'}!
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>
          Especialidad: <strong>{usuarioGuardado?.tipo || 'General'}</strong>
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        marginTop: '2rem' 
      }}>
        <button 
          onClick={() => navigate('/registrar-obra')} 
          className="boton-primario"
          style={{ margin: 0 }}
        >
          + Registrar Nueva Obra
        </button>

        <button 
          onClick={() => navigate('/obras')} 
          className="boton-secundario"
          style={{ margin: 0 }}
        >
          Ver Obras y Certificados
        </button>

        <button 
          onClick={cerrarSesion} 
          className="boton-secundario"
          style={{ 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            border: '1px solid #fecaca',
            transition: 'all 0.2s ease'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;