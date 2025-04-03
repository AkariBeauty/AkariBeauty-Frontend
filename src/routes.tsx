
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}