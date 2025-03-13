import React from "react";
import { useAuthStore } from "../stores/useAuthStore";

const Home = () => {
  const { onlineUsers } = useAuthStore();
  return (
    <div className=" flex justify-center items-center h-screen">
      <div className="">{onlineUsers.length}</div>
    </div>
  );
};

export default Home;
