import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  // Obtener los datos del creador guardados al registrarse
  const usuarioGuardado = JSON.parse(localStorage.getItem('registraIpUsuario'));

  const cerrarSesion = () => {
    localStorage.removeItem('registraIpUsuario');
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>¡Bienvenido, {usuarioGuardado?.nombre}!</h2>
      <p>Has iniciado sesión exitosamente como {usuarioGuardado?.tipo}.</p>
      
      <button 
        onClick={cerrarSesion} 
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;