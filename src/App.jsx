import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './componentes/layout';
import Registro from './paginas/registro';
import Dashboard from './paginas/dashboard';
import RutaProtegida from './componentes/RutaProtegida';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Ruta pública con el formulario */}
          <Route index element={<Registro />} />
          
          {/* Ruta protegida para el dashboard */}
          <Route element={<RutaProtegida />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;