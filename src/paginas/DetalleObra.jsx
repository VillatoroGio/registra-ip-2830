import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarCertificadoPDF } from '../utils/generarCertificado';
import '../App.css';

function DetalleObra() {
  const navigate = useNavigate();
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/obras')
      .then((res) => res.json())
      .then((data) => {
        setObras(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error cargando obras:', err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="tarjeta-formulario" style={{ maxWidth: '780px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Catálogo de Obras Registradas</h2>
          <p className="descripcion-guia">Consulta tus registros y descarga el certificado digital con código QR.</p>
        </div>
        <button className="boton-secundario" onClick={() => navigate('/dashboard')}>
          Volver
        </button>
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center' }}>Consultando obras en el servidor...</p>
      ) : obras.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No hay obras registradas aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {obras.map((obra) => (
            <div 
              key={obra.folio} 
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primario)' }}>
                  {obra.folio}
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '1.2rem' }}>{obra.titulo}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                  Autor: {obra.autor} | Categoría: {obra.categoria}
                </p>
              </div>

              <button
                className="boton-primario"
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
                onClick={() => generarCertificadoPDF(obra)}
              >
                Descargar Certificado
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DetalleObra;