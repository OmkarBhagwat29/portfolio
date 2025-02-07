"use client";
import Script from "next/script";
import React, { useEffect, useState } from "react";

const LoadTFModels = () => {
  const [tfLoaded, setTfLoaded] = useState(false);
  const [model, setModel] = useState<any | null>(null);

  useEffect(() => {
    if (!tfLoaded || !window?.tf) return;

    const loadModel = async () => {
      try {
        const modelPath = `https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/sqftToPropertyPrice/model.json`;
        const m = await window.tf.loadLayersModel(modelPath);

        console.log("Model Loaded:");
        m.summary();

        setModel(m);

        return () => {
          model.dispose();
        };
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
  }, [tfLoaded]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("TensorflowJs loaded");
          setTfLoaded(true);
        }}
        onProgress={() => {
          console.log("loading progress");
        }}
      />

      <h1>TensorFlow Model Loader</h1>
      {tfLoaded ? <p>TensorFlow.js is ready!</p> : <p>Loading TensorFlow...</p>}
      {model ? <p>Model Loaded Successfully!</p> : <p>Loading Model...</p>}
    </>
  );
};

export default LoadTFModels;
