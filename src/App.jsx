import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import Ideas from "./pages/Ideas";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/login" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;