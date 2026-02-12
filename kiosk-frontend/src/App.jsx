import Camera from "./components/Camera";

function App() {
  const handleVerify = (success) => {
    if (success) {
      alert("Face verified ✅");
    } else {
      alert("Face not detected ❌");
    }
  };

  return (
    <>
      <h1>Smart Attendance Kiosk</h1>
      <Camera onVerified={handleVerify} />
    </>
  );
}

export default App;
