import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PublishWizard from './components/PublishWizard';

function App() {
  const { isAuthenticated, currentProject } = useStore();

  return (
    <>
      <Layout>
        {!isAuthenticated ? (
          <Auth />
        ) : currentProject ? (
          <PublishWizard />
        ) : (
          <Dashboard />
        )}
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
          },
        }}
      />
    </>
  );
}

export default App;