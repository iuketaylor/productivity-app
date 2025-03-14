import { useState } from "react";
import "./App.css";
import { KanbanView, KanbanTask } from "./views/Kanban";
import { HomeView } from "./views/Home";
import { NotesView } from "./views/Notes";

type View = "home" | "kanban" | "notes";

function App() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<View>("home");
  const [kanbanTasks, setKanbanTask] = useState<KanbanTask[]>([]);

  const handleNavigation = (view: View) => {
    setActiveView(view);
  };

  const updateKanbanTasks = (newTasks: KanbanTask[]) => {
    setKanbanTask(newTasks);
  };

  return (
    <div id="app">
      <div
        id="sidebar"
        className={isHovered ? "sidebar-expanded" : "sidebar-collapsed"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`nav-item ${activeView === "home" ? "active" : ""}`}
          onClick={() => handleNavigation("home")}
        >
          <span>🏠</span>
          {isHovered ? <span>Home</span> : null}
        </div>

        <div
          className={`nav-item ${activeView === "kanban" ? "active" : ""}`}
          onClick={() => handleNavigation("kanban")}
        >
          <span>📋</span>
          {isHovered ? <span>Kanban Board</span> : null}
        </div>

        <div
          className={`nav-item ${activeView === "notes" ? "active" : ""}`}
          onClick={() => handleNavigation("notes")}
        >
          <span>📝</span>
          {isHovered ? <span>Notes</span> : null}
        </div>
      </div>

      <div id="mainContent">
        {activeView === "home" && <HomeView />}
        {activeView === "kanban" && (
          <KanbanView tasks={kanbanTasks} setTasks={updateKanbanTasks} />
        )}
        {activeView === "notes" && <NotesView />}
      </div>
    </div>
  );
}

export default App;
