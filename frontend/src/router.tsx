import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Stats from './pages/stats';  
import About from './pages/about';
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
        element: <About />,
      },
    ],
  },
]);
