import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import DashboardPage from '../pages/DashboardPage'
import MoodPage from '../pages/MoodPage'
import BreathingPage from '../pages/BreathingPage'
import ReleasePage from '../pages/ReleasePage'
import JournalPage from '../pages/JournalPage'
import RecommendationsPage from '../pages/RecommendationsPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/breathing" element={<BreathingPage />} />
        <Route path="/release" element={<ReleasePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
