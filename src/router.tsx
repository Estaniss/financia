import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from './layout/RootLayout';
import { SimulatorForm } from './pages';
import HistoryPage from './pages/History/HistoryPage';
import SimulatorResults from './pages/SimulatorResults/SimulatorResults';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    //errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <SimulatorForm />,
      },
      { path: 'resultado/:id', element: <SimulatorResults /> },
      { path: 'historico', element: <HistoryPage /> },
    ],
  },
]);
