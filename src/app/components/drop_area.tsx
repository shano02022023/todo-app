import { useState } from "react";

interface DropAreaProps {
  onDrop: () => void;
  draggableType: string | null;
}

const DropArea = ({ onDrop, draggableType }: DropAreaProps) => {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <li
      onDragOver={(e) => {
        e.preventDefault(); 
        setShowDrop(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setShowDrop(false);
      }}
      onDrop={(e) => {
        onDrop();
        setShowDrop(false);
      }}
      className={`transition-all duration-300 ease-in-out ${
        showDrop && draggableType === "task"
          ? "bg-gray-200 p-3 rounded-lg shadow-md opacity-100"
          : "opacity-0 h-0"
      }`}
    >
      <div className="flex flex-row items-center justify-center min-h-[50px]">
        <h6 className="font-bold text-sm text-gray-900">Drop here...</h6>
      </div>
    </li>
  );
};

export default DropArea;
