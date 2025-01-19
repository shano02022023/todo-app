"use client";

import { useState, useEffect, useRef } from "react";
import TaskList from "../app/components/TaskList";
import { Container } from "../app/types/container";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [container_title, setContainerTitle] = useState("");
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(
    null
  );

  const saveContainer = (container_id: number | null) => {
    if (container_id !== null && container_id !== 0) {
      // Update existing container
      const updatedContainers = containers.map((container) =>
        container.id === container_id
          ? { ...container, title: container_title }
          : container
      );

      setContainer(updatedContainers);
    } else {
      // Add new container
      const maxId =
        containers.length > 0 ? Math.max(...containers.map((c) => c.id)) : 0;
      const newContainer: Container = {
        id: maxId + 1,
        title: container_title,
        items: [],
      };

      setContainer([...containers, newContainer]);
    }

    setContainerTitle("");
    setShowInput(false);
    setIsEditingContainer(false);
    setSelectedContainerId(null);
  };

  const [containers, setContainer] = useState<Container[]>([
    {
      id: 1,
      title: "Todo",
      items: [
        { id: 1, title: "Task 1", description: "Description 1", isFavorite: true },
        { id: 2, title: "Task 2", description: "Description 2", isFavorite: false },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      items: [
        { id: 1, title: "Task 3", description: "Description 3", isFavorite: true },
        { id: 2, title: "Task 4", description: "Description 4", isFavorite: true },
      ],
    },
    {
      id: 3,
      title: "Done",
      items: [
        { id: 1, title: "Task 5", description: "Description 5", isFavorite: true },
        { id: 2, title: "Task 6", description: "Description 6", isFavorite: false },
      ],
    },
  ]);

  const openInputContainerEditForm = (container_id: number) => {
    const selectedContainer = containers.find(
      (container) => container.id === container_id
    );

    if (selectedContainer) {
      setSelectedContainerId(selectedContainer.id);
      setContainerTitle(selectedContainer.title);
    }

    setIsEditingContainer(true);
  };

  const deleteContainer = (id: number) => () => {
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    setContainer(updatedContainers);
  };

  const containerListRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = async (event: MouseEvent) => {
    if (
      containerListRef.current &&
      !containerListRef.current.contains(event.target as Node)
    ) {
      // saveContainer(selectedContainerId);
      // console.log("closed edit form for: " + selectedContainerId)

      setIsEditingContainer(false);
      setSelectedContainerId(null);
    }
  };

  useEffect(() => {
    if (isEditingContainer) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingContainer]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="font-bold text-gray-900 text-3xl mb-6">
        Todo app Trello inspired
      </h1>

      {/* Board Container - Horizontally scrollable */}
      <div
        ref={containerListRef}
        className="flex flex-wrap gap-5 overflow-x-auto p-4 items-center justify-center"
      >
        {containers.map((container: Container) => (
          <div
            key={container.id}
            className="w-72 bg-white shadow-lg rounded-lg p-4 flex flex-col"
          >
            <div className="flex flex-row justify-between items-between pb-5">
              <div>
                {isEditingContainer && container.id == selectedContainerId ? (
                  <div className="flex flex-row items-between justify-between">
                    <div>
                      <input
                        value={container_title}
                        onChange={(e) => setContainerTitle(e.target.value)}
                        type="text"
                        placeholder="Title"
                        className="input input-bordered w-full text-sm p-2 rounded-md"
                      />
                    </div>
                    <button
                      onClick={() => saveContainer(container.id)}
                      className="text-green-700"
                    >
                      <CheckCircleIcon className="w-7 h-7" />
                    </button>
                  </div>
                ) : (
                  <h2
                    onClick={() => openInputContainerEditForm(container.id)}
                    className="font-bold text-lg text-gray-800 mb-3"
                  >
                    {container.title}
                  </h2>
                )}
              </div>
              <button
                className={
                  isEditingContainer && container.id == selectedContainerId
                    ? "hidden"
                    : "text-red-700"
                }
                onClick={deleteContainer(container.id)}
              >
                <XCircleIcon className="w-7 h-7" />
              </button>
            </div>
            <TaskList
              key={container.id}
              container={container}
              setContainer={setContainer}
            />
          </div>
        ))}

        {/* Add New List Button */}
        <div className="w-72 bg-gray-300 shadow-md rounded-lg p-4 flex flex-col justify-center items-center">
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
                  onClick={() => saveContainer(null)}
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
