const NoteItem = ({ note, onDelete, onEdit }) => {
  return (
    <article className="note-item">
      <p className="note-text">{note.text}</p>
      <div className="note-actions">
        <button className="icon-button edit-button" onClick={() => onEdit(note.id)}>
          Edit
        </button>
        <button className="icon-button delete-button" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default NoteItem
