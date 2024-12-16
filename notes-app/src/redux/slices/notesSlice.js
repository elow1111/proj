import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../api'; // Импортируем API с RTK Query

const initialState = {
  notes: [],
  trash: [],
  status: 'idle', // Статус для запросов
  error: null, // Ошибки, если они возникнут
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Дополнительные действия, если нужно
  },
  extraReducers: (builder) => {
    // Получить все заметки
    builder.addMatcher(api.endpoints.getNotes.matchFulfilled, (state, action) => {
      state.notes = action.payload; // Получаем все заметки
      state.status = 'succeeded'; // Запрос успешен
    });
    builder.addMatcher(api.endpoints.getNotes.matchPending, (state) => {
      state.status = 'loading'; // Запрос в процессе
    });
    builder.addMatcher(api.endpoints.getNotes.matchRejected, (state, action) => {
      state.status = 'failed'; // Запрос завершился с ошибкой
      state.error = action.error.message; // Записываем сообщение об ошибке
    });

    // Добавить новую заметку
    builder.addMatcher(api.endpoints.createNote.matchFulfilled, (state, action) => {
      state.notes.push(action.payload); // Добавляем новую заметку в состояние
    });
    builder.addMatcher(api.endpoints.createNote.matchPending, (state) => {
      state.status = 'loading'; // Запрос на создание заметки
    });
    builder.addMatcher(api.endpoints.createNote.matchRejected, (state, action) => {
      state.status = 'failed'; // Запрос завершился с ошибкой
      state.error = action.error.message; // Записываем сообщение об ошибке
    });

    // Удалить заметку
    builder.addMatcher(api.endpoints.deleteNote.matchFulfilled, (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload); // Удаляем заметку из списка
    });

    // Обновить заметку
    builder.addMatcher(api.endpoints.updateNote.matchFulfilled, (state, action) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload; // Обновляем заметку
      }
    });

    // Переместить в корзину
    builder.addMatcher(api.endpoints.moveToTrash.matchFulfilled, (state, action) => {
      const note = state.notes.find(note => note.id === action.payload);
      if (note) {
        state.notes = state.notes.filter(note => note.id !== action.payload);
        state.trash.push(note); // Перемещаем заметку в корзину
      }
    });

    // Восстановить заметку из корзины
    builder.addMatcher(api.endpoints.restoreNote.matchFulfilled, (state, action) => {
      const note = state.trash.find(note => note.id === action.payload);
      if (note) {
        state.trash = state.trash.filter(note => note.id !== action.payload);
        state.notes.push(note); // Восстанавливаем заметку
      }
    });

    // Удалить заметку навсегда
    builder.addMatcher(api.endpoints.deleteNoteForever.matchFulfilled, (state, action) => {
      state.trash = state.trash.filter(note => note.id !== action.payload); // Удаляем заметку навсегда
    });
  },
});

export const { moveToTrash, restoreNote, deleteNoteForever } = notesSlice.actions;

export default notesSlice.reducer;
