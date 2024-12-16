import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api'; // Импортируем API сервис
import authReducer from './slices/authSlice'; // Импортируем редьюсер для аутентификации
import notesReducer from './slices/notesSlice'; // Импортируем редьюсер для заметок

const store = configureStore({
  reducer: {
    // Добавляем редьюсеры для аутентификации и заметок
    auth: authReducer,
    notes: notesReducer,
    // Добавляем редьюсер RTK Query
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Добавляем middleware для RTK Query
});

export default store;
