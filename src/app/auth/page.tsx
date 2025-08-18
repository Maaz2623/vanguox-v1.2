import Image from "next/image";
import React from "react";

const AuthPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="h-[85%] shadow-2xl w-[70%] border rounded-lg border-green-500 flex">
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src={`/next.svg`}
            alt="logo"
            width={500}
            height={500}
            className="w-[300px]"
          />
        </div>
        <div className="flex flex-col items-start text-center w-1/2 border p-8">
          <h1 className="text-3xl w-full text-center font-semibold">
            Create an account
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
