import React from "react";
import Link from "next/link";

const userIndex: React.FC = () => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/background.jpg')" }}
      /> */}

      <nav className="absolute top-5 right-10 bg-white/30 backdrop-blur-lg rounded-lg px-6 py-3 flex gap-6 text-white font-medium shadow-lg">
        <Link href="/" className="hover:text-gray-300 transition">
          Home
        </Link>
        <Link href="/userIndex" className="hover:text-gray-300 transition">
          Index
        </Link>
        <Link href="/profile" className="hover:text-gray-300 transition">
          Profile
        </Link>
        <Link href="/login" className="hover:text-gray-300 transition">
          Login
        </Link>
      </nav>

      <div className="relative z-10 w-[60%] h-[80%] flex flex-col justify-center items-center">
        <h1 className="text-center text-7xl font-bold text-white">userIndex</h1>
      </div>
    </div>
  );
};

export default userIndex;
