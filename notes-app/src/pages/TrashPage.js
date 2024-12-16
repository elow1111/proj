import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRestoreNoteMutation, useDeleteNoteForeverMutation } from '../api'; // Импортируем хуки RTK Query
import { Link } from 'react-router-dom';

const TrashPage = () => {
  const dispatch = useDispatch();
  const trashNotes = useSelector((state) => state.notes.trash); // Получаем все заметки в корзине

  const [restoreNote, { isLoading: isRestoring }] = useRestoreNoteMutation();  // Хук для восстановления заметки
  const [deleteNoteForever, { isLoading: isDeleting }] = useDeleteNoteForeverMutation();  // Хук для удаления заметки навсегда

  const handleRestore = async (noteId) => {
    try {
      await restoreNote(noteId).unwrap(); // Восстановление заметки через RTK Query
    } catch (error) {
      console.error('Ошибка при восстановлении заметки:', error);
    }
  };

  const handleDeleteForever = async (noteId) => {
    try {
      await deleteNoteForever(noteId).unwrap(); // Удаление заметки навсегда через RTK Query
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error);
    }
  };

  return (
    <div className="trash-page">
      <h2>Корзина</h2>
      {trashNotes.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        trashNotes.map((note) => (
          <div key={note.id} className="trash-note-item">
            <div className="note-header">
              <h3>{note.topic}</h3>
              <div>{note.createdAt}</div>
            </div>
            <div className="note-body">{note.text}</div>
            <div className="note-footer">
              <span>{note.tag}</span>
              <button onClick={() => handleRestore(note.id)} disabled={isRestoring}>
                {isRestoring ? 'Восстановление...' : 'Восстановить'}
              </button>
              <button onClick={() => handleDeleteForever(note.id)} disabled={isDeleting}>
                {isDeleting ? 'Удаление...' : 'Удалить навсегда'}
              </button>
            </div>
          </div>
        ))
      )}
      <div className="navigation-links">
        <Link to="/">Перейти на главную страницу</Link>
      </div>
    </div>
  );
};

export default TrashPage;
