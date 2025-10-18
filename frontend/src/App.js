import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppProvider from "./components/AppProvider";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Signup from "./components/Signup";
// import { Toaster } from 'react-hot-toast'; 

const App = () => (
  <Router>
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu/:vendorId" element={<Menu />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </AppProvider>
  </Router>
);

export default App;