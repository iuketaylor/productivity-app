import { View } from "../App";
import { useState } from "react";

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export function SidebarView({ activeView, setActiveView }: SidebarProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      id="sidebar"
      className={isHovered ? "sidebar-expanded" : "sidebar-collapsed"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div
        className={`nav-item ${activeView === "home" ? "active" : ""}`}
        onClick={() => setActiveView("home")}
      >
        <span>🏠</span>
        {isHovered ? <span>Home</span> : null}
      </div>

      <div
        className={`nav-item ${activeView === "kanban" ? "active" : ""}`}
        onClick={() => setActiveView("kanban")}
      >
        <span>📋</span>
        {isHovered ? <span>Kanban Board</span> : null}
      </div>

      <div
        className={`nav-item ${activeView === "notes" ? "active" : ""}`}
        onClick={() => setActiveView("notes")}
      >
        <span>📝</span>
        {isHovered ? <span>Notes</span> : null}
      </div>
      
      <div
        className={`nav-item ${activeView === "bookmarks" ? "active" : ""}`}
        onClick={() => setActiveView("bookmarks")}
      >
        <span>📚</span>
        {isHovered ? <span>Bookmarks</span> : null}
      </div>
      
      <div
        className={`nav-item ${activeView === "whiteboard" ? "active" : ""}`}
        onClick={() => setActiveView("whiteboard")}
      >
        <span>✍️</span>
        {isHovered ? <span>Whiteboard</span> : null}
      </div>
    </div>
  );
}
