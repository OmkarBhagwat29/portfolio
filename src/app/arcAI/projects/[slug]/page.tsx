"use client";
import React from "react";
import OCMain from "../../main/OCMain";

const page = async ({ params }: { params: Promise<string> }) => {
  const projectUuid = (await params).slug;

  return (
    <>
      <OCMain />
    </>
  );
};

export default page;
