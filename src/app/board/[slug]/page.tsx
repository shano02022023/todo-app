"use client";

import React, { useState, useEffect, useRef } from "react";
import Container from "../../components/Container";
import { ContainerProps } from "../../types/container";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ItemsProps } from "../../types/items";
import { BoardsProps } from "../../types/boards";
import ContainerDropArea from "../../components/container_drop_area";
import Layout from "../../layouts/Layout";
import taskData from "../../data/Tasks.json";
import containerData from "../../data/Containers.json";
import boardsData from "../../data/Boards.json";

interface ViewBoardProps {
  params: Promise<{ slug: string }>;
}

const ViewBoard = ({ params }: ViewBoardProps) => {
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const fetchSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };

    fetchSlug();
  }, [params]);

  const [showInput, setShowInput] = useState(false);
  const [container_title, setContainerTitle] = useState("");
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(
    null
  );
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeContainer, setActiveContainer] = useState<number | null>(null);
  const [draggableType, setDraggableType] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<ContainerProps>();

  const [board, setBoard] = useState<BoardsProps[]>(
    localStorage.getItem("boards")
      ? JSON.parse(localStorage.getItem("boards") as string)
      : boardsData
  );

  const [containers, setContainer] = useState<ContainerProps[]>(
    localStorage.getItem("containers")
      ? JSON.parse(localStorage.getItem("containers") as string)
      : containerData
  );

  const [tasks, setTask] = useState<ItemsProps[]>(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") as string)
      : taskData
  );

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("containers", JSON.stringify(containers));
  }, [tasks, containers]);

  const saveContainer = (container_id: number | null, board_id: number) => {
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
        board_id: board_id,
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

  const containerModalRef = useRef<HTMLDialogElement | null>(null);

  const openDeleteContainerModal = (id: number) => {
    setSelectedContainer(containers.find((container) => container.id === id));
    containerModalRef.current?.showModal();
  };

  const deleteContainer = () => {
    if (!selectedContainer) return;
    // Delete all tasks in the container
    const updatedTasks = tasks.filter(
      (task) => task.container_id !== selectedContainer?.id
    );
    setTask(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Delete the container
    const updatedContainers = containers.filter(
      (container) => container.id !== selectedContainer?.id
    );
    setContainer(updatedContainers);
    localStorage.setItem("containers", JSON.stringify(updatedContainers));

    setSelectedContainer(undefined); // Clear the selected container
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

    // console.log("Updated Containers:", updatedContainers);
    // console.log("Updated Tasks:", updatedTasks);
  };

  return (
    <Layout>
      <div>
        <h1 className="font-bold text-gray-900 text-3xl mb-6 dark:text-gray-200">
          {board.find((b) => b.id === Number(slug))?.name}
        </h1>
        {/* Board Container - Horizontally scrollable */}
        <div
          ref={containerListRef}
          className="bg-gray-300 flex flex-row gap-5 p-4 items-start overflow-scroll h-[30rem]"
        >
          <ContainerDropArea
            onDrop={() => {
              onDropContainer(0);
            }}
            draggableType={draggableType}
          />
          {containers.map(
            (container: ContainerProps, index: number) =>
              Number(slug) === container.board_id && (
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
                    className="bg-white shadow-lg rounded-lg p-4 hover:cursor-grab z-50"
                  >
                    <div className="flex flex-row justify-between items-between pb-2">
                      <div className="flex items-center gap-2">
                        {/* Drag Handle (Optional: Only This is Draggable) */}
                        <div
                          className="cursor-grab hover:bg-gray-200 rounded-md"
                          onMouseDown={(e) => e.stopPropagation()}
                        ></div>
                        {isEditingContainer &&
                        container.id == selectedContainerId ? (
                          <div className="w-full flex items-center justify-between gap-3 bg-white p-3 shadow-md rounded-lg">
                            {/* Input Field */}
                            <input
                              value={container_title}
                              onChange={(e) =>
                                setContainerTitle(e.target.value)
                              }
                              type="text"
                              placeholder="Enter Title..."
                              className="input input-bordered w-full text-sm p-3 rounded-md border-gray-300 focus:ring focus:ring-green-300 focus:outline-none z-50"
                            />

                            {/* Save Button */}
                            <button
                              onClick={() =>
                                saveContainer(container.id, Number(slug))
                              }
                              className="text-green-700 hover:text-green-800 transition duration-200 p-2 rounded-full bg-green-100 hover:bg-green-200"
                            >
                              <CheckCircleIcon className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <h2
                            onClick={() =>
                              openInputContainerEditForm(container.id)
                            }
                            className="font-bold text-lg text-gray-800 mb-3 z-0 hover:cursor-text"
                          >
                            {container.title}
                          </h2>
                        )}
                      </div>
                      <button
                        className={
                          isEditingContainer &&
                          container.id == selectedContainerId
                            ? "hidden"
                            : "text-red-700"
                        }
                        onClick={() => {
                          openDeleteContainerModal(container.id);
                        }}
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
              )
          )}

          {/* Add New List Button */}
          <div className="w-max bg-gray-200 shadow-md rounded-lg p-4 flex flex-col justify-center items-center w-60 z-50">
            {showInput && (
              <div className="mt-3 w-60">
                <input
                  value={container_title}
                  onChange={(e) => setContainerTitle(e.target.value)}
                  type="text"
                  placeholder="New list"
                  className="input input-bordered w-full text-sm p-2 rounded-md "
                />
                <div className="flex flex-wrap w-full">
                  <button
                    className="btn btn-primary w-full mt-2 text-sm"
                    onClick={() => saveContainer(null, Number(slug))}
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
      <dialog ref={containerModalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete selected board</h3>
          <p className="py-4">
            Are you sure you want to delete this container "
            {selectedContainer?.title}"?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-success" onClick={deleteContainer}>
                  Delete
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </Layout>
  );
};

export default ViewBoard;
