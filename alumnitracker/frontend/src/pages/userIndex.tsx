import React from "react";
import Link from "next/link";

interface Users {
  user_profile_url: string;
  name: string;
  year: string;
}

const userIndex: React.FC = () => {
  const users: Users[] = [
    {
      user_profile_url: "/profilePix/sabrinacarpenter.jpg",
      name: "Sabrina Carpet",
      year: "2024",
    },
    {
      user_profile_url: "/profilePix/tatemcrae.jpg",
      name: "Tate McRae",
      year: "2024",
    },
  ];

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
          <h1 className="text-center text-5xl font-bold text-white">
            User Index
          </h1>
        </div>
        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="pb-[12px] gap-[12px] h-[100%] flex flex-col">
            {users.map((user: Users, i) => {
              return (
                <div
                  className="w-[full] min-h-[10%] border-4 border-[--grey1] rounded-[15px] cursor-pointer hover:scale-[1.02] hover:border-[--popcol] hover:text-[--popcol] flex"
                  key={i}
                >
                  <div className="w-[10%] min-w-[64px] h-full flex flex-col">
                    <img
                      src={user.user_profile_url}
                      alt={user.name}
                      className="w-full h-full rounded-l-[10px] object-cover aspect-square"
                    />
                  </div>
                  <div className="w-[auto] h-full flex flex-col pl-[24px] gap-[12px] justify-center">
                    <h2 className="text-2xl">{user.name}</h2>
                    <h3 className="text-lg">{user.year}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default userIndex;
