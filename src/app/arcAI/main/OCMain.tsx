"use cient";

import initOpenCascade from "opencascade.js";
import init from "opencascade.js/dist/opencascade.full";
import React, { useEffect } from "react";

const OCMain = () => {
  useEffect(() => {
    // window.OPENCASCADE_BASE_URL = "/opencascade";

    const loadOpenCascadde = async () => {
      const oc = await initOpenCascade({
        mainJS: init(),
        mainWasm: "/opencascade/opencascade.full.wasm",
      });

      console.log(oc);
    };

    loadOpenCascadde();
  }, []);

  return <></>;
};

export default OCMain;
