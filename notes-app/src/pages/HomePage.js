import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery, useCreateNoteMutation, useDeleteNoteMutation } from '../api';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const username = useSelector((state) => state.auth.username);
  const [newNote, setNewNote] = useState({ text: '', topic: '', tag: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [popupNote, setPopupNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  

  const { data: fetchedNotes, error, isLoading } = useGetNotesQuery();
  const [createNote] = useCreateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const handleAddNote = async () => {
    if (newNote.topic.trim() === '') return;
    const newNoteWithDate = {
      ...newNote,
      createdAt: new Date().toISOString(),
    };

    // Используем хук RTK Query для добавления заметки
    await createNote(newNoteWithDate);
    setNewNote({ text: '', topic: '', tag: '' });
  };

  const handleDeleteNote = async (noteId) => {
    // Используем хук RTK Query для удаления заметки
    await deleteNote(noteId);
  };

  const handleOpenNote = (note, index) => {
    setPopupNote(note);
    setCurrentNoteIndex(index);
    setShowPopup(true);
    setEditMode(false);
  };

  const handleEditNote = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[currentNoteIndex] = {
      ...popupNote,
      createdAt: popupNote.createdAt,
    };
    setNotes(updatedNotes);
    setEditMode(false);
    setShowPopup(false);
  };

  const handleTextChange = (e) => {
    setPopupNote({ ...popupNote, text: e.target.value });
  };

  const handleTopicChange = (e) => {
    const topic = e.target.value.slice(0, 30);
    setPopupNote({ ...popupNote, topic });
  };

  const handleTagChange = (e) => {
    const tag = e.target.value.slice(0, 30);
    setPopupNote({ ...popupNote, tag });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const sortNotesByDate = (notesArray) => {
    return notesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const filteredNotes = notes?.filter((note) => {
    const searchInText = note.text.toLowerCase().includes(searchQuery);
    const searchInTopic = note.topic.toLowerCase().includes(searchQuery);
    const searchInTag = note.tag.toLowerCase().includes(searchQuery);
    return searchInText || searchInTopic || searchInTag;
  });

  const filterByDate = (notesArray, date) => {
    if (!date) return notesArray;
    return notesArray.filter((note) => {
      const noteDate = new Date(note.createdAt);
      return (
        noteDate.getDate() === date.getDate() &&
        noteDate.getMonth() === date.getMonth() &&
        noteDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const sortedNotes = sortNotesByDate(filteredNotes);
  const filteredByDateNotes = filterByDate(sortedNotes, selectedDate);

  const handleResetDateFilter = () => {
    setSelectedDate(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGoToTrash = () => {
    navigate('/trash');
  };

  return (
    <div className="home-page">
      <div className="profile-container">
        <span className="username">{username}</span>
        <button onClick={handleLogout} className="logout-button">Выйти</button>
        <button onClick={handleGoToTrash} className="go-to-trash-button">Корзина</button>
      </div>

      {notes?.length === 0 && <div className="centered-text">Жду ваши заметки!</div>}

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по ключевым словам"
          className="search-input"
        />
      </div>

      <div className="note-form">
        <input
          type="text"
          value={newNote.topic}
          onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
          placeholder="Тема заметки"
          className="note-input"
        />
        <input
          type="text"
          value={newNote.tag}
          onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
          placeholder="Тег"
          className="note-input"
        />
        <textarea
          value={newNote.text}
          onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
          placeholder="Текст заметки"
          className="note-input"
        />
        <button onClick={handleAddNote} className="note-button">Записать</button>
      </div>

      {showPopup && popupNote && (
        <div className="popup">
          <div className="popup-content">
            <div>
              <strong>Тема:</strong>
              {editMode ? (
                <input
                  type="text"
                  value={popupNote.topic}
                  onChange={handleTopicChange}
                  className="note-input"
                />
              ) : (
                <span>{popupNote.topic}</span>
              )}
            </div>
            <div>
              <strong>Теги:</strong>
              {editMode ? (
                <input
                  type="text"
                  value={popupNote.tag}
                  onChange={handleTagChange}
                  className="note-input"
                />
              ) : (
                <span>{popupNote.tag}</span>
              )}
            </div>
            <div>
              <strong>Текст:</strong>
              {editMode ? (
                <textarea
                  value={popupNote.text}
                  onChange={handleTextChange}
                  className="note-input"
                />
              ) : (
                <p>{popupNote.text}</p>
              )}
            </div>
            <div className="note-date">
              {new Date(popupNote.createdAt).toLocaleDateString()}
            </div>
            <button onClick={() => setShowPopup(false)} className="popup-close">Закрыть</button>
            <button onClick={handleEditNote} className="popup-edit">Редактировать</button>
            {editMode && <button onClick={handleSaveEdit} className="popup-save">Сохранить</button>}
          </div>
        </div>
      )}

      <div className="calendar-container">
        <div className="reset-date-filter">
          <button onClick={handleResetDateFilter} className="reset-button">Сбросить фильтр по дате</button>
        </div>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div className="notes-container">
        {filteredByDateNotes.length === 0 && selectedDate && <div className="no-results">Заметки не найдены для этой даты</div>}
        {filteredByDateNotes.map((note, index) => (
          <div className="note" key={index}>
            <div className="note-header">
              <span>{note.topic} - {note.tag}</span>
              <button onClick={() => handleDeleteNote(note.id)} className="delete-note">Удалить</button>
            </div>
            <p>{note.text.substring(0, 30)}...</p>
            <button onClick={() => handleOpenNote(note, index)} className="view-note">Смотреть</button>
            <div className="note-date">
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
