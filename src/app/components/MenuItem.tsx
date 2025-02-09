import Link from "next/link";

interface MenuItemProps {
  isCollapsed: boolean;
  title: string;
  children?: React.ReactNode;
  route: string;
  activeRoute: string;
}

const MenuItem = ({ isCollapsed, title, children, route, activeRoute }: MenuItemProps) => {
  return (
    <Link href={route}>
      <div className="p-2 border-5 flex flex-col">
        <div className={`flex flex-row items-center justify-between gap-2 hover:bg-gray-200 p-2 transition-all duration-300 ease-in-out transition rounded-xl`}>
          <div className="flex flex-row items-center">
            {children}
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
    </Link>
  );
};

export default MenuItem;
