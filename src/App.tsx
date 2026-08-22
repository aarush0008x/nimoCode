import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DbProvider } from './context/DbContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { LandingPage } from './pages/LandingPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { ContestsPage } from './pages/ContestsPage';
import { ContestDetailPage } from './pages/ContestDetailPage';
import { CreateContestPage } from './pages/CreateContestPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CommunityPage } from './pages/CommunityPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DuelPage } from './pages/DuelPage';
import { DuelRoomPage } from './pages/DuelRoomPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { SystemDesignPage } from './pages/SystemDesignPage';
import { PairRoomPage } from './pages/PairRoomPage';
import { ContactPage } from './pages/ContactPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';




export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DbProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 transition-colors duration-200">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/problems" element={<ProblemsPage />} />
                  <Route path="/problems/:id" element={<ProblemDetailPage />} />
                  <Route path="/contests" element={<ContestsPage />} />
                  <Route path="/contests/create" element={<CreateContestPage />} />
                  <Route path="/contests/:id" element={<ContestDetailPage />} />
                  <Route path="/duels" element={<DuelPage />} />
                  <Route path="/duels/:matchId" element={<DuelRoomPage />} />
                  <Route path="/interview" element={<MockInterviewPage />} />
                  <Route path="/assessments" element={<AssessmentsPage />} />
                  <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
                  <Route path="/system-design" element={<SystemDesignPage />} />

                  <Route path="/pair" element={<PairRoomPage />} />
                  <Route path="/pair/:roomId" element={<PairRoomPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </DbProvider>
    </ThemeProvider>
  );
};

export default App;
