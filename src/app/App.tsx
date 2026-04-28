import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { initStore } from './lib/data-store';

export default function App() {
  useEffect(() => {
    initStore().catch(() => undefined);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
