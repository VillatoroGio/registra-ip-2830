import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './componentes/layout';
import Registro from './paginas/registro';
import Dashboard from './paginas/dashboard';
import RutaProtegida from './componentes/RutaProtegida';
import RegistrarObra from './paginas/RegistrarObra';
import DetalleObra from './paginas/DetalleObra';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Registro />} />
          <Route element={<RutaProtegida />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="registrar-obra" element={<RegistrarObra />} />
            <Route path="obras" element={<DetalleObra />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;