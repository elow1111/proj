import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8000'; // URL вашего FastAPI-сервера

// Создание API с RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Берем токен из состояния Redux
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Добавляем токен в заголовок Authorization
      }
      return headers;
    }
  }), // Указываем базовый URL для запросов
  endpoints: (builder) => ({
    // Получить все заметки
    getNotes: builder.query({
      query: () => '/notes/', // API эндпоинт для получения всех заметок
    }),
    // Создать новую заметку
    createNote: builder.mutation({
      query: (noteData) => ({
        url: '/notes/', // API эндпоинт для создания заметки
        method: 'POST',
        body: noteData, // Передаем данные для создания заметки
      }),
    }),
    // Удалить заметку
    deleteNote: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}`, // API эндпоинт для удаления заметки по ID
        method: 'DELETE',
      }),
    }),
    // Обновить заметку
    updateNote: builder.mutation({
      query: ({ noteId, noteData }) => ({
        url: `/notes/${noteId}`, // API эндпоинт для обновления заметки по ID
        method: 'PUT',
        body: noteData, // Передаем данные для обновления заметки
      }),
    }),
    // Эндпоинт для авторизации пользователя
    loginUser: builder.mutation({
      query: ({ username, password }) => ({
        url: '/token', // API эндпоинт для авторизации
        method: 'POST',
        body: { username, password }, // Передаем данные для авторизации
      }),
    }),
    // Переместить заметку в корзину
    moveToTrash: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}/move-to-trash`, // Эндпоинт для перемещения в корзину
        method: 'POST',
      }),
    }),
    // Восстановить заметку из корзины
    restoreNote: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}/restore`, // Эндпоинт для восстановления из корзины
        method: 'POST',
      }),
    }),
    // Удалить заметку навсегда
    deleteNoteForever: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}/delete-forever`, // Эндпоинт для удаления заметки навсегда
        method: 'DELETE',
      }),
    }),
  }),
});

// Экспортируем хуки для работы с заметками и авторизацией
export const { 
  useGetNotesQuery, 
  useCreateNoteMutation, 
  useDeleteNoteMutation, 
  useUpdateNoteMutation, 
  useMoveToTrashMutation,
  useRestoreNoteMutation,
  useDeleteNoteForeverMutation, // Хук для удаления навсегда
  useLoginUserMutation // Хук для авторизации
} = api;

export default api;
