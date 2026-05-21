import { useEffect, useRef, useState } from 'react'
import './App.css'
import NoteList from './assets/NoteList'

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  const [noteInput, setNoteInput] = useState('')
  const [editNoteId, setEditNoteId] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (noteInput.trim() === '') return
    const newNote = {
      id: Date.now(),
      text: noteInput,
    }
    setNotes([...notes, newNote])
    setNoteInput('')
  }
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }
  const editNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id)
    setNoteInput(noteToEdit.text)
    setEditNoteId(id)
    inputRef.current?.focus()
  }
  const updateNote = () => {
    setNotes(notes.map(note => note.id === editNoteId ? { ...note, text: noteInput } : note))
    setEditNoteId(null)
    setNoteInput('')
  }
  const cancelEdit = () => {
    setEditNoteId(null)
    setNoteInput('')
  }
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      editNoteId ? updateNote() : addNote()
    }
  }

  return (
    <main className="app-shell">
      <section className="notes-panel" aria-label="Notes">
        <header className="app-header">
          <p className="app-kicker">Personal workspace</p>
          <div className="title-row">
            <h1>Notes App</h1>
            <span className="note-count">{notes.length}</span>
          </div>
        </header>

        <div className="note-composer">
          <input
            ref={inputRef}
            className="note-input"
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter your note"
          />
          <div className="composer-actions">
            {editNoteId ? (
              <button className="button button-primary" onClick={updateNote}>
                Update Note
              </button>
            ) : (
              <button className="button button-primary" onClick={addNote}>
                Add Note
              </button>
            )}
            {editNoteId && (
              <button className="button button-ghost" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {notes.length === 0 && (
          <p className="empty-state">No notes yet</p>
        )}

        <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
      </section>
    </main>
  )
}

export default App
