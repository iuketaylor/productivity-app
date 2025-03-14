import { useState } from "react";
import "./App.css";
import { KanbanView, KanbanTask } from "./views/Kanban";
import { HomeView } from "./views/Home";
import { NotesView } from "./views/Notes";
import { BookmarksView } from "./views/Bookmarks";
import { SidebarView } from "./views/Sidebar";

export type View = "home" | "kanban" | "notes" | "bookmarks"

function App() {
  const [activeView, setActiveView] = useState<View>("home");
  const [kanbanTasks, setKanbanTask] = useState<KanbanTask[]>([]);

  const updateKanbanTasks = (newTasks: KanbanTask[]) => {
    setKanbanTask(newTasks);
  };

  return (
    <div id="app">
      <SidebarView activeView={activeView} setActiveView={setActiveView} />

      <div id="mainContent">
        {activeView === "home" && <HomeView />}
        {activeView === "kanban" && (
          <KanbanView tasks={kanbanTasks} setTasks={updateKanbanTasks} />
        )}
        {activeView === "notes" && <NotesView />}
        {activeView === 'bookmarks' && <BookmarksView />}
      </div>
    </div>
  );
}

export default App;
