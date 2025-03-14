import { useState } from "react";
import "./App.css";
import { KanbanView, KanbanTask } from './views/Kanban'
import { HomeView } from "./views/Home";
import { NotesView } from "./views/Notes";

type View = "home" | "kanban" | "notes";

function App() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<View>("home");
  const [kanbanTasks, setKanbanTask] = useState<KanbanTask[]>([])

  const handleNavigation = (view: View) => {
    setActiveView(view);
  };
  
  const updateKanbanTasks = (newTasks: KanbanTask[]) => {
    setKanbanTask(newTasks)
  }

  return (
    <div
      id="app"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundColor: "rgba(255, 250, 250, 0.8)",
        position: "relative",
      }}
    >
      <div
        id="sidebar"
        style={{
          position: "absolute",
          zIndex: 10,
          width: isHovered ? "20%" : "60px",
          height: "100%",
          backgroundColor: "rgba(255, 250, 250, 0.8)",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
          transition: "width 0.3s ease",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            padding: "0 10px",
          }}
        ></h2>

        <div
          className={`nav-item ${activeView === "home" ? "active" : ""}`}
          onClick={() => handleNavigation("home")}
          style={{
            padding: "15px 20px",
            marginBottom: "10px",
            cursor: "pointer",
            backgroundColor:
              activeView === "home" ? "rgba(0,0,0,0.05)" : "transparent",
            borderLeft:
              activeView === "home"
                ? "4px solid #5D4037"
                : "4px solid transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "10px" }}>🏠</span>
          {isHovered ? <span>Home</span> : null}
        </div>

        <div
          className={`nav-item ${activeView === "kanban" ? "active" : ""}`}
          onClick={() => handleNavigation("kanban")}
          style={{
            padding: "15px 20px",
            marginBottom: "10px",
            cursor: "pointer",
            backgroundColor:
              activeView === "kanban" ? "rgba(0,0,0,0.05)" : "transparent",
            borderLeft:
              activeView === "kanban"
                ? "4px solid #5D4037"
                : "4px solid transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "10px" }}>📋</span>
          {isHovered ? <span>Kanban Board</span> : null}
        </div>

        <div
          className={`nav-item ${activeView === "notes" ? "active" : ""}`}
          onClick={() => handleNavigation("notes")}
          style={{
            padding: "15px 20px",
            cursor: "pointer",
            backgroundColor:
              activeView === "notes" ? "rgba(0,0,0,0.05)" : "transparent",
            borderLeft:
              activeView === "notes"
                ? "4px solid #5D4037"
                : "4px solid transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "10px" }}>📝</span>
          {isHovered ? <span>Notes</span> : null}
        </div>
      </div>

      <div
        id="mainContent"
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#FFFAF0",
          overflowY: "auto",
          paddingLeft: "100px",
        }}
      >
        {activeView === "home" && <HomeView />}
        {activeView === "kanban" && <KanbanView tasks={kanbanTasks} setTasks={ updateKanbanTasks} />}
        {activeView === "notes" && <NotesView />}
      </div>
    </div>
  );
}

export default App;
