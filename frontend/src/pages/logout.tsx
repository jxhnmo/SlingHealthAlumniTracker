import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Logout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear the user session or authentication data from localStorage
    localStorage.removeItem("user");

    // Optionally, clear cookies or tokens if using them
    // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to localhost:3000 after logout
    router.push("http://https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com");
  }, [router]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-3xl">Logging out...</h1>
    </div>
  );
};

export default Logout;  
