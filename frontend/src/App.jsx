import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import PullRequestDetail from './pages/PullRequestDetail'
import RepositoryDetail from './pages/RepositoryDetail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repositories/:repositoryId" element={<RepositoryDetail />} />
            <Route path="/repositories/:repositoryId/pull_requests/:pullRequestId" element={<PullRequestDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
