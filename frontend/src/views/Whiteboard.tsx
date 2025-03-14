import React, { useRef, useState, useEffect } from "react";

interface Stroke {
  path: { x: number; y: number }[];
  color: string;
  size: number;
}

export function WhiteboardView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.9;
      ctxRef.current = canvas.getContext("2d");
      redrawCanvas();
    }
  }, [strokes]);

  const redrawCanvas = () => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    strokes.forEach(({ path, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      path.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const newStroke: Stroke = {
      path: [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }],
      color: currentColor,
      size: brushSize,
    };
    setStrokes((prev) => [...prev, newStroke]);
    setRedoStack([]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    setStrokes((prev) => {
      const newStrokes = [...prev];
      newStrokes[newStrokes.length - 1].path.push({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      });
      return newStrokes;
    });
  };

  const handleMouseUp = () => setDrawing(false);

  const handleUndo = () => {
    if (strokes.length > 0) {
      setRedoStack((prev) => [strokes[strokes.length - 1], ...prev]);
      setStrokes((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      setStrokes((prev) => [...prev, redoStack[0]]);
      setRedoStack((prev) => prev.slice(1));
    }
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStack([]);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
      }}
    >
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div style={{ border: "solid 1px black", display: "flex", justifyContent: "space-evenly" }}>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={handleClear}>Clear</button>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="cursor-pointer w-full"
        />
        <input
          type="range"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
