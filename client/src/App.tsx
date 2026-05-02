import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://cloudsync-notepad-backend.onrender.com/api";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [isLogin, setIsLogin] = useState(true);

  // Auth fields
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Note fields
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // 🔍 Search
  const [searchQuery, setSearchQuery] = useState("");

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // 📥 Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`, authHeaders);
      setNotes(res.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    if (token) fetchNotes(); // eslint-disable-line react-hooks/exhaustive-deps
  }, [token]);

  // 🔐 Signup / Login
  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? "login" : "signup";
      const payload = isLogin
        ? { email: authEmail, password: authPassword }
        : { name: authName, email: authEmail, password: authPassword };

      const res = await axios.post(`${API}/auth/${endpoint}`, payload);
      const { token: newToken, name } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("name", name);
      setToken(newToken);
      setUserName(name);

      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken("");
    setUserName("");
    setNotes([]);
  };

  // ➕ Create note
  const handleCreate = async () => {
    if (!title || !content) return alert("Please fill in both fields!");
    try {
      await axios.post(`${API}/notes`, { title, content }, authHeaders);
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  // ✏️ Start editing
  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  // 💾 Save updated note
  const handleUpdate = async () => {
    if (!editingNote) return;
    try {
      await axios.put(
        `${API}/notes/${editingNote._id}`,
        { title, content },
        authHeaders
      );
      setEditingNote(null);
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  // ❌ Delete note
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API}/notes/${id}`, authHeaders);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // 🚫 Cancel editing
  const handleCancel = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  // 🕒 Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // 🔍 Filtered notes
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔐 Auth Page
  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="app-title">☁️ CloudSync Notepad</h1>
          <h2>{isLogin ? "🔑 Login" : "📝 Sign Up"}</h2>

          {!isLogin && (
            <input
              className="input"
              type="text"
              placeholder="Your Name"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
            />
          )}
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />

          <button className="btn create" onClick={handleAuth}>
            {isLogin ? "🔑 Login" : "📝 Sign Up"}
          </button>

          <p className="switch-auth">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // 📓 Notes Page
  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">☁️ CloudSync Notepad</h1>
        <div className="user-info">
          <span>👤 {userName}</span>
          <button className="btn cancel" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <input
        className="input search-bar"
        type="text"
        placeholder="🔍 Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Form */}
      <div className="form">
        <h2>{editingNote ? "✏️ Edit Note" : "➕ New Note"}</h2>
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-buttons">
          {editingNote ? (
            <>
              <button className="btn save" onClick={handleUpdate}>💾 Save</button>
              <button className="btn cancel" onClick={handleCancel}>🚫 Cancel</button>
            </>
          ) : (
            <button className="btn create" onClick={handleCreate}>➕ Add Note</button>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p className="empty">
            {searchQuery ? "No notes match your search 🔍" : "No notes yet. Create your first note! 📝"}
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div className="note-card" key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <span className="note-date">🕒 {formatDate(note.createdAt)}</span>
              <div className="card-buttons">
                <button className="btn edit" onClick={() => handleEditClick(note)}>✏️ Edit</button>
                <button className="btn delete" onClick={() => handleDelete(note._id)}>❌ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;