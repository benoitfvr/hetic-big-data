import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Stats from './pages/stats';
import { Layout } from './components/layout/layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/stats',
        element: <Stats />,
      },
      {
        path: '/about',
        element: <div>À propos</div>,
      },
    ],
  },
]);
