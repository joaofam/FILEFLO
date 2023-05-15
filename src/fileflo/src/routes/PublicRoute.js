// External imports
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Internal imports
import { getToken } from '../service/AuthService';

const PublicRoute = () => {
  return (
      !getToken() ? <Outlet />
        : <Navigate to={{ pathname: '/profile'}} />)
      }


export default PublicRoute