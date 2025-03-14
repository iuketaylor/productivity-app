import { useState, useRef } from "react";
import "./App.css";

type View = "home" | "kanban" | "notes";

interface KanbanTask {
  id: string;
  text: string;
  column: "todo" | "in-progress" | "done";
  order: number;
}

function HomeView() {
  const today = new Date();
  const hours = today.getHours();
  let greeting = "Good morning";
  if (hours >= 12 && hours < 18) greeting = "Good afternoon";
  if (hours >= 18) greeting = "Good evening";

  const formatDate = (date = new Date()) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="home-view">
      <div
        style={{
          marginBottom: "30px",
          borderRadius: "12px",
          padding: "25px",
          background: "linear-gradient(135deg, #F8F0E5 0%, #EADFCB 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{ color: "#5D4037", marginBottom: "10px", fontSize: "28px" }}
        >
          {greeting}, Luke!
        </h1>
        <p style={{ color: "#795548", marginBottom: "5px" }}>{formatDate()}</p>
      </div>
    </div>
  );
}

function KanbanView() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);

  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const draggedItem = useRef<KanbanTask | null>(null);
  const dragOverItemId = useRef<string | null>(null);

  const handleDragStart = (task: KanbanTask) => {
    if (editingTaskId === task.id) return;
    draggedItem.current = task;
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    taskId?: string,
  ) => {
    e.preventDefault();
    if (taskId) {
      dragOverItemId.current = taskId;
    }
  };

  const handleDrop = (
    column: "todo" | "in-progress" | "done",
    taskId?: string,
  ) => {
    if (!draggedItem.current) return;

    const updatedTasks = [...tasks];
    const draggedItemIndex = updatedTasks.findIndex(
      (task) => task.id === draggedItem.current?.id,
    );

    if (draggedItem.current.column !== column) {
      const maxOrder = Math.max(
        -1,
        ...updatedTasks
          .filter((task) => task.column === column)
          .map((task) => task.order),
      );

      updatedTasks[draggedItemIndex] = {
        ...updatedTasks[draggedItemIndex],
        column,
        order: maxOrder + 1,
      };
    } else if (taskId && taskId !== draggedItem.current.id) {
      const dropTargetIndex = updatedTasks.findIndex(
        (task) => task.id === taskId,
      );

      const sourceOrder = draggedItem.current.order;
      const targetOrder = updatedTasks[dropTargetIndex].order;

      updatedTasks.forEach((task) => {
        if (task.column === column) {
          if (sourceOrder < targetOrder) {
            if (task.order > sourceOrder && task.order <= targetOrder) {
              task.order--;
            } else if (task.id === draggedItem.current?.id) {
              task.order = targetOrder;
            }
          } else {
            if (task.order < sourceOrder && task.order >= targetOrder) {
              task.order++;
            } else if (task.id === draggedItem.current?.id) {
              task.order = targetOrder;
            }
          }
        }
      });
    }

    setTasks(updatedTasks);
    draggedItem.current = null;
    dragOverItemId.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newTaskText.trim()) {
        const maxOrder = Math.max(
          -1,
          ...tasks
            .filter((task) => task.column === "todo")
            .map((task) => task.order),
        );

        const newTask: KanbanTask = {
          id: Date.now().toString(),
          text: newTaskText.trim(),
          column: "todo",
          order: maxOrder + 1,
        };
        setTasks([...tasks, newTask]);
        setNewTaskText("");
        setIsCreatingTask(false);
      }
    } else if (e.key === "Escape") {
      setIsCreatingTask(false);
      setNewTaskText("");
    }
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    taskId: string,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingText.trim()) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, text: editingText.trim() } : task,
        );
        setTasks(updatedTasks);
      }
      setEditingTaskId(null);
      setEditingText("");
    } else if (e.key === "Escape") {
      setEditingTaskId(null);
      setEditingText("");
    }
  };

  const handleStartEditing = (task: KanbanTask) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const getTasksByColumn = (column: "todo" | "in-progress" | "done") => {
    return tasks
      .filter((task) => task.column === column)
      .sort((a, b) => a.order - b.order);
  };

  const columns = [
    { id: "todo", title: "To Do", color: "#F44336", bgColor: "#FFF9C4" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#FF9800",
      bgColor: "#E1F5FE",
    },
    { id: "done", title: "Done", color: "#4CAF50", bgColor: "#E8F5E9" },
  ];

  return (
    <div className="kanban-view">
      <h1 style={{ color: "#5D4037", marginBottom: "20px" }}>Kanban Board</h1>

      <p style={{ marginBottom: "20px", color: "#666" }}>
        Click + in the Todo column to add a new task. Double-click any note to
        edit. Drag notes between or within columns to reorder. Press Enter to
        save or Esc to cancel.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          height: "calc(100vh - 180px)",
          padding: "10px 0",
        }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              minWidth: "300px",
              width: "32%",
              backgroundColor: "white",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              maxHeight: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={() => handleDrop(column.id as KanbanTask["column"])}
          >
            <div
              style={{
                padding: "15px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "18px", margin: 0, color: column.color }}>
                {column.title} (
                {getTasksByColumn(column.id as KanbanTask["column"]).length})
              </h2>

              {column.id === "todo" && (
                <button
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: column.color,
                  }}
                  onClick={() => setIsCreatingTask(true)}
                >
                  +
                </button>
              )}
            </div>

            <div
              style={{
                overflowY: "auto",
                padding: "10px",
                flex: 1,
              }}
            >
              {isCreatingTask && column.id === "todo" && (
                <div
                  style={{
                    backgroundColor: column.bgColor,
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    marginBottom: "10px",
                    padding: "2px",
                  }}
                >
                  <textarea
                    placeholder="Type your note here... (Enter to save, Esc to cancel)"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "15px",
                      border: "none",
                      borderRadius: "3px",
                      resize: "none",
                      backgroundColor: column.bgColor,
                      boxSizing: "border-box",
                      outline: "none",
                      fontFamily: "'Comic Sans MS', cursive, sans-serif",
                      fontSize: "14px",
                    }}
                    autoFocus
                  />
                </div>
              )}

              {getTasksByColumn(column.id as KanbanTask["column"]).map(
                (task) => (
                  <div
                    key={task.id}
                    draggable={editingTaskId !== task.id}
                    onDragStart={() => handleDragStart(task)}
                    onDragOver={(e) => handleDragOver(e, task.id)}
                    onDrop={() => handleDrop(task.column, task.id)}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                    onDoubleClick={() => handleStartEditing(task)}
                    style={{
                      padding: "15px",
                      paddingTop: "25px",
                      backgroundColor: column.bgColor,
                      borderRadius: "5px",
                      boxShadow:
                        hoveredTaskId === task.id
                          ? "0 5px 10px rgba(0,0,0,0.15)"
                          : "0 2px 5px rgba(0,0,0,0.1)",
                      marginBottom: "10px",
                      cursor: editingTaskId === task.id ? "text" : "grab",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      transform:
                        hoveredTaskId === task.id && editingTaskId !== task.id
                          ? "translateY(-3px) rotate(1deg)"
                          : dragOverItemId.current === task.id
                            ? "translateY(5px) scale(1.03)"
                            : "none",
                      fontFamily: "'Comic Sans MS', cursive, sans-serif",
                      fontSize: "14px",
                      minHeight: "85px",
                      position: "relative",
                      whiteSpace: "pre-wrap",
                      opacity: draggedItem.current?.id === task.id ? 0.6 : 1,
                    }}
                  >
                    {editingTaskId !== task.id && (
                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "none",
                          backgroundColor: "transparent",
                          color:
                            hoveredTaskId === task.id
                              ? "rgba(0,0,0,0.6)"
                              : "rgba(0,0,0,0.3)",
                          fontSize: "14px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background-color 0.2s, color 0.2s",
                          outline: "none",
                          padding: 0,
                          zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.5)";
                          e.currentTarget.style.color = "rgba(0,0,0,0.8)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color =
                            hoveredTaskId === task.id
                              ? "rgba(0,0,0,0.6)"
                              : "rgba(0,0,0,0.3)";
                        }}
                      >
                        ×
                      </button>
                    )}

                    {editingTaskId === task.id ? (
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                        style={{
                          width: "100%",
                          minHeight: "85px",
                          padding: "0",
                          border: "none",
                          resize: "none",
                          backgroundColor: "transparent",
                          fontFamily: "'Comic Sans MS', cursive, sans-serif",
                          fontSize: "14px",
                          outline: "none",
                        }}
                        autoFocus
                      />
                    ) : (
                      task.text
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesView() {
  return (
    <div className="notes-view">
      <h1 style={{ color: "#5D4037", marginBottom: "20px" }}>Notes</h1>
    </div>
  );
}

function App() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<View>("home");

  const handleNavigation = (view: View) => {
    setActiveView(view);
  };

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
        {activeView === "kanban" && <KanbanView />}
        {activeView === "notes" && <NotesView />}
      </div>
    </div>
  );
}

export default App;
