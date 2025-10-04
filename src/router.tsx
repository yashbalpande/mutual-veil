import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import Claims from '@/pages/dashboard/Claims';
import RiskPool from '@/pages/dashboard/RiskPool';
import Governance from '@/pages/dashboard/Governance';
import DashboardLayout from '@/layouts/DashboardLayout';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout><RiskPool /></DashboardLayout>,
  },
  {
    path: '/dashboard/risk-pool',
    element: <DashboardLayout><RiskPool /></DashboardLayout>,
  },
  {
    path: '/dashboard/claims',
    element: <DashboardLayout><Claims /></DashboardLayout>,
  },
  {
    path: '/dashboard/governance',
    element: <DashboardLayout><Governance /></DashboardLayout>,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;