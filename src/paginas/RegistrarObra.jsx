import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function RegistrarObra() {
  const navigate = useNavigate();

  // Paso actual (1: Archivo, 2: Metadatos, 3: Previa, 4: Confirmación)
  const [paso, setPaso] = useState(1);

  // Estado único que conserva los datos capturados entre los 4 pasos
  const [formulario, setFormulario] = useState({
    archivo: null,
    nombreArchivo: '',
    titulo: '',
    categoria: '',
    descripcion: ''
  });

  const [folioGenerado, setFolioGenerado] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');
  const [cargando, setCargando] = useState(false);

  // Manejador de campos de texto
  const manejarCambioTexto = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    setErrorValidacion('');
  };

  // Manejador de archivo
  const manejarArchivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormulario({
        ...formulario,
        archivo: file,
        nombreArchivo: file.name
      });
      setErrorValidacion('');
    }
  };

  // Validación estricta por paso
  const esPasoValido = () => {
    if (paso === 1) {
      return Boolean(formulario.archivo);
    }
    if (paso === 2) {
      const tituloValido = formulario.titulo.trim().length >= 5;
      const categoriaValida = Boolean(formulario.categoria);
      return tituloValido && categoriaValida;
    }
    return true;
  };

  const avanzarPaso = () => {
    if (!esPasoValido()) {
      if (paso === 1) setErrorValidacion('Debes seleccionar un archivo para continuar.');
      if (paso === 2) setErrorValidacion('El título requiere mínimo 5 caracteres y debes seleccionar una categoría.');
      return;
    }
    setErrorValidacion('');
    setPaso((prev) => prev + 1);
  };

  const retrocederPaso = () => {
    setErrorValidacion('');
    setPaso((prev) => prev - 1);
  };

  // Envío final con FormData y generación de folio personalizado
  const registrarObraFinal = async () => {
    setCargando(true);
    setErrorValidacion('');

    try {
      const usuarioSesion = JSON.parse(localStorage.getItem('registraIpUsuario')) || { nombre: 'Autor Anónimo' };
      
      // Formato obligatorio: OBRA-<últimos 4 dígitos boleta>-###
      const numeroAleatorio = String(Math.floor(Math.random() * 900) + 100);
      const folio = `OBRA-2830-${numeroAleatorio}`;

      const formData = new FormData();
      formData.append('archivo', formulario.archivo);
      formData.append('folio', folio);
      formData.append('titulo', formulario.titulo);
      formData.append('categoria', formulario.categoria);
      formData.append('descripcion', formulario.descripcion);
      formData.append('autor', usuarioSesion.nombre);

      const respuesta = await fetch('http://localhost:4000/obras', {
        method: 'POST',
        body: formData
      });

      if (!respuesta.ok) {
        throw new Error('Error en el servidor al guardar la obra.');
      }

      setFolioGenerado(folio);
      setPaso(4); // Paso de confirmación
    } catch (err) {
      setErrorValidacion(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="wizard-contenedor">
      {/* Barra de progreso visual (Stepper) */}
      <div className="barra-progreso" aria-label="Progreso del registro">
        <div className={`paso-item ${paso >= 1 ? 'activo' : ''}`}>
          <div className="paso-circulo">1</div>
          <span>Archivo</span>
        </div>
        <div className="linea-progreso" />
        <div className={`paso-item ${paso >= 2 ? 'activo' : ''}`}>
          <div className="paso-circulo">2</div>
          <span>Metadatos</span>
        </div>
        <div className="linea-progreso" />
        <div className={`paso-item ${paso >= 3 ? 'activo' : ''}`}>
          <div className="paso-circulo">3</div>
          <span>Revisión</span>
        </div>
        <div className="linea-progreso" />
        <div className={`paso-item ${paso >= 4 ? 'activo' : ''}`}>
          <div className="paso-circulo">4</div>
          <span>Folio</span>
        </div>
      </div>

      {/* Alerta de validación accesible */}
      <div aria-live="polite">
        {errorValidacion && <div className="alerta-error">{errorValidacion}</div>}
      </div>

      {/* Contenido dinámico del Paso */}
      <div className="cuerpo-paso">
        {paso === 1 && (
          <div>
            <h3>Paso 1: Selecciona el archivo de la obra</h3>
            <p className="descripcion-guia">Formatos admitidos: imágenes, documentos, audio o video digital.</p>
            <div className="grupo-input">
              <input
                type="file"
                id="archivoObra"
                className="input-estilizado"
                onChange={manejarArchivo}
              />
            </div>
            {formulario.nombreArchivo && (
              <p className="archivo-seleccionado">Archivo cargado: <strong>{formulario.nombreArchivo}</strong></p>
            )}
          </div>
        )}

        {paso === 2 && (
          <div>
            <h3>Paso 2: Metadatos de la obra</h3>
            <div className="grupo-input">
              <label htmlFor="titulo">Título de la obra (mínimo 5 letras):</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                className="input-estilizado"
                value={formulario.titulo}
                onChange={manejarCambioTexto}
                placeholder="Ej. Composición Gráfica Nocturna"
              />
            </div>

            <div className="grupo-input">
              <label htmlFor="categoria">Categoría artística:</label>
              <select
                id="categoria"
                name="categoria"
                className="input-estilizado"
                value={formulario.categoria}
                onChange={manejarCambioTexto}
              >
                <option value="">Selecciona categoría...</option>
                <option value="Diseño Digital">Diseño Digital</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Literatura">Literatura</option>
                <option value="Audiovisual">Audiovisual</option>
              </select>
            </div>

            <div className="grupo-input">
              <label htmlFor="descripcion">Descripción (opcional):</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="3"
                className="input-estilizado"
                value={formulario.descripcion}
                onChange={manejarCambioTexto}
                placeholder="Breve reseña conceptual de la obra..."
              />
            </div>
          </div>
        )}

        {paso === 3 && (
          <div>
            <h3>Paso 3: Vista previa y verificación</h3>
            <p className="descripcion-guia">Confirma que los datos sean correctos antes de solicitar el registro.</p>
            <div className="tarjeta-resumen">
              <p><strong>Archivo:</strong> {formulario.nombreArchivo}</p>
              <p><strong>Título:</strong> {formulario.titulo}</p>
              <p><strong>Categoría:</strong> {formulario.categoria}</p>
              <p><strong>Descripción:</strong> {formulario.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="confirmacion-final">
            <h3 style={{ color: '#15803d' }}>¡Registro Exitoso!</h3>
            <p>La obra ha sido respaldada en el servidor y catalogada con el identificador oficial:</p>
            <div className="placa-folio">{folioGenerado}</div>
            <button
              className="boton-primario"
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: '20px' }}
            >
              Volver al Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Controles de navegación */}
      {paso < 4 && (
        <div className="botones-navegacion">
          {paso > 1 && (
            <button className="boton-secundario" onClick={retrocederPaso} disabled={cargando}>
              Atrás
            </button>
          )}

          {paso < 3 && (
            <button
              className="boton-primario"
              onClick={avanzarPaso}
              disabled={!esPasoValido()}
              style={{ opacity: esPasoValido() ? 1 : 0.5, cursor: esPasoValido() ? 'pointer' : 'not-allowed' }}
            >
              Siguiente
            </button>
          )}

          {paso === 3 && (
            <button className="boton-primario" onClick={registrarObraFinal} disabled={cargando}>
              {cargando ? 'Registrando en servidor...' : 'Confirmar y Guardar'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default RegistrarObra;