"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

const ObjectDetection = () => {
  const [model, setModel] = useState<any | null>(null);
  const [run, setRun] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!model) return;

    // turn on web cam and keep detecting what is show in the cam

    const startWebcam = async () => {
      const video = videoRef.current;

      if (!video) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        video.srcObject = stream;
        video.play();
      } catch (er) {
        console.log("error accessing webcam", er);
      }
    };

    startWebcam();
  }, [model]);

  //result

  useEffect(() => {}, [model]);

  useEffect(() => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    let isRunning = true;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const detectObjects = async () => {
      if (!isRunning) return; // Stop when `run` is false

      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const timeStart = performance.now();
      const prediction = await model.detect(videoRef.current);
      const timeEnd = performance.now();

      const timeTaken = timeEnd - timeStart;
      console.log(`time taken ${timeTaken} ms`);
      console.log(`Frames per sec: ${1000 / timeTaken}`);

      /* Result writing to console */
      //console.log("Predictions: ", prediction);

      if (prediction.length) {
        prediction.forEach((element) => {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          ctx.strokeRect(
            element.bbox[0],
            element.bbox[1],
            element.bbox[2],
            element.bbox[3]
          );

          ctx.fillStyle = "red";

          ctx.fillText(
            `${element.class} (${Math.round(element.score * 100)}%)`,
            element.bbox[0],
            element.bbox[1] > 10 ? element.bbox[1] - 5 : 10
          );

          ctx.font = "bold 24px serif";
        });
      }

      requestRef.current = requestAnimationFrame(detectObjects);
    };

    if (run) {
      detectObjects();
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      isRunning = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [model, run]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"
        strategy="beforeInteractive"
        onLoad={() => console.log("TensorflowJs loaded")}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"
        strategy="afterInteractive"
        onLoad={async (e) => {
          const loadedModel = await window.cocoSsd.load();
          setModel(loadedModel);
        }}
      />

      <div>
        <h1>COCO-SSD object detection</h1>
        {model ? <p>Model is Ready!</p> : <p>Loading Model...</p>}
      </div>

      {/* video feed */}
      <video ref={videoRef} className="hidden" />

      {/* canvas for drawing detection */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border-red-100"
      />

      <button
        className="flex mx-5 my-2 px-5 py-1 bg-cyan-900 text-white cursor-pointer rounded-xl left-10"
        onClick={() => setRun(!run)}
      >
        {run ? "Stop" : "Start Detection"}
      </button>
    </>
  );
};

export default ObjectDetection;
