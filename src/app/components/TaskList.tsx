import { useState, useEffect, useRef } from "react";
import { Items } from "../types/items";
import { XCircleIcon, PencilIcon, StarIcon } from "@heroicons/react/24/solid";

interface TaskListProps {
  container: { id: number; title: string; items: Items[] };
}

export default function TaskList({ container }: TaskListProps) {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [showSelectedTasksId, setShowSelectedTasksId] = useState<number | null>(
    null
  );
  const [isFavoriteTask, setIsFavoriteTask] = useState(false);

  // const [isEditingContainer, setIsEditingContainer] = useState(false);
  // const [containerTitle, setContainerTitle] = useState(container.title);

  const [tasks, setTask] = useState<Items[]>(container.items);

  const saveTask = (id: number) => {
    if (id !== 0) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, title: taskTitle, description: taskDescription };
        }
        return task;
      });

      setTask(updatedTasks);
    } else {
      const newTask: Items = {
        id: tasks.length + 1,
        title: taskTitle,
        description: taskDescription,
      };

      setTask([...tasks, newTask]);
    }

    setTaskTitle("");
    setTaskDescription("");
    setShowSelectedTasksId(null);
    setShowInput(false);
  };

  const showTaskOption = (id: number) => {
    if (showSelectedTasksId === id) {
      setShowSelectedTasksId(null);
    } else {
      setShowSelectedTasksId(id);
      const taskToEdit = tasks.find((task) => task.id === id);
      if (taskToEdit) {
        setTaskTitle(taskToEdit.title);
        setTaskDescription(taskToEdit.description);
      }
    }
  };

  const deleteTasks = (task_id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== task_id);
    setTask(updatedTasks);
  };

  const closeInputForm = () => {
    setShowInput(false);
    setShowSelectedTasksId(null);
    setTaskDescription("");
    setTaskTitle("");
  };

  const addToFavorites = (id: number) => {
    setTask((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isFavorite: !task.isFavorite } : task
      )
    );
  };

  // const openInputContainerEditForm = () => {
  //   setIsEditingContainer(!isEditingContainer);
  //   setContainerTitle(container.title);
  // };

  // const taskListRef = useRef<HTMLDivElement | null>(null);

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     taskListRef.current &&
  //     !taskListRef.current.contains(event.target as Node)
  //   ) {
  //     setIsEditingContainer(false);
  //     const updateContainerTitle = containers.map((container) => {
  //       if (container.id === container.id) {
  //         console.log(container);
  //         return { ...container, title: containerTitle };
  //       }
  //       return container;
  //     });

  //     setContainer(updateContainerTitle);
  //   }
  // };

  // useEffect(() => {
  //   if (isEditingContainer) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isEditingContainer]);

  return (
    <div
    // ref={taskListRef}
    // className="w-72 bg-white shadow-lg rounded-lg p-4 flex flex-col"
    >
      {/* Task Cards */}
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-200 p-3 rounded-lg shadow-md">
            <div>
              {/* Show task details only when the task is selected for editing */}
              {showSelectedTasksId === task.id ? (
                <div className="mt-3 flex flex-col gap-5 bg-gray-300 rounded-xl p-5">
                  <form onSubmit={() => saveTask(task.id)}>
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
                    <div className="flex flex-wrap w-full">
                      <button
                        className="btn btn-primary w-full mt-2 text-sm"
                        type="submit"
                      >
                        Save Changes
                      </button>
                      <button
                        className="btn btn-error w-full mt-2 text-sm"
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
                      {task.title}
                    </h6>
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() => addToFavorites(task.id)}
                        className={
                          task.isFavorite ? "text-yellow-400" : "text-gray-600"
                        }
                      >
                        <StarIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => showTaskOption(task.id)}
                        className="text-black"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-700"
                        onClick={() => deleteTasks(task.id)}
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">{task.description}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Add Task Input - Hidden Initially */}
      {showInput && showSelectedTasksId === null && (
        <div className="mt-3 flex flex-col gap-5 bg-gray-300 rounded-xl p-5">
          <span className="text-black">Create new task</span>
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
          <div className="flex flex-wrap w-full">
            <button
              className="btn btn-primary w-full mt-2 text-sm"
              onClick={() => saveTask(0)}
            >
              Add Task
            </button>
            <button
              className="btn btn-error w-full mt-2 text-sm"
              onClick={() => closeInputForm()}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show Input Button */}
      {!showInput && !showSelectedTasksId && (
        <button
          className="btn btn-outline btn-primary w-full mt-3 text-sm"
          onClick={() => setShowInput(true)}
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
