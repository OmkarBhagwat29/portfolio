"use client";
import { useRouter } from "next/navigation";
import React from "react";

const GuestForm = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/arcAI/projects/guest");
  };
  return (
    <div>
      <button onClick={handleClick}>As Guest</button>
    </div>
  );
};

export default GuestForm;
