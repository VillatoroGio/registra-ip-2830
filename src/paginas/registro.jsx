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
    
    if (!datos.nombre || !datos.correo || !datos.tipo) {
      setError('Todos los campos son obligatorios para continuar.');
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) {
      setError('Por favor, ingresa un formato de correo válido.');
      return;
    }

    setError('');
    localStorage.setItem('registraIpUsuario', JSON.stringify(datos));
    navigate('/dashboard');
  };

  return (
    <div className="tarjeta-formulario">
      <h2>Registro de Creador</h2>
      
      {/* Contenedor de errores accesible y estilizado */}
      <div aria-live="polite">
        {error && <div className="alerta-error">{error}</div>}
      </div>

      <form onSubmit={validarFormulario}>
        <div className="grupo-input">
          <label htmlFor="nombre">Nombre completo</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            className="input-estilizado"
            placeholder="Ej. Santiago Giovani"
            value={datos.nombre} 
            onChange={manejarCambio} 
          />
        </div>

        <div className="grupo-input">
          <label htmlFor="correo">Correo electrónico</label>
          <input 
            type="email" 
            id="correo" 
            name="correo" 
            className="input-estilizado"
            placeholder="correo@ejemplo.com"
            value={datos.correo} 
            onChange={manejarCambio} 
          />
        </div>

        <div className="grupo-input">
          <label htmlFor="tipo">Especialidad</label>
          <select 
            id="tipo" 
            name="tipo" 
            className="input-estilizado"
            value={datos.tipo} 
            onChange={manejarCambio}
          >
            <option value="">Selecciona una disciplina...</option>
            <option value="Diseñador">Diseñador</option>
            <option value="Fotógrafo">Fotógrafo</option>
            <option value="Escritor">Escritor</option>
            <option value="Cineasta">Cineasta</option>
          </select>
        </div>

        <button type="submit" className="boton-primario">
          Crear cuenta
        </button>
      </form>
    </div>
  );
}

export default Registro;