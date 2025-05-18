import {
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import boardsData from "../data/Boards.json";
import { BoardsProps } from "../types/boards";
import { ContainerProps } from "../types/container";
import containersData from "../data/Containers.json";
import { ItemsProps } from "../types/items";
import tasksData from "../data/Tasks.json";
import { redirect } from "next/navigation";

interface DrawerProps {
  title: String;
  //   items: [
  //     {
  //       name: String;
  //       link: String;
  //     }
  //   ];
  isCollapsed: boolean;
  setIsDrawerCollapsed: (isDrawerCollapsed: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isDrawerCollapsed: boolean;
  activeRoute: string;
}

const Drawer = ({
  title,
  isCollapsed,
  setIsDrawerCollapsed,
  isDrawerCollapsed,
  setIsCollapsed,
  activeRoute,
}: DrawerProps) => {
  const [selectedBoard, setSelectedBoard] = useState<BoardsProps>();
  const [containers, setContainers] = useState<ContainerProps[]>([]);
  const [tasks, setTasks] = useState<ItemsProps[]>([]);
  const [boards, setBoards] = useState<BoardsProps[]>([]);
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContainers = localStorage.getItem("containers");
      const savedTasks = localStorage.getItem("tasks");
      const savedBoards = localStorage.getItem("boards");

      setContainers(
        savedContainers ? JSON.parse(savedContainers) : containersData
      );
      setTasks(savedTasks ? JSON.parse(savedTasks) : tasksData);
      setBoards(savedBoards ? JSON.parse(savedBoards) : boardsData);
    }
  }, []);

  const toggleDrawerCollapse = () => {
    if (isCollapsed && isDrawerCollapsed) {
      setIsCollapsed(false);
      setIsDrawerCollapsed(false);
    } else if (!isCollapsed) {
      setIsDrawerCollapsed(!isDrawerCollapsed);
    }
  };

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const deleteteModalRef = useRef<HTMLDialogElement | null>(null);

  const openDeleteModal = (id: number) => {
    setSelectedBoard(boards.find((board) => board.id === id));
    deleteteModalRef.current?.showModal();
  };

  const saveBoard = () => {
    setBoards([...boards, { id: boards.length + 1, name: boardName }]);
    localStorage.setItem(
      "boards",
      JSON.stringify([...boards, { id: boards.length + 1, name: boardName }])
    );

    setBoardName("");
  };

  const deleteBoard = () => {
    // delete tasks related to the board
    const updatedTasks = tasks.filter((task) => {
      return (
        task.container_id !==
        containers.find((container) => container.board_id === selectedBoard?.id)
          ?.id
      );
    });
    setTasks(updatedTasks);
    localStorage.setItem(
      "tasks",
      JSON.stringify(
        tasks.filter((task) => {
          return (
            task.container_id !==
            containers.find(
              (container) => container.board_id === selectedBoard?.id
            )?.id
          );
        })
      )
    );

    // delete tasks related to the board
    const updatedContainer = containers.filter((container) => {
      return container.board_id !== selectedBoard?.id;
    });
    setContainers(updatedContainer);
    localStorage.setItem(
      "containers",
      JSON.stringify(
        containers.filter(
          (container) => container.board_id !== selectedBoard?.id
        )
      )
    );

    // delete board
    setBoards(boards.filter((board) => board.id !== selectedBoard?.id));
    localStorage.setItem(
      "boards",
      JSON.stringify(boards.filter((board) => board.id !== selectedBoard?.id))
    );

    setSelectedBoard(undefined); // empty the selected board

    redirect("/");
  };

  return (
    <div className="p-2 border-5 flex flex-col cursor-pointer">
      <div
        onClick={() => {
          toggleDrawerCollapse();
        }}
        className="flex flex-row items-center justify-between gap-2 hover:bg-gray-200 p-2 transition-all duration-300 ease-in-out transition rounded-xl"
      >
        <div className="flex flex-row items-center">
          <ClipboardDocumentListIcon className="w-10 h-10" />
          <h1
            className={`font-bold transition-all duration-300 ease-in-out transition ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            {title}
          </h1>
        </div>
        <div>
          {isDrawerCollapsed ? (
            <ChevronDownIcon
              className={`w-5 h-5 ${isCollapsed ? "hidden" : ""}`}
            />
          ) : (
            <ChevronUpIcon
              className={`w-5 h-5 ${isCollapsed ? "hidden" : ""}`}
            />
          )}
        </div>
      </div>
      <div
        className={`flex flex-row transition-all duration-300 ease-in-out transition px-6 rounded-lg bg-gray-200 ${
          isDrawerCollapsed ? "hidden" : ""
        }`}
      >
        <ul className="w-full p-2">
          {boards.map((board) => (
            <li key={board.id}>
              <div
                className={`flex flex-row items-center justify-between dark:text-gray-900 text-gray-200 font-bold cursor-pointer hover:bg-gray-400 rounded-xl px-2 w-full ${
                  activeRoute === `/board/${board.id}` ? "bg-gray-500" : ""
                }`}
              >
                <Link href={`/board/${board.id}`}>
                  <div>{board.name}</div>
                </Link>
                <button
                  onClick={() => {
                    openDeleteModal(board.id);
                  }}
                >
                  <XCircleIcon className="h-5 w-5 text-red-800 cursor-pointer" />
                </button>
              </div>
            </li>
          ))}
          {/* <li className="dark:text-gray-900 text-gray-200 font-bold cursor-pointer">
            <Link href="/board">
              <div>board 1</div>
            </Link>
          </li>
          <li className="dark:text-gray-900 text-gray-200 font-bold cursor-pointer">
            <Link href="/board">
              <div>board 2</div>
            </Link>
          </li>
          <li className="dark:text-gray-900 text-gray-200 font-bold cursor-pointer">
            <Link href="/board">
              <div>board 3</div>
            </Link>
          </li> */}
          <li>
            <div className="dark:text-gray-900 text-gray-200 font-bold hover:bg-gray-400 rounded-xl px-2">
              <button onClick={openModal}>
                Add board <PlusCircleIcon className="w-5 h-5 inline-flex" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a new board</h3>
          <p className="py-4">
            <input
              onChange={(e) => setBoardName(e.target.value)}
              value={boardName}
              type="text"
              placeholder="Input board name"
              className="input input-bordered w-full"
            />
          </p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-success" onClick={saveBoard}>
                  Save
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <dialog ref={deleteteModalRef} id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete selected board</h3>
          <p className="py-4">
            Are you sure you want to delete this board "{selectedBoard?.name}"?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-success" onClick={deleteBoard}>
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
};

export default Drawer;
