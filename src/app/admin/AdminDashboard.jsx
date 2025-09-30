import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function AdminDashboard() {
  const navigate = useNavigate();
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalProject, setTotalProject] = useState(0);

  useEffect(() => {
    axios.get("https://backend_best.smktibazma.com/api/getsiswa").then((res) => {
      setTotalSiswa(res.data.length);
    });
    axios.get("https://backend_best.smktibazma.com/api/projects").then((res) => {
      setTotalProject(res.data.length);
    });
  }, []);

  const menuItems = [
    {
      title: "Tambah Siswa",
      icon: "bi-person-plus",
      bg: "primary",
      path: "/admin/add-siswa",
    },
    {
      title: "Tambah Pengalaman",
      icon: "bi-briefcase-fill",
      bg: "warning",
      textColor: "text-white",
      path: "/admin/add-pengalaman",
    },
    {
      title: "Tambah Project",
      icon: "bi-folder-plus",
      bg: "info",
      path: "/admin/add-project",
    },
  ];

  return (
    <div className="container py-4 mt-5">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <img
          src="/admin.png"
          alt="Admin"
          width="50"
          className="rounded-circle"
        />
        <div>
          <h5 className="mb-0">Selamat Datang, Admin</h5>
          <small className="text-muted">Panel Kontrol Website</small>
        </div>
      </div>

      {/* Statistik */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="bg-light p-3 rounded shadow-sm">
            <h6 className="mb-1">👨‍🎓 Total Siswa</h6>
            <h4>{totalSiswa}</h4>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-light p-3 rounded shadow-sm">
            <h6 className="mb-1">💡 Total Project</h6>
            <h4>{totalProject}</h4>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <div className="row g-3">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => navigate(item.path)}
              className={`btn btn-${item.bg} w-100 p-4 shadow-sm ${
                item.textColor || ""
              }`}
              style={{ textAlign: "left", fontSize: "1.1rem" }}
            >
              <i className={`bi ${item.icon} me-2`}></i> {item.title}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
