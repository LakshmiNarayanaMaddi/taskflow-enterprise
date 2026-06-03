import { BrowserRouter, Routes, Route, Navigate }
  from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider }
  from '@tanstack/react-query';
import { store } from './store';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import KanbanPage from './pages/projects/KanbanPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard"
                     element={<DashboardPage />} />
              <Route path="/projects"
                     element={<ProjectsPage />} />
              <Route path="/projects/:projectId"
                     element={<KanbanPage />} />
            </Route>

            {/* Default */}
            <Route path="/"
                   element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;