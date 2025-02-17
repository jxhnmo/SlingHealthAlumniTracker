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
  bio?: string;
  achievements?: string;
  contact?: string;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${id}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("User not found");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
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
        <h1 className="text-center text-5xl font-bold text-white">Profile</h1>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="w-full h-full flex flex-col items-center gap-5">
            <img
              src={user.user_profile_url}
              alt={user.name}
              className="h-[250px] w-[250px] rounded-[10px] object-cover"
            />
            <h1 className="text-3xl font-bold text-[--popcol]">{user.name}</h1>
            <h2 className="text-xl font-bold text-white">{user.major} Class of {user.graduation_year}</h2>

            <div className="w-full flex justify-between gap-5 mt-5">
              <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">Bio</h3>
                <p>{user.bio || "No bio available."}</p>
              </div>

              <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">Achievements</h3>
                <p>{user.achievements || "No achievements listed."}</p>
              </div>

              <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">Contact</h3>
                <p>{user.contact || "No contact information provided."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
