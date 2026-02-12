import * as faceapi from "face-api.js";
import { useEffect, useRef } from "react";

export default function Camera() {
  const videoRef = useRef();
  const deviceId = useRef("");

  useEffect(() => {
    loadModels();
    startCamera();
    // Set device ID from localStorage or environment
    deviceId.current = localStorage.getItem("deviceId") || "YOUR_DEVICE_ID";
  }, []);

  const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  window.speechSynthesis.cancel(); // stop overlapping
  window.speechSynthesis.speak(msg);
  };

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Models loaded");
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const verifyFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("Face not detected");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mark-attendance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DEVICE-ID": deviceId.current
        },
        body: JSON.stringify({
          face_embedding: Array.from(detection.descriptor)
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ ${data.error || data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying face");
    }
  };

  const registerFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register-student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: prompt("Enter student name:"),
          roll_no: prompt("Enter roll number:"),
          course: prompt("Enter course:"),
          batch: prompt("Enter batch:"),
          face_embedding: Array.from(detection.descriptor)
        })
      });

      if (response.ok) {
        if (data.message.toLowerCase().includes("login")) {
          speak("Attendance marked successfully");
        } else if (data.message.toLowerCase().includes("logout")) {
          speak("Logout recorded. Have a good day");
        } else {
          speak(data.message);
        }

        alert(`✅ ${data.message}`);
      } else {
        speak("Attendance denied");
        alert(`❌ ${data.error || data.message}`);
      }

    } catch (err) {
      console.error(err);
      alert("Error registering face");
    }
  };

  return (
    <>
      <video ref={videoRef} autoPlay muted width="400" />
      <br />
      <button onClick={verifyFace}>Verify Face</button>
      <button onClick={registerFace}>Register Face</button>
    </>
  );
}
