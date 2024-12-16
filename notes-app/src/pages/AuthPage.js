import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice'; // Импортируем правильные действия
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../api'; // Хук для авторизации
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Проверка, авторизован ли пользователь
  const [loginUser, { error: loginError, isLoading }] = useLoginUserMutation(); // Хук RTK Query для логина

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Вывод данных формы в консоль для проверки
    console.log("Submitting login with:");
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      // Отправляем запрос на сервер для авторизации
      const data = await loginUser({ username, password }).unwrap(); // unwrap для получения данных
      console.log("Login successful:", data); // Выводим данные успешного ответа
      dispatch(login(data)); // Сохраняем токен в Redux
      localStorage.setItem('token', data.access_token); // Сохраняем токен в localStorage
    } catch (err) {
      // Обработка ошибки
      console.error("Login failed:", err); // Выводим ошибку, если запрос не удался
      dispatch(clearError()); // Очистка ошибки в Redux
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Перенаправление на главную страницу после авторизации
    }
  }, [isAuthenticated, navigate]);

  // Функция для отображения ошибки как строки
  const renderErrorMessage = (error) => {
    if (error && error.data) {
      const errorMessages = Object.keys(error.data).map(key => {
        const message = error.data[key];
        if (typeof message === 'object' && message !== null) {
          return `${key}: ${JSON.stringify(message)}`;
        }
        return `${key}: ${message}`;
      });
      return <div>{errorMessages.join(', ')}</div>;
    }
    return <div>Something went wrong. Please try again.</div>;
  };

  return (
    <div className="auth-container">
      <h2>Вход в аккаунт</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label>Логин:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {loginError && (
          <div className="error" onClick={handleClearError}>
            {/* Показываем ошибку, если она есть */}
            {renderErrorMessage(loginError)}
          </div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
