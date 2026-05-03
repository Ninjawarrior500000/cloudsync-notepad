import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://cloudsync-notepad-backend.onrender.com/api";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteEditorProps {
  note: Note | null;
  token: string;
  onSave: () => void;
  onDelete: (id: string) => void;
  isNew: boolean;
}

function NoteEditor({ note, token, onSave, onDelete, isNew }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setSaveStatus("");
    } else if (isNew) {
      setTitle("");
      setContent("");
      setSaveStatus("");
    }
  }, [note, isNew]);

  const handleSave = async () => {
    if (!title || !content) return alert("Please fill in title and content!");
    try {
      setLoading(true);
      setSaveStatus("Saving...");
      if (isNew || !note) {
        await axios.post(
          `${API}/notes`,
          { title, content },
          authHeaders
        );
      } else {
        await axios.put(
          `${API}/notes/${note._id}`,
          { title, content },
          authHeaders
        );
      }
      setSaveStatus("✅ Saved!");
      setTimeout(() => setSaveStatus(""), 2000);
      onSave();
    } catch (error) {
      setSaveStatus("❌ Failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    if (!window.confirm("Delete this note?")) return;
    try {
      await axios.delete(`${API}/notes/${note._id}`, authHeaders);
      onDelete(note._id);
    } catch (error) {
      console.error("Failed to delete note");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!note && !isNew) {
    return (
      <div className="note-editor empty-editor">
        <div className="empty-editor-content">
          <div className="empty-editor-icon">📝</div>
          <h3>Select a note to view</h3>
          <p>Choose a note from the list or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="editor-header-left">
          {note && (
            <span className="editor-date">
              Last updated: {formatDate(note.createdAt)}
            </span>
          )}
          {saveStatus && (
            <span className="editor-save-status">{saveStatus}</span>
          )}
        </div>
        <div className="editor-header-right">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "💾 Save"}
          </button>
          {note && (
            <button
              className="icon-btn delete-btn"
              onClick={handleDelete}
              title="Delete note"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <input
        className="editor-title"
        type="text"
        placeholder="Note Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="editor-content"
        placeholder="Start writing your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}

export default NoteEditor;