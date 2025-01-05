import { BrowserRouter, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/helpers/NavBar';
import AnimatedRoutes from './components/routes/AnimatedRoutes';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      {location.pathname !== '/dashboard' && <NavBar />}
      <AnimatedRoutes />
    </div>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Root;
