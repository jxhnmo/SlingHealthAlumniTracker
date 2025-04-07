import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Logout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("user");
    // router.push("https://alumni-tracker-sprint3-84062556e525.herokuapp.com");
    router.push("http://localhost:3000");
  }, [router]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-3xl">Logging out...</h1>
    </div>
  );
};

export default Logout;  
