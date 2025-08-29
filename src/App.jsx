import React, { useState, useContext, useEffect } from "react";
import AppRoutes from "./routes/index";
import { Link, useNavigate } from "react-router-dom";

import bazmaLogo from "../src/assets/logo-bazma.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import best from "../src/assets/best.png";


export default function App() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nis, setNis] = useState("");
  const [password, setPassword] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, setUser, showLayout } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [loginSuccess, setLoginSuccess] = useState(false); // 👈 tambahkan ini

  useEffect(() => {
    // Efek Bintang
    const handleMouseMove = (e) => {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${e.pageX}px`;
      star.style.top = `${e.pageY}px`;
      document.body.appendChild(star);
      setTimeout(() => {
        star.remove();
      }, 500);
    };

    // Efek Scroll Progress
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;

      const progressBar = document.getElementById("scrollProgress");
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log("🚀 Navigasi setelah login berhasil:", user, loginRole);

      if (loginRole === "admin") {
        navigate("/admin");
      } else if (loginRole === "siswa") {
        navigate(`/edit-siswa/${user.id}`);
      }
    }
  }, [user, isLoggedIn, loginRole]);

  const handleLogin = async () => {
    try {
      console.log("🟡 Mulai proses login...");
      const res = await axios.post("https://backend_best.smktibazma.com/api/login", {
        nis,
        password,
      });

      console.log("🟢 Response dari server:", res.data);

      if (res.data.success) {
        const fullUserData = { ...res.data.data, role: res.data.role };
        console.log("✅ Full user data yg akan disimpan:", fullUserData);

        localStorage.setItem("user", JSON.stringify(fullUserData));
        setUser(fullUserData);
        setLoginRole(res.data.role); // 👈 simpan role dengan benar
        setIsLoggedIn(true); // ✅ INI YANG BELUM ADA
        setShowModal(false);
      } else {
        alert(res.data.message || "Login gagal");
      }
    } catch (err) {
      console.error("🔥 Error saat login:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {showLayout && (
        <>
          <nav
            className="navbar navbar-expand-lg fixed-top border-bottom py-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)", // transparansi
              backdropFilter: "blur(5px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              zIndex: 999,
            }}
          >
            <div className="container d-flex justify-content-between align-items-center">
              {/* Logo & Title */}
              <div
                className="d-flex flex-column align-items-start"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/home")}
              >
                <img
                  src={best}
                  alt="Logo Bazma"
                  className="logo"
                  width={"100px"}
                />
                <span
                  className=""
                  style={{ fontSize: "14px", marginLeft: "10px" }}
                >
                  Bazma's Excelent Showcase of Talents
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex">
                <div className="navbar-nav d-flex gap-4 align-items-center">
                  <Link to="/home" className="nav-link text-dark">
                    Beranda
                  </Link>
                  <Link to="/angkatan" className="nav-link text-dark">
                    Cari talenta
                  </Link>
                  {user ? (
                    <div className="position-relative d-flex align-items-center">
                      {user.role === "admin"
                      ? <img
                        src={best}
                        width={"30px"}
                        height={"30px"}
                        className="rounded-circle me-2"
                        alt="User"
                      />

                      : <img
                        src={`https://backend_best.smktibazma.com/uploads/${user.foto}`}
                        width={"30px"}
                        height={"30px"}
                        className="rounded-circle me-2"
                        alt="User"
                      />
                      }
                      
                      <button
                        className="btn btn-sm dropdown-toggle"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                        }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {user.role === "admin"
                          ? "Hi Admin"
                          : `Hi, ${user.name}`}
                      </button>

                      {showDropdown && (
                        <div
                          className="position-absolute bg-white border rounded shadow p-3"
                          style={{
                            top: "100%",
                            right: 0,
                            minWidth: 150,
                            zIndex: 9999,
                          }}
                        >
                          <div
                            className="d-flex align-items-center gap-1 justify-content-center"
                            style={{ padding: "10px 15px", color: "black" }}
                          >
                            <i class="bi bi-person-check"></i>
                            <button
                              className="dropdown-item"
                              style={{ color: "black", padding: "5px 10px" }}
                              onClick={() => {
                                setShowDropdown(false);
                                user.role === "admin"
                                  ? navigate("/admin")
                                  : navigate(`/edit-siswa/${user.id}`);
                              }}
                            >
                              Go to Profile
                            </button>
                          </div>

                          <div
                            className="d-flex align-items-center gap-1 justify-content-center border border-danger"
                            style={{ padding: "10px 15px", color: "red" }}
                          >
                            <i class="bi bi-box-arrow-right"></i>
                            <button
                              className="dropdown-item text-danger"
                              style={{ color: "black" }}
                              onClick={() => {
                                localStorage.removeItem("user");
                                setUser(null);
                                setShowDropdown(false);
                                navigate("/home");
                              }}
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="btn"
                      style={{ backgroundColor: "#12294A", color: "white" }}
                      onClick={() => setShowModal(true)}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="d-lg-none">
                <button
                  className="btn "
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#12294A",
                    color: "white",
                  }}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <i className="bi bi-three-dots-vertical fs-4"></i>
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {showMobileMenu && (
              <div
                className="position-absolute bg-white shadow rounded p-3 mt-2"
                style={{
                  right: 15,
                  top: "100%",
                  zIndex: 1050,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(6px)",
                  width: "200px",
                }}
              >
                <Link
                  to="/home"
                  className="btn d-block mb-2"
                  style={{ backgroundColor: "#12294A", color: "white" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/angkatan"
                  className="btn d-block mb-2"
                  style={{ backgroundColor: "#12294A", color: "white" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Student
                </Link>
                {user ? (
                  <div className="d-flex flex-column gap-2">
                    <button
                      className=""
                      style={{
                        backgroundColor: "transparent",
                        color: "black",
                        border: "none",
                      }}
                      onClick={() =>
                        user.role === "admin"
                          ? navigate("/admin")
                          : navigate(`/edit-siswa/${user.id}`)
                      }
                    >
                      {user.role === "admin" ? "Hi Admin" : `Hi, ${user.name}`}
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        localStorage.removeItem("user");
                        setUser(null);
                        navigate("/home");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn"
                    style={{ backgroundColor: "#12294A", color: "white" }}
                    onClick={() => setShowModal(true)}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* Scroll Progress Line */}
          <div className="scroll-progress" id="scrollProgress"></div>
        </>
      )}

      {/* Modal Login */}
      {showModal && (
        <div
          className="modal d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-content p-4 rounded bg-white"
            style={{ width: "90%", maxWidth: "400px" }}
          >
            <h2 className="mb-3">Login</h2>
            <input
              type="text"
              placeholder="NIS"
              className="form-control mb-3"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn w-100 mb-2"
              style={{ backgroundColor: "#12294A", color: "white" }}
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="btn btn-secondary w-100"
              onClick={() => setShowModal(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Halaman Konten */}
      <div style={{ flex: 1, marginTop: showLayout ? "80px" : "0" }}>
        <AppRoutes />
      </div>

      {/* Footer */}
      {showLayout && (
        <footer
          className="navbar-custom text-white pt-4"
          style={{ backgroundColor: "#12294A" }}
        >
          <div className="container">
            <div className="row gy-4">
              {/* Logo & Slogan */}
              <div className="col-12 col-md-4 col-lg-3">
                <div className="d-flex align-items-center mb-2">
                  <img
                    src={bazmaLogo}
                    alt="Logo"
                    style={{ width: "60px", marginRight: "10px" }}
                  />
                  <h5 className="mb-0">SMK TI BAZMA</h5>
                </div>
                <p className="fw-bold small">ENERGI MASA DEPAN INDONESIA</p>
              </div>

              {/* Tentang Kami */}
              <div className="col-6 col-md-4 col-lg-3">
                <h6 className="fw-bold mb-2">Tentang Kami</h6>
                <div className="d-flex flex-column">
                  <Link
                    to="/home"
                    className="text-white text-decoration-none mb-1"
                  >
                    Beranda
                  </Link>
                  <Link
                    to="/angkatan"
                    className="text-white text-decoration-none mb-1"
                  >
                    Siswa atau Alumni
                  </Link>
                  <Link
                    to="/angkatan"
                    className="text-white text-decoration-none"
                  >
                    Login
                  </Link>
                </div>
              </div>

              {/* Portofolio */}
              <div className="col-6 col-md-4 col-lg-3">
                <h6 className="fw-bold mb-2">Portofolio</h6>
                <div className="d-flex flex-column">
                  <Link
                    to="https://sismako.smktibazma.com"
                    className="text-white text-decoration-none mb-1"
                  >
                    SISMAKO
                  </Link>
                  <Link
                    to="https://smktibazma.com"
                    className="text-white text-decoration-none mb-1"
                  >
                    Website Sekolah
                  </Link>
                  <Link
                    to="https://smartpkl.smktibazma.com"
                    className="text-white text-decoration-none"
                  >
                    Smart PKL
                  </Link>
                </div>
              </div>

              {/* Kontak */}
              <div className="col-12 col-md-12 col-lg-3">
                <h6 className="fw-bold mb-2">Hubungi Kami</h6>
                <a
                  href="https://smktibazma.com"
                  className="text-white text-decoration-none"
                >
                  smktibazma.com
                </a>
              </div>
            </div>

            <hr className="border-white mt-4" />

            {/* Bottom Footer */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              
              <p className="mb-2 text-center text-md-start small">
                <strong>© Team Developer</strong> <a
                  href="https://www.instagram.com/ristinaesb/"
                  className="text-white text-decoration-none"
                >
                  Ristina Eka Salsabila, S.Kom
                </a> - {" "}
                <a
                  href="https://www.nyusuf.my.id"
                  className="text-white text-decoration-none"
                >
                  Nur Yusuf Ferdiansyah
                </a> - {" "}
                <a
                  href="https://www.instagram.com/iqball.a_16/"
                  className="text-white text-decoration-none"
                >
                  Muhammad Iqbal Asqalani
                </a>
              </p>
              <div>
                <a href="#" className="text-white me-3 mb-2 fs-5">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-white fs-5 mb-2">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
