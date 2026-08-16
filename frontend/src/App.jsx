import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/dashboard/Login";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ProjectsList from "./pages/dashboard/ProjectsList";
import ProjectForm from "./pages/dashboard/ProjectForm";
import Inbox from "./pages/dashboard/Inbox";
import { getProfile } from "./api/client";

function PublicLayout() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  return (
    <>
      <Nav />
      <Outlet />
      <Footer profile={profile} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/dashboard/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:slug" element={<ProjectForm />} />
        <Route path="inbox" element={<Inbox />} />
      </Route>
    </Routes>
  );
}
