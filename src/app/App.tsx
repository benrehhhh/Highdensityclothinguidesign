import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect } from 'react';
import { initStore } from './lib/data-store';
import { ErrorBoundary } from './components/error-boundary';

export default function App() {
  useEffect(() => {
    initStore().catch(() => undefined);
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
