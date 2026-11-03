import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarCertificadoPDF } from '../utils/generarCertificado';
import '../App.css';

/**
 * PRÁCTICA 5: Galería de Obras con Filtros y Búsqueda
 * Normas ISO 9241 aplicadas:
 * 1. ISO 9241-110 (Autodescriptividad y Retroalimentación): 
 *    - Loader interactivo durante la consulta al servidor.
 *    - Contador dinámico de resultados visibles.
 *    - Estado vacío descriptivo en búsquedas sin coincidencia.
 * 2. ISO 9241-171 / WCAG 2.1 (Accesibilidad Táctil):
 *    - Área de interacción mínima de 44x44px en botones, inputs y selectores.
 */

function Galeria() {
  const navigate = useNavigate();
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [ordenFecha, setOrdenFecha] = useState('recientes');
  const [obraModal, setObraModal] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/obras')
      .then((res) => res.json())
      .then((data) => {
        setObras(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const obrasFiltradas = useMemo(() => {
    return obras
      .filter((obra) => {
        const texto = busqueda.toLowerCase().trim();
        const coincideTitulo = obra.titulo?.toLowerCase().includes(texto);
        const coincideAutor = obra.autor?.toLowerCase().includes(texto);
        const coincideFolio = obra.folio?.toLowerCase().includes(texto);
        const coincideTexto = coincideTitulo || coincideAutor || coincideFolio;

        const coincideCategoria =
          categoriaSeleccionada === 'Todas' ||
          obra.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase();

        return coincideTexto && coincideCategoria;
      })
      .sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro || a.fecha || 0).getTime();
        const fechaB = new Date(b.fechaRegistro || b.fecha || 0).getTime();
        return ordenFecha === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
      });
  }, [obras, busqueda, categoriaSeleccionada, ordenFecha]);

  const categorias = ['Todas', 'Diseño', 'Fotografía', 'Escritura', 'Cine'];

  const obtenerIcono = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case 'diseño':
      case 'diseño digital':
        return '🎨';
      case 'fotografía':
        return '📷';
      case 'escritura':
      case 'literatura':
        return '✍️';
      case 'cine':
        return '🎬';
      default:
        return '📄';
    }
  };

  return (
    <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1f2937', margin: 0 }}>Galería de Obras Registradas</h1>
          <p style={{ color: '#4b5563', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Exploración, filtrado y validación de certificaciones digitales REGISTRA-IP
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="boton-secundario"
          style={{ minHeight: '44px', minWidth: '100px' }}
        >
          Volver al Panel
        </button>
      </div>

      <div style={{
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: '260px' }}>
            <label htmlFor="input-busqueda" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
              Buscar por Título, Autor o Folio
            </label>
            <input
              id="input-busqueda"
              type="text"
              placeholder="Ej. Arquitectura, Villatoro, OBRA-2830..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="select-orden" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
              Ordenar por fecha
            </label>
            <select
              id="select-orden"
              value={ordenFecha}
              onChange={(e) => setOrdenFecha(e.target.value)}
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguas">Más antiguas primero</option>
            </select>
          </div>
        </div>

        <div>
          <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
            Filtrar por categoría:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categorias.map((cat) => {
              const activa = categoriaSeleccionada.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  style={{
                    minHeight: '44px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: activa ? '2px solid #302830' : '1px solid #d1d5db',
                    backgroundColor: activa ? '#302830' : '#f9fafb',
                    color: activa ? '#ffffff' : '#374151',
                    fontWeight: activa ? 'bold' : 'normal',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
          Mostrando <strong>{obrasFiltradas.length}</strong> de <strong>{obras.length}</strong> obras registradas
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #302830',
            borderRadius: '50%',
            animation: 'girar 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <style>{`@keyframes girar { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#4b5563', margin: 0, fontWeight: 500 }}>Consultando obras en el servidor seguro...</p>
        </div>
      ) : obrasFiltradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
          <p style={{ fontSize: '1.2rem', color: '#374151', fontWeight: 'bold' }}>No se encontraron obras coincidentes</p>
          <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0.5rem auto 1rem auto' }}>
            Intenta modificando los términos de búsqueda o selecciona otra categoría.
          </p>
          <button
            onClick={() => { setBusqueda(''); setCategoriaSeleccionada('Todas'); }}
            className="boton-secundario"
            style={{ minHeight: '44px' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {obrasFiltradas.map((obra) => (
            <div
              key={obra.folio}
              onClick={() => setObraModal(obra)}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '1.25rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{obtenerIcono(obra.categoria)}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151'
                  }}>
                    {obra.categoria || 'General'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#111827', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                  {obra.titulo}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0 0 0.5rem 0' }}>
                  <strong>Autor:</strong> {obra.autor || 'Anónimo'}
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {obra.descripcion || 'Sin descripción adicional disponible.'}
                </p>
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#4b5563' }}>
                  {obra.folio}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#302830', fontWeight: 'bold' }}>
                  Ver detalle →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {obraModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>
                  Detalle del Registro
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', color: '#111827' }}>{obraModal.titulo}</h2>
              </div>
              <button
                onClick={() => setObraModal(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  minWidth: '44px',
                  minHeight: '44px',
                  lineHeight: '44px'
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#374151', marginBottom: '1.5rem' }}>
              <div><strong>Folio Oficial:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{obraModal.folio}</span></div>
              <div><strong>Autoría:</strong> {obraModal.autor}</div>
              <div><strong>Categoría:</strong> {obraModal.categoria}</div>
              <div><strong>Archivo asociado:</strong> {obraModal.archivoNombre || obraModal.archivo || 'Documento adjunto'}</div>
              <div><strong>Fecha de alta:</strong> {obraModal.fechaRegistro || obraModal.fecha || 'Reciente'}</div>
              <div>
                <strong>Descripción:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#4b5563', lineHeight: 1.4 }}>{obraModal.descripcion || 'Sin descripción proporcionada.'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                className="boton-secundario"
                onClick={() => setObraModal(null)}
                style={{ minHeight: '44px' }}
              >
                Cerrar
              </button>
              <button
                className="boton-primario"
                onClick={() => generarCertificadoPDF(obraModal)}
                style={{ minHeight: '44px' }}
              >
                Descargar Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Galeria;