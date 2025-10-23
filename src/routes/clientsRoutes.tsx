import React from 'react';
import { RouteObject } from 'react-router-dom';
import ClientListPage from '../pages/clients';

export const clientsRoutes: RouteObject[] = [
  {
    path: '/clients',
    element: <ClientListPage />,
  },
];

export default clientsRoutes;
