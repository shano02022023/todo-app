"use client";

import { useState } from "react";
import TaskList from "../app/components/TaskList";
import { Container } from "../app/types/container";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [container_title, setContainerTitle] = useState("");

  const saveContainer = () => {
    const newContainer: Container = {
      id: containers.length + 1,
      title: container_title,
      items: [],
    };

    setContainer([...containers, newContainer]);
    setContainerTitle("");
    setShowInput(false);
  };

  const [containers, setContainer] = useState<Container[]>([
    {
      id: 1,
      title: "Todo",
      items: [
        { id: 1, title: "Task 1", description: "Description 1" },
        { id: 2, title: "Task 2", description: "Description 2" },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      items: [
        { id: 1, title: "Task 3", description: "Description 3" },
        { id: 2, title: "Task 4", description: "Description 4" },
      ],
    },
    {
      id: 3,
      title: "Done",
      items: [
        { id: 1, title: "Task 5", description: "Description 5" },
        { id: 2, title: "Task 6", description: "Description 6" },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="font-bold text-gray-900 text-3xl mb-6">
        Trello-Like Board
      </h1>

      {/* Board Container - Horizontally scrollable */}
      <div className="flex flex-row gap-5 overflow-x-auto p-4">
        {containers.map((container: Container) => (
          <TaskList
            key={container.id}
            container={container}
            setContainer={setContainer}
            containers={containers}
          />
        ))}

        {/* Add New List Button */}
        <div
          className="w-72 bg-gray-300 shadow-md rounded-lg p-4 flex flex-col justify-center items-center"
        >
          {showInput && (
            <div className="mt-3">
              <input
                value={container_title}
                onChange={(e) => setContainerTitle(e.target.value)}
                type="text"
                placeholder="New list"
                className="input input-bordered w-full text-sm p-2 rounded-md"
              />
              <div className="flex flex-wrap w-full">
                <button
                  className="btn btn-primary w-full mt-2 text-sm"
                  onClick={saveContainer}
                >
                  Add List
                </button>
                <button
                  className="btn btn-error w-full mt-2 text-sm"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Show Input Button */}
          {!showInput && (
            <button
              className="btn btn-primary w-full mt-3 text-sm"
              onClick={() => setShowInput(true)}
            >
              + Add List
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
