import { useState } from "react";

interface ContainerDropAreaProps {
  onDrop: () => void;
  draggableType: string | null;
}

const ContainerDropArea = ({ onDrop, draggableType }: ContainerDropAreaProps) => {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out transform h-full ${
        showDrop && draggableType === "container"
          ? "bg-gray-100 p-4 rounded-lg shadow-lg opacity-100 scale-100 w-4/5 h-full border-2 border-dashed border-gray-400"
          : "opacity-0 scale-90 w-2"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setShowDrop(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setShowDrop(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
        setShowDrop(false);
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-[50px] w-60">
        <h6 className="text-gray-600 text-sm font-semibold">Drop here...</h6>
      </div>
    </div>
  );
};

export default ContainerDropArea;
