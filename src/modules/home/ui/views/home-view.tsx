"use client";

import Image from "next/image";

export const HomeView = () => {
  return (
    <div className="absolute top-0 left-0 h-screen w-full flex items-starts justify-center">
      <div
        className={
          "flex flex-col items-center text-center mt-[30vh] md:mt-[10%]"
        }
      >
        <Image
          alt="logo"
          src="/logo.png"
          width={500}
          height={500}
          className="mb-4 w-[180px]"
        />
        <h1 className="md:text-4xl text-2xl font-semibold -mt-8">
          Welcome to Vanguox
        </h1>
        <p className="text-muted-foreground md:text-base text-sm  ">
          How can I help you today?
        </p>
      </div>
    </div>
  );
};
