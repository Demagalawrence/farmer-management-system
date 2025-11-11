import Dashboard from './components/Dashboard'
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

  return user ? <Dashboard /> : <AuthPage />;
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