import { HomeIcon } from "@heroicons/react/24/solid";

interface MenuItemProps {
  isCollapsed: boolean;
  title: string;
}

const MenuItem = ({ isCollapsed, title }: MenuItemProps) => {
  return (
    <div className="p-2 border-5 flex flex-col">
      <div className="flex flex-row items-center justify-between gap-2 hover:bg-gray-200 p-2 transition-all duration-300 ease-in-out transition rounded-xl">
        <div className="flex flex-row items-center">
          <HomeIcon className="w-10 h-10" />
          <h1
            className={`font-bold transition-all duration-300 ease-in-out transition ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );s
};

export default MenuItem;
