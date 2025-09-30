//import useContext

//import react router dom
import { Routes, Route } from "react-router-dom";

//import view home
import Home from "../app/Home";
import SiswaByAngkatan from "../app/Siswa";
import SiswaDetail from "../app/SiswaDetail";

import Admin from "../app/admin/AdminDashboard";
import AddSiswa from "../app/admin/AddSiswa";
import AddPengalaman from "../app/admin/AddPengalaman";
import AddProject from "../app/admin/AddProject";
import Loading from "../app/loading";


import EditSiswa from "../app/EditSiswa";
import ProtectedRoute from "../app/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
export default function AppRoutes() {
  const { user } = useAuth(); // gunakan context

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Loading />} />
      <Route path="/home" element={<Home />} />
      <Route path="/angkatan" element={<SiswaByAngkatan />} />
      <Route path="/siswa/:id" element={<SiswaDetail />} />


      <Route
        path="/edit-siswa/:id"
        element={
          <ProtectedRoute role="siswa">
            <EditSiswa />
          </ProtectedRoute>
        }
      />
      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-siswa"
        element={
          <ProtectedRoute role="admin">
            <AddSiswa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-pengalaman"
        element={
          <ProtectedRoute role="admin">
            <AddPengalaman />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-project"
        element={
          <ProtectedRoute role="admin">
            <AddProject />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
