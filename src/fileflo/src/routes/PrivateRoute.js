// Built-in imports
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// External imports
import { getToken } from '../service/AuthService';

// PrivateRoute component
const PrivateRoute = () => {
  return (
      getToken() ? <Outlet/>
        : <Navigate to="/login" />
  )
}

export default PrivateRoute