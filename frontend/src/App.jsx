import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { HomePage } from './pages/HomePage';
import { CTZonePage } from './pages/CTZonePage';
import { UploadPage } from './pages/UploadPage';
import { NotesPage } from './pages/NotesPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { GenericLibraryPage } from './pages/GenericLibraryPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Protected Main Application Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="ct-zone" element={<CTZonePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route
          path="pyqs"
          element={
            <GenericLibraryPage
              type="pyqs"
              title="Previous Year Questions (PYQs)"
              subtitle="Past test papers and semester exam archives with answer keys."
              icon="history_edu"
            />
          }
        />
        <Route
          path="videos"
          element={
            <GenericLibraryPage
              type="videos"
              title="Video Lectures"
              subtitle="Curated playlists, recorded hostel sessions, and NPTEL lecture series."
              icon="videocam"
            />
          }
        />
        <Route
          path="images"
          element={
            <GenericLibraryPage
              type="images"
              title="Diagrams & Whiteboards"
              subtitle="Whiteboard photos, mind maps, and circuit diagrams."
              icon="image"
            />
          }
        />
        <Route
          path="discussions"
          element={
            <GenericLibraryPage
              type="discussions"
              title="Hostel Discussions"
              subtitle="Ask questions, share test tips, and organize study groups."
              icon="forum"
            />
          }
        />
        <Route
          path="announcements"
          element={
            <GenericLibraryPage
              type="announcements"
              title="Announcements"
              subtitle="Official hostel notices and class test schedules."
              icon="campaign"
            />
          }
        />
        <Route path="saved" element={<SavedPage />} />
        <Route
          path="my-uploads"
          element={
            <GenericLibraryPage
              type="my-uploads"
              title="My Uploads"
              subtitle="Materials you've shared with the hostel community."
              icon="cloud_upload"
            />
          }
        />
        <Route
          path="settings"
          element={
            <GenericLibraryPage
              type="settings"
              title="Settings"
              subtitle="Configure notification alerts and study preferences."
              icon="settings"
            />
          }
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
