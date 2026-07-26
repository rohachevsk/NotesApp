import NoteItem from './NoteItem'
import type { Note } from '../types/note'

type NoteListProps = {
  notes: Note[]
  onDelete: (id: string) => void
  onEdit: (note: Note) => void
}

const NoteList = ({ notes, onDelete, onEdit }: NoteListProps) => (
  <div className="note-list">
    {notes.map((note) => (
      <NoteItem
        key={note.id}
        note={note}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    ))}
  </div>
)

export default NoteList
