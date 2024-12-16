import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import NotesPage from '../pages/NotesPage';
import NotFoundPage from '../pages/NotFoundPage';
import AuthPage from '../pages/AuthPage';
import TrashPage from '../pages/TrashPage'; // Импорт TrashPage
import { useSelector } from 'react-redux';

const AppRouter = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated); // Проверка авторизации

  return (
    <Routes>
      {/* Публичный маршрут */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Защищенные маршруты */}
      <Route
        path="/"
        element={isAuth ? <HomePage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/notes"
        element={isAuth ? <NotesPage /> : <Navigate to="/auth" replace />}
      />
      
      {/* Маршрут для корзины */}
      <Route
        path="/trash"
        element={isAuth ? <TrashPage /> : <Navigate to="/auth" replace />}
      />

      {/* Страница 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
