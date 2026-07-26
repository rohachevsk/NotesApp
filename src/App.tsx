import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import NoteList from './components/NoteList'
import { loadNotes, saveNotes } from './lib/notesStorage'
import type { Note, NoteSortOrder } from './types/note'

const sortNotes = (notes: Note[], order: NoteSortOrder) =>
  [...notes].sort((firstNote, secondNote) => {
    const difference = Date.parse(secondNote.updatedAt) - Date.parse(firstNote.updatedAt)
    return order === 'updated-desc' ? difference : -difference
  })

function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [titleInput, setTitleInput] = useState('')
  const [bodyInput, setBodyInput] = useState('')
  const [editNoteId, setEditNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>('updated-desc')

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const resetComposer = () => {
    setEditNoteId(null)
    setTitleInput('')
    setBodyInput('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = titleInput.trim()
    const body = bodyInput.trim()
    if (!title || !body) return

    const timestamp = new Date().toISOString()

    if (editNoteId) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editNoteId
            ? { ...note, title, body, updatedAt: timestamp }
            : note,
        ),
      )
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        body,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      setNotes((currentNotes) => [newNote, ...currentNotes])
    }

    resetComposer()
  }

  const deleteNote = (id: string) => {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id))
    if (editNoteId === id) resetComposer()
  }

  const editNote = (note: Note) => {
    setTitleInput(note.title)
    setBodyInput(note.body)
    setEditNoteId(note.id)
  }

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const matchingNotes = notes.filter((note) => {
    if (!normalizedQuery) return true
    return `${note.title} ${note.body}`.toLocaleLowerCase().includes(normalizedQuery)
  })
  const visibleNotes = sortNotes(matchingNotes, sortOrder)
  const isEditing = editNoteId !== null
  const isComposerValid = Boolean(titleInput.trim() && bodyInput.trim())

  return (
    <main className="app-shell">
      <section className="notes-panel" aria-label="Notes">
        <header className="app-header">
          <p className="app-kicker">Personal workspace</p>
          <div className="title-row">
            <h1>Notes App</h1>
            <span className="note-count" aria-label={`${notes.length} notes`}>
              {notes.length}
            </span>
          </div>
        </header>

        <form className="note-composer" onSubmit={handleSubmit}>
          <label className="composer-field">
            <span>Title</span>
            <input
              className="note-input note-title-input"
              type="text"
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              placeholder="Give your note a title"
              maxLength={80}
            />
          </label>
          <label className="composer-field">
            <span>Note</span>
            <textarea
              className="note-input note-body-input"
              value={bodyInput}
              onChange={(event) => setBodyInput(event.target.value)}
              placeholder="Write down the useful part"
              rows={4}
            />
          </label>
          <div className="composer-actions">
            <button
              className="button button-primary"
              type="submit"
              disabled={!isComposerValid}
            >
              {isEditing ? 'Update Note' : 'Add Note'}
            </button>
            {isEditing && (
              <button className="button button-ghost" type="button" onClick={resetComposer}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {notes.length > 0 && (
          <div className="note-tools">
            <label className="search-field">
              <span>Search notes</span>
              <input
                className="tool-control"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title or text"
              />
            </label>
            <label className="sort-field">
              <span>Sort by</span>
              <select
                className="tool-control"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as NoteSortOrder)}
              >
                <option value="updated-desc">Recently updated</option>
                <option value="updated-asc">Least recently updated</option>
              </select>
            </label>
          </div>
        )}

        {notes.length === 0 && <p className="empty-state">No notes yet</p>}
        {notes.length > 0 && visibleNotes.length === 0 && (
          <p className="empty-state">No notes match "{searchQuery.trim()}"</p>
        )}

        <NoteList notes={visibleNotes} onDelete={deleteNote} onEdit={editNote} />
      </section>
    </main>
  )
}

export default App
