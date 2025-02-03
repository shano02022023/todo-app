import {
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useRef } from "react";

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
}

const Drawer = ({
  title,
  isCollapsed,
  setIsDrawerCollapsed,
  isDrawerCollapsed,
  setIsCollapsed,
}: DrawerProps) => {
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

  return (
    <div className="p-2 border-5 flex flex-col">
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
        <ul>
          <li className="dark:text-gray-900 text-gray-200 font-bold cursor-pointer">
            <div>board 1</div>
          </li>
          <li>
            <div className="dark:text-gray-900 text-gray-200 font-bold">
              board 2
            </div>
          </li>
          <li>
            <div className="dark:text-gray-900 text-gray-200 font-bold">
              board 3
            </div>
          </li>
          <li>
            <div className="dark:text-gray-900 text-gray-200 font-bold">
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
              type="text"
              placeholder="Input board name"
              className="input input-bordered w-full"
            />
          </p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-success">Save</button>
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
