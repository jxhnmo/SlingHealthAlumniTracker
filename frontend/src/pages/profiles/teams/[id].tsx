import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
  biography?: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  members: User[];
}

const Teams: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/*Nav*/}
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
        <h1 className="text-center text-5xl font-bold text-white">Teams</h1>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="w-full flex justify-end p-2">
            {user && (
              <Link
                href={`profiles/teams/edit/${id}`}
                className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                             hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
              >
                Edit Teams
              </Link>
            )}
          </div>

          <div className="w-full h-full flex flex-col items-center gap-5">
            {teams.length > 0 ? (
              <ul className="list-disc pl-5">
                {teams.map((team) => (
                  <li key={team.id}>
                    <h2>{team.name}</h2>
                    <p>{team.description}</p>
                    <ul>
                      {team.members.map((member) => (
                        <li key={member.id}>
                          <Link href={`/profiles/${member.id}`}>
                            <img
                              src={member.user_profile_url}
                              title={member.name}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No teams found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
