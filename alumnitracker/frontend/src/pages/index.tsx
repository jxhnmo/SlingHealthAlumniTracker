import React from "react";

const IndexPage: React.FC = () => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />

      <div className="relative z-10 w-[60%] h-[80%] flex flex-col justify-center items-center">
        <h1 className="text-center text-7xl font-bold text-white">
          Alumni Tracker
        </h1>
      </div>
    </div>
  );
};

export default IndexPage;
