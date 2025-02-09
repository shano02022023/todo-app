"use client";

import React, { useState, useEffect, useRef } from "react";
import Container from "./components/Container";
import { ContainerProps } from "../app/types/container";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ItemsProps } from "../app/types/items";
import { BoardsProps } from "../app/types/boards";
import Layout from "./layouts/Layout";
import tasksData from "./data/Tasks.json";
import containerData from "./data/Containers.json"
import boardsData from "./data/Boards.json"

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [container_title, setContainerTitle] = useState("");
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(
    null
  );
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeContainer, setActiveContainer] = useState<number | null>(null);
  const [draggableType, setDraggableType] = useState<string | null>(null);

  const [boards, setBoards] = useState<BoardsProps[]>(boardsData);

  const [containers, setContainer] = useState<ContainerProps[]>(containerData);

  const [tasks, setTask] = useState<ItemsProps[]>(tasksData);

  const saveContainer = (container_id: number | null) => {
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
        board_id: 1, // Hardcoded for now
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

  const deleteContainer = (id: number) => () => {
    // Delete all tasks in the container
    const updatedTasks = tasks.filter((task) => task.container_id !== id);
    setTask(updatedTasks);

    // Delete the container
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    setContainer(updatedContainers);
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

    console.log("Updated Containers:", updatedContainers);
    console.log("Updated Tasks:", updatedTasks);
  };

  return (
    <Layout>
      <div>
        <h1 className="font-bold text-gray-900 text-3xl mb-6 dark:text-gray-200">
          Home
        </h1>
        Welcome to the home page
      </div>
    </Layout>
  );
}
