import {Navigate, Outlet} from 'react-router-dom';

function PrivateRoutes() {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;