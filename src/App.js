import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./About";
import Header from "./Header";
import Home from "./Home";


const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);

export default App;

