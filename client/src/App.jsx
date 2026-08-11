import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import MyPresentations from "./pages/MyPresentations";
import Presentation from "./pages/Presentation";
import ProtectedRoute from "./component/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/ppt" element={<ProtectedRoute><MyPresentations /></ProtectedRoute>} />
        <Route path="/ppt/:id" element={<ProtectedRoute><Presentation /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
