import { useState } from "react";
import { XCircleIcon, PencilIcon, StarIcon } from "@heroicons/react/24/solid";

interface SingleTaskProps {
  taskProps: {
    id: number;
    title: string;
    description: string;
    isFavorite: boolean;
    container_id: number;
  };
  showSelectedTasksId: number | null;
  saveTask: (id: number) => void; // Function to save or update task
  closeInputForm: () => void; // Function to close the input form
  addToFavorites: (id: number) => void; // Function to toggle favorite status
  deleteTasks: (id: number) => void; // Function to delete a task
  showTaskOption: (id: number) => void; // Function to toggle edit mode
  setActiveCard: (index: number | null) => void;
  activeCard: number | null;
  setDraggableType: (type: string | null) => void;
  draggableType: string | null;
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  taskDescription: string;
  setTaskDescription: (description: string) => void;
  index: number;
}

export default function SingleTask({
  taskProps,
  showSelectedTasksId,
  saveTask,
  closeInputForm,
  addToFavorites,
  deleteTasks,
  showTaskOption,
  setActiveCard,
  activeCard,
  setDraggableType,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  index
}: SingleTaskProps) {
  return (
    <li
      className={
        activeCard === taskProps.id
          ? "hover:bg-gray-400 hover:p-3 hover:rounded-lg transition transition-all bg-gray-200 p-3 rounded-lg shadow-md hover:cursor-move transform scale-105"
          : "hover:bg-gray-400 hover:p-3 hover:rounded-lg transition transition-all bg-gray-200 p-3 rounded-lg shadow-md hover:cursor-grab"
      }
      draggable
      onDrag={() => {
        setActiveCard(index), setDraggableType("task");
      }}
      onDragEnd={() => {
        setActiveCard(null), setDraggableType(null);
      }}
    >
      {/* Show task details only when the task is selected for editing */}
      {showSelectedTasksId === taskProps.id ? (
        <div className="mt-3 flex flex-col gap-5 rounded-xl">
          <form onSubmit={() => saveTask(taskProps.id)}>
            <div className="flex flex-col gap-5">
              <span className="text-black">Edit task</span>
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                type="text"
                placeholder="Title"
                className="input input-bordered w-full text-sm p-2 rounded-md"
              />
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="textarea w-full text-sm p-2 rounded-md"
                placeholder="Description"
              ></textarea>
            </div>
            <div className="flex flex-wrap w-full">
              <button
                className="btn btn-primary w-full mt-2 text-sm"
                type="submit"
              >
                Save Changes
              </button>
              <button
                className="btn btn-error w-full mt-2 text-sm hover"
                onClick={() => closeInputForm()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex flex-row items-between justify-between">
            <h6 className="font-bold text-sm text-gray-900">
              {taskProps.title}
            </h6>
            <div className="flex flex-row gap-2 z-10">
              <button
                onClick={() => addToFavorites(taskProps.id)}
                className={
                  taskProps.isFavorite ? "text-yellow-400" : "text-gray-600"
                }
              >
                <StarIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => showTaskOption(taskProps.id)}
                className="text-black"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                className="text-red-700"
                onClick={() => deleteTasks(taskProps.id)}
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-700">{taskProps.description}</p>
        </div>
      )}
    </li>
  );
}
