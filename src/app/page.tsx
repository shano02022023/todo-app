"use client";

import React, { useState, useEffect, useRef, act } from "react";
import Container from "./components/Container";
import { ContainerProps } from "../app/types/container";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ItemsProps } from "../app/types/items";
import ContainerDropArea from "./components/container_drop_area";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [container_title, setContainerTitle] = useState("");
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(
    null
  );
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeContainer, setActiveContainer] = useState<number | null>(null);
  const [draggableType, setDraggableType] = useState<string | null>(null);
  const [tasks, setTask] = useState<ItemsProps[]>([
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      isFavorite: true,
      container_id: 1,
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      isFavorite: false,
      container_id: 1,
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description 3",
      isFavorite: true,
      container_id: 2,
    },
    {
      id: 4,
      title: "Task 4",
      description: "Description 4",
      isFavorite: true,
      container_id: 2,
    },
    {
      id: 5,
      title: "Task 5",
      description: "Description 5",
      isFavorite: true,
      container_id: 3,
    },
    {
      id: 6,
      title: "Task 6",
      description: "Description 6",
      isFavorite: false,
      container_id: 3,
    },
  ]);

  const [containers, setContainer] = useState<ContainerProps[]>([
    {
      id: 1,
      title: "Todo",
    },
    {
      id: 2,
      title: "In Progress",
    },
    {
      id: 3,
      title: "Done",
    },
  ]);

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
      const newContainer: ContainerProps = {
        id: maxId + 1,
        title: container_title,
      };

      setContainer([...containers, newContainer]);
    }

    setContainerTitle("");
    setShowInput(false);
    setIsEditingContainer(false);
    setSelectedContainerId(null);
  };

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
    // Delete all tasks in the container
    const updatedTasks = tasks.filter((task) => task.container_id !== id);
    setTask(updatedTasks);

    // Delete the container
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

  const onDrop = (container_id: number, position: number) => {
    // console.log(`${activeCard} is going to place in container: ${container_id} at place: ${position}`);

    if (draggableType !== "task") return;

    if (activeCard == null || activeCard == undefined) return;

    const taskToMove = tasks[activeCard];

    // Remove it from the current position
    const updatedTasks = tasks.filter((task, index) => index !== activeCard);

    if (activeCard < position) {
      // Insert it at the new position
      updatedTasks.splice(position - 1, 0, {
        ...taskToMove,
        container_id: container_id,
      });
    } else {
      updatedTasks.splice(position, 0, {
        ...taskToMove,
        container_id: container_id,
      });
    }

    // Update the state with the reordered containers
    setTask(updatedTasks);

    setActiveCard(null);

    console.log(updatedTasks);
  };

  const onDropContainer = (position: number) => {
    if (draggableType !== "container") return;
    if (activeContainer == null || activeContainer == undefined) return;

    // Extract the container to move
    const containerToMove = containers[activeContainer];

    // Remove it from the current position
    const updatedContainers = containers.filter(
      (container, index) => index !== activeContainer
    );

    if (activeContainer < position) {
      updatedContainers.splice(position - 1, 0, {
        ...containerToMove,
      });
    } else {
      updatedContainers.splice(position, 0, {
        ...containerToMove,
      });
    }

    // Update the state with the reordered containers
    setContainer(updatedContainers);

    // Update the indices of tasks within the containers
    const updatedTasks = tasks.map((task) => {
      const newContainerIndex = updatedContainers.findIndex(
        (c) => c.id === task.container_id
      );
      return { ...task, index: newContainerIndex };
    });

    setTask(updatedTasks);

    console.log("Updated Containers:", updatedContainers);
    console.log("Updated Tasks:", updatedTasks);
  };

  return (
    <div className="h-full bg-gray-100 p-6 w-full dark:bg-gray-700 rounded-xl">
      <h1 className="font-bold text-gray-900 text-3xl mb-6 dark:text-gray-200">
        Custom Board
      </h1>
      {/* Board Container - Horizontally scrollable */}
      <div
        ref={containerListRef}
        className="bg-gray-300 flex flex-row gap-5 p-4 items-start overflow-scroll w-full h-5/6"
      >
        <ContainerDropArea
          onDrop={() => {
            onDropContainer(0);
          }}
          draggableType={draggableType}
        />
        {containers.map((container: ContainerProps, index: number) => (
          <React.Fragment key={index}>
            <div
              onDragStart={() => {
                setActiveContainer(index);
                setDraggableType("container");
              }}
              onDragEnd={() => {
                setActiveContainer(null);
                setDraggableType(null);
              }}
              draggable
              className="w-max bg-white shadow-lg rounded-lg p-4 hover:cursor-grab"
            >
              <div className="flex flex-row justify-between items-between pb-2 w-60">
                <div className="flex items-center gap-2 w-11/12">
                  {/* Drag Handle (Optional: Only This is Draggable) */}
                  <div
                    className="cursor-grab hover:bg-gray-200 rounded-md"
                    onMouseDown={(e) => e.stopPropagation()}
                    draggable
                  ></div>
                  {isEditingContainer && container.id == selectedContainerId ? (
                    <div className="w-full flex flex-row items-between justify-between">
                      <div>
                        <input
                          value={container_title}
                          onChange={(e) => setContainerTitle(e.target.value)}
                          type="text"
                          placeholder="Title"
                          className="input input-bordered w-full text-sm p-2 rounded-md z-50"
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => saveContainer(container.id)}
                          className="text-green-700"
                        >
                          <CheckCircleIcon className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h2
                      onClick={() => openInputContainerEditForm(container.id)}
                      className="font-bold text-lg text-gray-800 mb-3 z-0 hover:cursor-text"
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

              {/* This is the task container, where tasks should be dragged individually */}
              <Container
                key={container.id}
                tasks={tasks}
                container_id={container.id}
                setTasks={setTask}
                setActiveCard={setActiveCard}
                activeCard={activeCard}
                onDrop={onDrop}
                setDraggableType={setDraggableType}
                draggableType={draggableType}
              />
            </div>

            <ContainerDropArea
              onDrop={() => {
                onDropContainer(index + 1);
              }}
              draggableType={draggableType}
            />
          </React.Fragment>
        ))}

        {/* Add New List Button */}
        <div className="w-max bg-gray-200 shadow-md rounded-lg p-4 flex flex-col justify-center items-center w-60">
          {showInput && (
            <div className="mt-3 w-60">
              <input
                value={container_title}
                onChange={(e) => setContainerTitle(e.target.value)}
                type="text"
                placeholder="New list"
                className="input input-bordered w-full text-sm p-2 rounded-md z-50"
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
              className="btn btn-primary w-60 mt-3 text-sm z-10"
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
