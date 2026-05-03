import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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

  // 🌙 Dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 🔐 Login handler
  const handleLogin = (newToken: string, name: string) => {
    setToken(newToken);
    setUserName(name);
  };

  // 🚪 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken("");
    setUserName("");
    setNotes([]);
    setSelectedNote(null);
  };

  // 🔍 Filter notes by search
  const getFilteredNotes = () => {
    if (!searchQuery) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // ➕ Handle new note
  const handleNewNote = () => {
    setSelectedNote(null);
    setIsNew(true);
  };

  // 💾 After save
  const handleSave = () => {
    fetchNotes();
    setIsNew(false);
  };

  // ❌ After delete
  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n._id !== id));
    setSelectedNote(null);
  };

  // 🔐 Show auth if not logged in
  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <Sidebar
        onLogout={handleLogout}
        onNewNote={handleNewNote}
        userName={userName}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <NoteList
        notes={getFilteredNotes()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedNote={selectedNote}
        onSelectNote={(note) => {
          setSelectedNote(note);
          setIsNew(false);
        }}
        onNewNote={handleNewNote}
      />

      <NoteEditor
        note={selectedNote}
        token={token}
        onSave={handleSave}
        onDelete={handleDelete}
        isNew={isNew}
      />
    </div>
  );
}

export default App;