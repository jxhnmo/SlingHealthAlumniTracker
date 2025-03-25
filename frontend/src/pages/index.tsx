import React, { useState, useEffect } from "react";
import Link from "next/link";

const IndexPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser); // Parse JSON string
        setIsAuthenticated(true);
        setUserName(user.full_name);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* Background Image */}
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

      {/* Navigation */}
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {isAuthenticated ? (
          <>
            <Link
              href="/"
              className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/userIndex"
              className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
            >
              Index
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
            >
              Profile
            </Link>
            <Link
              href="/logout"
              className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative w-screen h-screen px-[5%] flex flex-col justify-center items-center gap-[48px] p-10 z-10">
        <h1 className="text-center text-9xl font-bold text-[--white] mb-8">
          Alumni Tracker
        </h1>

        <div className="mt-12">
          {isAuthenticated ? (
            <div className="text-center">
              <p className="text-5xl font-semibold text-white">Welcome,</p>
              <p className="text-5xl font-semibold text-[--popcol]">{userName}</p>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-block px-10 py-5 text-xl font-bold text-[--popcol] bg-[--dark2] rounded-2xl shadow-xl transition-transform hover:bg-[--popcol] hover:text-[--dark2] hover:scale-110"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
