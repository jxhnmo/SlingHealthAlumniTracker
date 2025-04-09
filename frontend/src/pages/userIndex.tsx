import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
  biography?: string;
  isfaculty?: boolean;
  achievements?: Achievement[];
  contact_info?: ContactMethod[];
  availability?: boolean;
  achievements_attributes?: Omit<Achievement, "id">[];
  contacts_attributes?: Omit<ContactMethod, "id">[];
  teams_attributes?: Omit<Team, "id">[];
  team?: Team;
}

interface Achievement {
  id: number;
  achievement_type: "Pitches" | "Grants" | "Accelerator" | "Other Achievements";
  name: string;
  description: string;
  // checked: boolean;
  user_id: number;
}

interface ContactMethod {
  id: number;
  contact_type: string;
  info: string;
  user_id: number;
  is_link: boolean;
}

interface Team {
  id: number;
  team_name: string;
  team_area?: string;
  user_id: number;
}

const UserIndex: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [achievementSelector, setAchievementSelector] = useState("None");
  const [yearSearch, setYearSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [searchOptions, setSearchOptions] = useState(false);

  useEffect(() => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://alumni-tracker-sprint3-84062556e525.herokuapp.com";
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

        const localUser = localStorage.getItem("user");
        if (localUser) {
          const parseUser = JSON.parse(localUser);
          const userEmail = parseUser.email;
          console.log("Logged-in user email:", userEmail);
          if (userEmail) {
            const user = usersData.find((u: Users) => u.email === userEmail);
            console.log("Matched User:", user);
            if (user) setUserId(user.id);
          }
        }

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
      const userMatches = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const userAchievements = achievements.filter(
        (ach) => ach.user_id === user.id
      );
      const achievementMatches = userAchievements.some((ach) =>
        ach.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      //additional options
      const achievementTypeMatches =
        !searchOptions ||
        achievementSelector === "None" ||
        (!achievementSelector && userAchievements.length > 0) ||
        userAchievements.some(
          (ach) => ach.achievement_type === achievementSelector
        );
      const yearMatch =
        !searchOptions ||
        yearSearch === "" ||
        user.graduation_year === Number(yearSearch);
      const keywordMatch =
        !searchOptions ||
        user.biography?.toLowerCase().includes(keywordSearch.toLowerCase()) ||
        userAchievements.some((ach) =>
          ach.description.toLowerCase().includes(keywordSearch.toLowerCase())
        );

      return (
        (userMatches || achievementMatches) &&
        achievementTypeMatches &&
        yearMatch &&
        keywordMatch
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {[
          { name: "Home", path: "/" },
          { name: "Directory", path: "/userIndex" },
          { name: "Profile", path: userId ? `/profiles/${userId}` : "#" },
          { name: "Logout", path: "/logout" },
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
          <h1 className="text-center text-5xl font-bold text-white">
            Directory
          </h1>
        </div>

        <div className="flex justify-center gap-2">
          <div>
            <button
              className="px-4 py-2 bg-[--popcol] text-[--background] rounded-md shadow-lg"
              onClick={() => setSearchOptions((prev) => !prev)}
            >
              {searchOptions ? "Hide" : "Options"}
            </button>
          </div>

          <div>
            {searchOptions ? (
              <select
                className="w-16"
                value={achievementSelector}
                onChange={(e) => {
                  setAchievementSelector(e.target.value);
                }}
              >
                <option value="None">...</option>
                <option value="">All Achievements</option>
                <option value="Pitches">Pitches</option>
                <option value="Grants">Grants</option>
                <option value="Accelerator">Accelerator</option>
                <option value="Other Achievements">Other Achievements</option>
              </select>
            ) : (
              <></>
            )}
          </div>

          {searchOptions ? (
            <div className="w-min">
              <input
                type="text"
                placeholder="Search for by name or achievement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <input
                type="text"
                placeholder="Specify with keywords..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                className="mt-2"
              />
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search for other users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          )}

          {searchOptions ? (
            <div>
              <input
                type="text"
                placeholder="Graduation Year..."
                value={yearSearch}
                onChange={(e) => setYearSearch(e.target.value)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="gap-[12px] h-[100%] flex flex-col overflow-y-scroll overflow-x-hidden relative">
            {filteredUsers.map((user) => (
              <Link
                href={`/profiles/${user.id}`}
                key={user.id}
                className="relative w-full h-[20%] border-4 border-[--grey1] rounded-[15px] cursor-pointer hover:border-[--popcol] hover:text-[--popcol] flex"
              >
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIndex;
