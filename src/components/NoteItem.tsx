import type { Note } from '../types/note'

type NoteItemProps = {
  note: Note
  onDelete: (id: string) => void
  onEdit: (note: Note) => void
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const NoteItem = ({ note, onDelete, onEdit }: NoteItemProps) => (
  <article className="note-item">
    <div className="note-content">
      <h2 className="note-title">{note.title}</h2>
      <p className="note-text">{note.body}</p>
      <time className="note-date" dateTime={note.updatedAt}>
        Updated {dateFormatter.format(new Date(note.updatedAt))}
      </time>
    </div>
    <div className="note-actions">
      <button className="icon-button edit-button" onClick={() => onEdit(note)}>
        Edit
      </button>
      <button className="icon-button delete-button" onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  </article>
)

export default NoteItem
