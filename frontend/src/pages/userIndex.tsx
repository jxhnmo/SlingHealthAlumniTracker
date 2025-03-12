import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Users {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
}

const UserIndex: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumnitrackertest-958bb6be1026.herokuapp.com";
    console.log(API_BASE_URL);
    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/background.jpg')" }}
      /> */}

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
            className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition 
                       hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="w-screen h-screen px-[5%] flex flex-col justify-start items-center gap-[48px] p-10">
        <div className="mt-5 pt-[12px]">
          <h1 className="text-center text-5xl font-bold text-white">Directory</h1>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="gap-[12px] h-[100%] flex flex-col overflow-y-scroll overflow-x-hidden relative">
            {filteredUsers.map((user: Users, i) => (
              <div
                key={i}
                className="relative w-full h-[20%] mr-[4px] border-4 border-[--grey1] rounded-[15px] cursor-pointer hover:border-[--popcol] hover:text-[--popcol] flex"
              >
                <Link href={`/profiles/${user.id}`} passHref>
                  <div className="w-full h-full flex">
                    <div className="w-[auto] min-w-[64px] h-full flex flex-col">
                      <img
                        src={user.user_profile_url}
                        alt={user.name}
                        className="w-auto h-full rounded-l-[10px] object-cover aspect-square"
                      />
                    </div>
                    <div className="w-[auto] h-full flex flex-col pl-[24px] gap-[12px] justify-center">
                      <h2 className="text-2xl">{user.name}</h2>
                      <h3 className="text-lg">{user.graduation_year}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIndex;
