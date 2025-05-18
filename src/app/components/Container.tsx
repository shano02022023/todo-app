import React, { useState, useRef } from "react";
import { ItemsProps } from "../types/items";
import SingleTask from "./SingleTask";
import DropArea from "./drop_area";

interface ContainerProps {
  tasks: ItemsProps[];
  setTasks: React.Dispatch<React.SetStateAction<ItemsProps[]>>;
  container_id: number;
  setActiveCard: React.Dispatch<React.SetStateAction<number | null>>;
  activeCard: number | null;
  onDrop: (container_id: number, position: number) => void;
  setDraggableType: React.Dispatch<React.SetStateAction<string | null>>;
  draggableType: string | null;
}

export default function Container({
  tasks,
  setTasks,
  container_id,
  setActiveCard,
  activeCard,
  onDrop,
  draggableType,
  setDraggableType,
}: ContainerProps) {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [showSelectedTasksId, setShowSelectedTasksId] = useState<number | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<ItemsProps>();

  // const [isEditingContainer, setIsEditingContainer] = useState(false);
  // const [containerTitle, setContainerTitle] = useState(container.title);

  const saveTask = (id: number) => {
    if (id !== 0) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, title: taskTitle, description: taskDescription };
        }
        return task;
      });

      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } else {
      const newTask: ItemsProps = {
        id: tasks.length + 1,
        title: taskTitle,
        description: taskDescription,
        container_id: container_id,
        isFavorite: false,
      };

      setTasks([...tasks, newTask]);
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
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

  const taskModalRef = useRef<HTMLDialogElement | null>(null);

  const openDeleteTaskModal = (id: number) => {
    setSelectedTask(tasks.find((task) => task.id === id));
    taskModalRef.current?.showModal();
  };

  const deleteTasks = () => {
    const updatedTasks = tasks.filter((task) => task.id !== selectedTask?.id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const closeInputForm = () => {
    setShowInput(false);
    setShowSelectedTasksId(null);
    setTaskDescription("");
    setTaskTitle("");
  };

  const addToFavorites = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isFavorite: !task.isFavorite } : task
      )
    );

    localStorage.setItem(
      "tasks",
      JSON.stringify(
        tasks.map((task) =>
          task.id === id ? { ...task, isFavorite: !task.isFavorite } : task
        )
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

      <ul className="flex flex-col gap-3 bg-gray-100 p-2 w-60">
        <DropArea
          onDrop={() => {
            onDrop(container_id, 0);
          }}
          draggableType={draggableType}
        />
        {tasks.map(
          (task, index) =>
            container_id === task.container_id && (
              <React.Fragment key={index}>
                <SingleTask
                  activeCard={activeCard}
                  taskProps={task}
                  showSelectedTasksId={showSelectedTasksId}
                  saveTask={saveTask}
                  closeInputForm={closeInputForm}
                  addToFavorites={addToFavorites}
                  deleteTasks={openDeleteTaskModal}
                  showTaskOption={showTaskOption}
                  setActiveCard={setActiveCard}
                  draggableType={draggableType}
                  setDraggableType={setDraggableType}
                  taskTitle={taskTitle}
                  setTaskTitle={setTaskTitle}
                  taskDescription={taskDescription}
                  setTaskDescription={setTaskDescription}
                  index={index}
                />
                <DropArea
                  onDrop={() => {
                    onDrop(container_id, index + 1);
                  }}
                  draggableType={draggableType}
                />
              </React.Fragment>
            )
        )}
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
          className="btn btn-outline btn-primary w-full mt-3 text-sm z-50"
          onClick={() => setShowInput(true)}
        >
          + Add Task
        </button>
      )}
      <dialog ref={taskModalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete selected board</h3>
          <p className="py-4">
            Are you sure you want to delete this container "
            {selectedTask?.title}"?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-success" onClick={deleteTasks}>
                  Delete
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
