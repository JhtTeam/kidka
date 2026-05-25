import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Practice } from './pages/Practice';
import { Games } from './pages/Games';
import { ProgressPage } from './pages/Progress';
import { Story } from './pages/Story';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'learn', element: <Learn /> },
      { path: 'learn/:letter', element: <Learn /> },
      { path: 'practice', element: <Practice /> },
      { path: 'practice/:letter', element: <Practice /> },
      { path: 'games', element: <Games /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'story', element: <Story /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
