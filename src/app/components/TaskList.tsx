import { useState, useEffect, useRef } from "react";
import { Items } from "../types/items";
import { XCircleIcon, PencilIcon } from "@heroicons/react/24/solid";

interface TaskListProps {
  container: { id: number; title: string; items: Items[] };
  containers: Container[];
  setContainer: React.Dispatch<React.SetStateAction<Container[]>>;
}

export default function TaskList({
  container,
  setContainer,
  containers,
}: TaskListProps) {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [showSelectedTasksId, setShowSelectedTasksId] = useState<number | null>(
    null
  );
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [containerTitle, setContainerTitle] = useState(container.title);

  const [tasks, setNewTask] = useState<Items[]>(container.items);

  const saveTask = (id: number) => {
    if (id !== 0) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, title: taskTitle, description: taskDescription };
        }
        return task;
      });

      setNewTask(updatedTasks);
    } else {
      const newTask: Items = {
        id: tasks.length + 1,
        title: taskTitle,
        description: taskDescription,
      };

      setNewTask([...tasks, newTask]);
    }

    setTaskTitle("");
    setTaskDescription("");
    setShowSelectedTasksId(null);
    setShowInput(false);
  };

  const deleteContainer = (id: number) => () => {
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    setContainer(updatedContainers);
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
    setNewTask(updatedTasks);
  };

  const closeInputForm = () => {
    setShowInput(false);
    setShowSelectedTasksId(null);
    setTaskDescription("");
    setTaskTitle("");
  };

  const openInputContainerEditForm = () => {
    setIsEditingContainer(!isEditingContainer);
    setContainerTitle(container.title);
  };

  const taskListRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      taskListRef.current &&
      !taskListRef.current.contains(event.target as Node)
    ) {
      setIsEditingContainer(false);
      const updateContainerTitle = containers.map((container) => {
        if (container.id === container.id) {
          console.log(container);
          return { ...container, title: containerTitle };
        }
        return container;
      });

      setContainer(updateContainerTitle);
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
    <div
      ref={taskListRef}
      className="w-72 bg-white shadow-lg rounded-lg p-4 flex flex-col"
    >
      {/* List Title */}
      <div className="flex flex-row justify-between items-between pb-5">
        <div>
          {isEditingContainer ? (
            <input
              value={containerTitle}
              onChange={(e) => setContainerTitle(e.target.value)}
              type="text"
              placeholder="Title"
              className="input input-bordered w-full text-sm p-2 rounded-md"
            />
          ) : (
            <h2
              onClick={() => openInputContainerEditForm()}
              className="font-bold text-lg text-gray-800 mb-3"
            >
              {container.title}
            </h2>
          )}
        </div>
        <button
          className="text-red-700"
          onClick={deleteContainer(container.id)}
        >
          <XCircleIcon className="w-7 h-7" />
        </button>
      </div>

      {/* Task Cards */}
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-200 p-3 rounded-lg shadow-md">
            <div>
              {/* Show task details only when the task is selected for editing */}
              {showSelectedTasksId === task.id ? (
                <div className="mt-3 flex flex-col gap-5 bg-gray-300 rounded-xl p-5">
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
                      onClick={() => saveTask(task.id)}
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
                </div>
              ) : (
                <div>
                  <div className="flex flex-row items-between justify-between">
                    <h6 className="font-bold text-sm text-gray-900">
                      {task.title}
                    </h6>
                    <div className="flex flex-row gap-2">
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
