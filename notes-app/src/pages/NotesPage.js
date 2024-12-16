import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetNotesQuery, useCreateNoteMutation } from '../api';  // Импортируем хуки из api.js

const NotesPage = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);  // Получаем заметки из Redux
  const [newNoteContent, setNewNoteContent] = useState('');  // Состояние для новой заметки

  // Загрузка заметок с помощью RTK Query
  const { data: fetchedNotes, error: fetchError, isLoading: isLoadingNotes } = useGetNotesQuery();
  
  // Создание новой заметки с помощью RTK Query
  const [createNote, { error: createError, isLoading: isCreating }] = useCreateNoteMutation();

  // Эффект для загрузки заметок при монтировании компонента
  useEffect(() => {
    if (fetchedNotes) {
      // Загруженные заметки автоматически попадут в Redux через RTK Query
    }
  }, [fetchedNotes]);

  // Функция для добавления заметки
  const handleAddNote = async () => {
    if (newNoteContent.trim()) {
      const note = { content: newNoteContent };
      try {
        // Создаем заметку через RTK Query
        const addedNote = await createNote(note).unwrap();
        setNewNoteContent('');  // Очищаем поле ввода
      } catch (error) {
        console.error('Ошибка при добавлении заметки:', error);
      }
    }
  };

  return (
    <div className="notes-page">
      <h1>Notes Page</h1>
      <div className="note-input-container">
        <input
          type="text"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}  // Обновляем состояние ввода
          placeholder="Введите заметку"
          className="note-input"
        />
        <button onClick={handleAddNote} className="add-note-button" disabled={isCreating}>
          {isCreating ? 'Добавление...' : 'Добавить заметку'}
        </button>
      </div>
      {isLoadingNotes && <div>Загрузка заметок...</div>}  {/* Индикатор загрузки */}
      {fetchError && <div>Ошибка при загрузке заметок</div>}
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            {note.content}  {/* Выводим содержимое заметки */}
          </li>
        ))}
      </ul>
      {createError && <div>Ошибка при добавлении заметки</div>}  {/* Индикатор ошибки */}
    </div>
  );
};

export default NotesPage;
