import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Check from "./pages/Check";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="Home" element={<Home />} />
        <Route path="Check" element={<Check />} />
      </Routes>
    </BrowserRouter>
  );
}
