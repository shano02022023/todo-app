"use client";
import { useState } from "react";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  HomeIcon,
  InformationCircleIcon
} from "@heroicons/react/24/solid";
import Drawer from "../components/Drawer";
import MenuItem from "../components/MenuItem";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true);

  const currentRoute = window.location.pathname;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);

    if (!isCollapsed) {
      setIsDrawerCollapsed(true);
    }
  };

  return (
    <div className="flex">
      <div
        className={`transition-all duration-300 ease-in-out transition h-screen dark:bg-gray-800 bg-gray-200 relative ${
          isCollapsed ? "w-20" : "w-56"
        }`}
      >
        <button
          className="absolute top-9 w-7 cursor-pointer right-1"
          onClick={() => {
            toggleCollapse();
          }}
        >
          {isCollapsed ? (
            <ArrowRightCircleIcon className="w-10 h-10" />
          ) : (
            <ArrowLeftCircleIcon className="w-10 h-10" />
          )}
        </button>
        <div className="flex flex-col pt-20">
          <MenuItem title="Home" isCollapsed={isCollapsed} route="/" activeRoute={currentRoute}>
            <HomeIcon className="w-10 h-10" />
          </MenuItem>
          <Drawer
            title="Boards"
            setIsCollapsed={setIsCollapsed}
            isCollapsed={isCollapsed}
            setIsDrawerCollapsed={setIsDrawerCollapsed}
            isDrawerCollapsed={isDrawerCollapsed}
          />
          <MenuItem title="About" isCollapsed={isCollapsed} route="/about" activeRoute={currentRoute}>
            <InformationCircleIcon className="w-10 h-10" />
          </MenuItem>
        </div>
      </div>
      <div className="p-7 h-screen w-9/12 flex-1">{children}</div>
    </div>
  );
}
