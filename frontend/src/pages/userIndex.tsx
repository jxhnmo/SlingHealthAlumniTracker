import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Users {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
}

interface Achievement {
  id: number;
  name: string;
  user_id: number;
}

const UserIndex: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://alumnitrackertest-958bb6be1026.herokuapp.com";

    const loadUsersAndAchievements = async () => {
      try {
        const [usersResponse, achievementsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/users`),
          fetch(`${API_BASE_URL}/achievements`),
        ]);

        if (!usersResponse.ok || !achievementsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersResponse.json();
        const achievementsData = await achievementsResponse.json();

        setUsers(usersData);
        setAchievements(achievementsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    loadUsersAndAchievements();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const userMatches = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const userAchievements = achievements.filter((ach) => ach.user_id === user.id);
      const achievementMatches = userAchievements.some((ach) =>
        ach.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return userMatches || achievementMatches;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
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

        <div>
          <input
            type="text"
            placeholder="Search by name or achievement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="gap-[12px] h-[100%] flex flex-col overflow-y-scroll overflow-x-hidden relative">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="relative w-full h-[20%] border-4 border-[--grey1] rounded-[15px] cursor-pointer hover:border-[--popcol] hover:text-[--popcol] flex"
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
