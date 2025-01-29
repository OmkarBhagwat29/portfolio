import React from "react";
import Kia from "./kia";

import fs from "fs";
import path from "path";

const page = () => {
  const directory = "images/kia";
  const publicDirectory = path.join(process.cwd(), "public", directory);
  // console.log(publicDirectory);
  const images = fs
    .readdirSync(publicDirectory)
    .filter((file) =>
      [".jpg", ".jpeg", ".png", ".webp"].includes(
        path.extname(file).toLowerCase()
      )
    );

  return (
    <>
      <Kia imageNames={images} />
    </>
  );
};

export default page;
