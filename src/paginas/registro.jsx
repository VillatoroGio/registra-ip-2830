import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Registro() {
  const [datos, setDatos] = useState({ nombre: '', correo: '', tipo: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const validarFormulario = (e) => {
    e.preventDefault();
    
    // Validación de campos vacíos
    if (!datos.nombre || !datos.correo || !datos.tipo) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Validación de formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Si todo es válido, limpiar errores, guardar en localStorage y redirigir
    setError('');
    localStorage.setItem('registraIpUsuario', JSON.stringify(datos));
    navigate('/dashboard');
  };

  return (
    <div className="formulario-contenedor">
      <h2>Registro de Creador</h2>
      
      {/* Contenedor de errores accesible con aria-live */}
      <div aria-live="polite" className="mensaje-error">
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      </div>

      <form onSubmit={validarFormulario}>
        <div className="campo">
          <label htmlFor="nombre">Nombre completo:</label>
          <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={manejarCambio} />
        </div>

        <div className="campo">
          <label htmlFor="correo">Correo electrónico:</label>
          <input type="email" id="correo" name="correo" value={datos.correo} onChange={manejarCambio} />
        </div>

        <div className="campo">
          <label htmlFor="tipo">Tipo de creador:</label>
          <select id="tipo" name="tipo" value={datos.tipo} onChange={manejarCambio}>
            <option value="">Selecciona una opción</option>
            <option value="Diseñador">Diseñador</option>
            <option value="Fotógrafo">Fotógrafo</option>
            <option value="Escritor">Escritor</option>
            <option value="Cineasta">Cineasta</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: '15px', padding: '10px', backgroundColor: 'var(--color-primario)', color: 'white', border: 'none', cursor: 'pointer' }}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Registro;