import React from "react";
import Link from "next/link";

const IndexPage: React.FC = () => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
          position: "absolute",
          height: "100%",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-1" />
      </div>

      {/* nav */}
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {[
          { name: "Home", path: "/" },
          { name: "Index", path: "/userIndex" },
          { name: "Profile", path: "/profile" },
          { name: "Login", path: "/login" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="relative w-screen h-screen px-[5%] flex flex-col justify-center items-center gap-[48px] p-10 z-10">
        <h1 className="text-center text-9xl font-bold text-[--white] mb-8">
          Alumni Tracker
        </h1>

        <div className="mt-20">
          <Link
            href="/login"
            className="inline-block px-10 py-5 text-xl font-bold text-[--popcol] bg-[--dark2] rounded-2xl shadow-xl transition-transform hover:bg-[--popcol] hover:text-[--dark2] hover:scale-110"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
