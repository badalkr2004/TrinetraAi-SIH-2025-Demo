// src/App.tsx

import Dashboard from "./components/Dashboard";
import { DisclaimerBar } from "./components/Disclaimer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <DisclaimerBar />
      <Navbar />
      <Dashboard />
    </>
  );
}

export default App;
