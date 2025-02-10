import React from "react";
import { Route, Routes } from "react-router-dom"; // Correct import!
import HomePage from "./pages/home/HomePage"; // Assuming you have this component
import LoginPage from "./pages/auth/login/LoginPage"; // And these
import SignUpPage from "./pages/auth/signup/SignUpPage"; // And these
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
// import Posts from "./components/common/Posts";

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  );
};
export default App;
