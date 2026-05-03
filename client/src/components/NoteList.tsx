interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteListProps {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onNewNote: () => void;
}

function NoteList({
  notes,
  searchQuery,
  setSearchQuery,
  selectedNote,
  onSelectNote,
  onNewNote,
}: NoteListProps) {

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} mins ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "Yesterday";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="note-list">
      {/* Header */}
      <div className="note-list-header">
        <h2>All Notes</h2>
      </div>

      {/* Search */}
      <div className="note-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="note-list-items">
        {notes.length === 0 ? (
          <div className="note-list-empty">
            <p>
              {searchQuery
                ? "No notes match your search"
                : "No notes yet. Create one!"}
            </p>
            {!searchQuery && (
              <button className="empty-new-btn" onClick={onNewNote}>
                + New Note
              </button>
            )}
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className={`note-list-item ${
                selectedNote?._id === note._id ? "active" : ""
              }`}
              onClick={() => onSelectNote(note)}
            >
              <div className="note-item-header">
                <h3>{note.title || "Untitled Note"}</h3>
              </div>
              <p className="note-item-preview">
                {note.content
                  ? note.content.substring(0, 80) + "..."
                  : "No content"}
              </p>
              <div className="note-item-footer">
                <span className="note-item-date">
                  {formatDate(note.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoteList;