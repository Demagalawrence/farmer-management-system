import Dashboard from './components/Dashboard'
import FinancialManagerDashboard from './components/FinancialManagerDashboardNew'

import AuthPage from './components/AuthPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { WallpaperProvider } from './contexts/WallpaperContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  // Lightweight routing: allow direct access to Finance page at /finance
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  if (path === '/finance' && user?.role === 'finance') {
    return <FinancialManagerDashboard />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WallpaperProvider>
          <AppContent />
        </WallpaperProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App