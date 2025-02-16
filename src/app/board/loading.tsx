import Layout from "@/app/layouts/Layout";

const Loading = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <span className="loading loading-infinity loading-xs"></span>
        <span className="loading loading-infinity loading-sm"></span>
        <span className="loading loading-infinity loading-md"></span>
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    </Layout>
  );
};

export default Loading;
