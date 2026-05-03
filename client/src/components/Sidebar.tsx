interface SidebarProps {
  onLogout: () => void;
  onNewNote: () => void;
  userName: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function Sidebar({
  onLogout,
  onNewNote,
  userName,
  darkMode,
  toggleDarkMode,
}: SidebarProps) {
  return (
    <div className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">📓</span>
        <span className="sidebar-brand-text">CloudSync</span>
      </div>

      {/* New Note Button */}
      <button
        className="new-note-btn"
        onClick={onNewNote}
      >
        + New Note
      </button>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="sidebar-nav-item active">
          <span>📄</span> All Notes
        </div>
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="sidebar-username">{userName}</span>
        </div>
        <div className="sidebar-actions">
          <button
            className="icon-btn"
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            className="icon-btn logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;