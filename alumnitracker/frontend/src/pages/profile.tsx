import React from "react";
import Link from "next/link";

interface User {
  user_profile_url: string;
  name: string;
  year: string;
  major: string;
  bio?: string;
  achievements?: string;
  contact?: string;
}

const Profile: React.FC = () => {
  const user: User = {
    user_profile_url: "/profilePix/sabrinacarpenter.jpg",
    name: "Sabrina Carpet",
    year: "2024",
    major: "Computer Science",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    achievements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    contact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };

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
          <h1 className="text-center text-5xl font-bold text-white">profile</h1>
        </div>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="w-full h-full flex flex-col items-center gap-5">
            <div className="h-[250px] w-[250px]">
              <img
                src={user.user_profile_url}
                alt={user.name}
                className="w-auto h-full rounded-[10px] object-cover aspect-square"
              />
            </div>
            <h1 className="text-3xl font-bold text-[--popcol]">{user.name}</h1>
            <h2 className="text-xl font-bold text-white">
              {user.major} Class of {user.year}
            </h2>

            <div className="w-full h-full flex justify-between gap-5 mt-5">
              <div className="w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Bio
                </h3>
                <p>{user.bio}</p>
              </div>

              <div className="w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Achievements
                </h3>
                <p>{user.achievements}</p>
              </div>

              <div className="w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Contact Information
                </h3>
                <p>{user.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
