import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../api'; // Подключаем API, чтобы использовать хук для авторизации

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  username: '',
  token: localStorage.getItem('access_token') || '', // Загружаем токен из localStorage (если он есть)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) { // Добавляем редуктор для логина
      state.isAuthenticated = true;
      state.user = action.payload.username; // Сохраняем имя пользователя из данных
      state.token = action.payload.token; // Сохраняем токен
      state.error = null;
      localStorage.setItem('access_token', action.payload.token); // Сохраняем токен в localStorage
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.username = '';
      state.token = ''; // Очищаем токен при выходе
      localStorage.removeItem('access_token'); // Удаляем токен из localStorage
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.loginUser.matchFulfilled, (state, action) => {
        const { username, access_token } = action.payload; // Получаем имя пользователя и токен из ответа API
        state.isAuthenticated = true;
        state.user = username;
        state.error = null;
        state.token = access_token; // Сохраняем токен в состоянии
        localStorage.setItem('access_token', access_token); // Сохраняем токен в localStorage
      })
      .addMatcher(api.endpoints.loginUser.matchRejected, (state, action) => {
        state.error = 'Неправильный логин или пароль'; // Обрабатываем ошибку при авторизации
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
