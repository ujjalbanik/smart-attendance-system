import * as faceapi from "face-api.js";
import { useEffect, useRef } from "react";

export default function Camera() {
  const videoRef = useRef(null);
  const deviceId = useRef("");

  useEffect(() => {
    loadModels();
    startCamera();
    deviceId.current =
      localStorage.getItem("deviceId") || "YOUR_DEVICE_ID";
  }, []);

  // 🔊 Voice Function
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  // 📦 Load FaceAPI Models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("✅ Models Loaded");
  };

  // 🎥 Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // 🟢 VERIFY FACE (Attendance Marking)
const verifyFace = async () => {
  if (!videoRef.current) return;

  try {
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

    const response = await fetch("http://127.0.0.1:8000/api/mark-attendance/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        face_embedding: Array.from(detection.descriptor),
      }),
    });

    const data = await response.json();

    console.log("Backend response:", data);

    if (response.ok) {
      alert(`✅ ${data.message}`);
    } else {
      alert(`❌ ${data.error || data.message}`);
    }

  } catch (error) {
    console.error("Verification error:", error);
    alert("Error verifying face");
  }
};

  // 🟡 REGISTER STUDENT FACE
  const registerFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection || !detection.descriptor) {
      alert("No face detected");
      speak("No face detected");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register-student/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: prompt("Enter student name:"),
            roll_no: prompt("Enter roll number:"),
            course: prompt("Enter course:"),
            batch: prompt("Enter batch:"),
            face_embedding: Array.from(detection.descriptor),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Student Registered Successfully");
        speak("Student registered successfully");
      } else {
        alert(`❌ ${JSON.stringify(data)}`);
        speak("Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error registering face");
    }

    console.log("Descriptor length:", detection.descriptor.length);
  };

  return (
    <>
      <h1>Smart Attendance Kiosk</h1>
      <video ref={videoRef} autoPlay muted width="400" />
      <br />
      <button onClick={verifyFace}>Verify Face</button>
      <button onClick={registerFace}>Register Face</button>
    </>
  );
}
