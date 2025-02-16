import Layout from "../layouts/Layout";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-200">
          About This Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg max-w-xl">
          I built this project to enhance my skills in front-end development and
          to learn React. This is my first time using the React framework, and
          this project helped me understand its concepts while building an
          interactive Kanban-style To-Do app.
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Built With
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            React 19 • Next.js • TypeScript • Tailwind CSS
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Developed by{" "}
          <span className="font-semibold">
            Graciano Bernabe T. Asuncion III
          </span>
        </p>
      </div>
    </Layout>
  );
};

export default About;
