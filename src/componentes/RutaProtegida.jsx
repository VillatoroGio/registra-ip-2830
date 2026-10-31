import { Navigate, Outlet } from 'react-router-dom';

function RutaProtegida() {
  const usuario = localStorage.getItem('registraIpUsuario');

  // Si no hay datos guardados, redirige al formulario de inicio
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // Si hay sesión activa, muestra la pantalla solicitada
  return <Outlet />;
}

export default RutaProtegida;