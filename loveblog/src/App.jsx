import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './router/router.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
function RoutesRender() {
  return useRoutes(routes);
}
function App() {
  return (
    <BrowserRouter>
      <RoutesRender />
    </BrowserRouter>
  );
}

export default App;