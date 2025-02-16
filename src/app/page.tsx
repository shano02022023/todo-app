"use client";

import React from "react";
import Layout from "./layouts/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-200">
          Welcome to My To-Do App
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          A simple and efficient way to organize your tasks.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Built with <span className="font-semibold">React 19</span> and{" "}
          <span className="font-semibold">Next.js</span>
        </p>
      </div>
    </Layout>
  );
}
