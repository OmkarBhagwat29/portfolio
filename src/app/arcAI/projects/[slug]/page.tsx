import React from "react";

import Main from "../../main/Main";

const page = async ({ params }: { params: Promise<string> }) => {
  const projectUuid = (await params).slug;

  return (
    <>
      <Main />
    </>
  );
};

export default page;
