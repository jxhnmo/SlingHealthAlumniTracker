import React from "react";
import Link from "next/link";

const IndexPage: React.FC = () => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/background.jpg')" }}
      /> */}

      {/* nav */}
      <nav className="absolute top-5 right-10 flex gap-3">
        {[
          { name: "Home", path: "/" },
          { name: "Index", path: "/userIndex" },
          { name: "Profile", path: "/profile" },
          { name: "Login", path: "/login" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition 
                       hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="w-screen h-screen px-[5%] flex flex-col justify-center items-center gap-[48px] p-10">
        {/* Alumni Tracker Header */}
        <h1 className="text-center text-7xl font-bold text-white mb-8">
          Alumni Tracker
        </h1>

        {/* Separate Div for Login Button */}
        <div className="mt-20">
          <Link
            href="/login"
            className="inline-block px-10 py-5 text-xl font-bold text-[--popcol] bg-[--dark2] rounded-2xl shadow-xl transition-transform 
               hover:bg-[--popcol] hover:text-[--dark2] hover:scale-110"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
