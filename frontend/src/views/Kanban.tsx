import { useState, useRef } from "react";

export interface KanbanTask {
  id: string;
  text: string;
  column: "todo" | "in-progress" | "done";
  position: number;
}

interface KanbanViewProps {
  tasks: KanbanTask[],
  setTasks: (tasks: KanbanTask[]) => void;
}

export function KanbanView({tasks, setTasks}: KanbanViewProps) {
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
    column: KanbanTask['column'],
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
          .map((task) => task.position),
      );

      updatedTasks[draggedItemIndex] = {
        ...updatedTasks[draggedItemIndex],
        column,
        position: maxOrder + 1,
      };
    } else if (taskId && taskId !== draggedItem.current.id) {
      const dropTargetIndex = updatedTasks.findIndex(
        (task) => task.id === taskId,
      );

      const sourceOrder = draggedItem.current.position;
      const targetOrder = updatedTasks[dropTargetIndex].position;

      updatedTasks.forEach((task) => {
        if (task.column === column) {
          if (sourceOrder < targetOrder) {
            if (task.position > sourceOrder && task.position <= targetOrder) {
              task.position--;
            } else if (task.id === draggedItem.current?.id) {
              task.position = targetOrder;
            }
          } else {
            if (task.position < sourceOrder && task.position >= targetOrder) {
              task.position++;
            } else if (task.id === draggedItem.current?.id) {
              task.position = targetOrder;
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
            .map((task) => task.position),
        );

        const newTask: KanbanTask = {
          id: Date.now().toString(),
          text: newTaskText.trim(),
          column: "todo",
          position: maxOrder + 1,
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

  const getTasksByColumn = (column: KanbanTask['column']) => {
    return tasks
      .filter((task) => task.column === column)
      .sort((a, b) => a.position - b.position);
  };

  const columns = [
    { id: "todo", title: "To Do", color: "#F44336", bgColor: "#FFF9C4" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#FF9800",
      bgColor: "#FFF9C4",
    },
    { id: "done", title: "Done", color: "#4CAF50", bgColor: "#FFF9C4" },
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
          height: "70vh",
          padding: "10px 0",
        }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              minWidth: "250px",
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
                      textDecoration: column.id === 'done' ? 'line-through' : ''
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
