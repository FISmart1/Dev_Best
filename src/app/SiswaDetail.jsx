import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function SiswaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pengalaman, setPengalaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedExperiences, setExpandedExperiences] = useState({});
  const [showFotoModal, setShowFotoModal] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState(null);

  const baseImageUrl = "https://backend_best.smktibazma.com/uploads/";

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://backend_best.smktibazma.com/api/siswa/${id}`
      );
      setSiswa(res.data.siswa);
      setProjects(res.data.projects);
      setPengalaman(res.data.pengalaman);
    } catch (err) {
      console.error("Error fetching student data:", err);
      navigate("/not-found", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const toggleExperience = (id) => {
    setExpandedExperiences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const downloadPDF = async () => {
    if (!siswa) return;

    try {
      const el = document.getElementById("profile-section");
      const options = {
        margin: 0.5,
        filename: `${siswa.name}-profile.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().from(el).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const downloadPNG = async () => {
    if (!siswa) return;

    try {
      const canvas = await html2canvas(
        document.getElementById("profile-section")
      );
      const link = document.createElement("a");
      link.download = `${siswa.name}-profile.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Failed to download PNG. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleShowMore = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!siswa) {
    return (
      <div className="container py-5 text-center">
        <h4>Student data not found</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const carouselResponsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="container py-5">
      {/* Main Profile Card */}
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        id="profile-section"
      >
        {/* Profile Header */}
        <div
          className="bg-opacity-10 p-4 p-md-5"
          style={{ backgroundColor: "#12294A" }}
        >
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className=" fw-bold text-white mb-3">{siswa.name}</h1>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <span className="badge bg-white text-black px-3 py-2">
                  <i className="bi bi-briefcase me-2"></i>
                  {siswa.posisi}
                </span>
                <span className="badge bg-white text-black px-3 py-2">
                  <i className="bi bi-building me-2"></i>
                  {siswa.instansi}
                </span>
              </div>
              <p className="text-white">
                Jumlah hafalan : {siswa.hafalan ?? 0} juz
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                {siswa.cv && (
                  <a
                    href={`https://backend_best.smktibazma.com/uploads/${siswa.cv}`}
                    download
                    className="btn btn-white bg-white text-black px-4 rounded-pill"
                  >
                    <i className="bi bi-file-earmark-pdf me-2"></i> Download CV
                  </a>
                )}

                {siswa.link_porto && (
                  <a
                    href={
                      siswa.link_porto.startsWith("http")
                        ? siswa.link_porto
                        : `https://backend_best.smktibazma.com/uploads/${siswa.link_porto}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light px-4 rounded-pill"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i> Portofolio
                  </a>
                )}
                {siswa.linkedin && (
                  <a
                    href={
                      siswa.linkedin.startsWith("http")
                        ? siswa.linkedin
                        : `${siswa.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light px-4 rounded-pill"
                  >
                    <i className="bi bi-linkedin"></i> Linkedin
                  </a>
                )}
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={`${baseImageUrl}${siswa.foto}`}
                  alt={`${siswa.name}'s profile`}
                  className="rounded-circle img-thumbnail shadow-sm"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-4 p-md-5">
          {/* About Section */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4 text-custom">
              <i className="bi bi-person-lines-fill me-2 "></i> Tentang
            </h3>
            <div className="p-4 rounded-3 text-justify">
              <p className="mb-0 whitespace-pre-wrap">
                {siswa.deskripsi || "No description available."}
              </p>
            </div>
          </section>

          {/* Contact Info */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4 text-custom">
              <i className="bi bi-envelope-at-fill me-2"></i> Kontak
            </h3>
            <div className="row g-3 text-custom">
              {siswa.email && (
                <Link
                  to={`mailto:${siswa.email}`}
                  className="col-md-6 text-decoration-none text-custom"
                >
                  <div className="p-3 border rounded-3 h-100">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      <div>
                        <h6 className="mb-1 ">Email</h6>
                        <p className="text-decoration-none text-custom">
                          {siswa.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {siswa.telepon && (
                <Link
                  to={`https://wa.me/${siswa.telepon}`}
                  className="col-md-6 text-decoration-none text-custom"
                >
                  <div className="p-3 border rounded-3 h-100">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-whatsapp"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">WhatsApp</h6>
                        <p className="text-decoration-none text-custom">
                          {siswa.telepon}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              <div className="col-12">
                <div className="p-3 border rounded-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Alamat Tinggal</h6>
                      <p className="mb-0">{siswa.alamat}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4 text-custom">
              <i className="bi bi-tools me-2"></i> Skills
            </h3>
            <div className="d-flex flex-wrap gap-2">
              {siswa.skill ? (
                siswa.skill.split(",").map((s, i) => (
                  <span
                    key={i}
                    className="badge bg-custom bg-opacity-25 text-white py-2 px-3 fs-6"
                  >
                    {s.trim()}
                  </span>
                ))
              ) : (
                <p className="text-muted">No skills listed</p>
              )}
            </div>
          </section>

          {/* Projects Section */}
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-custom">
                <i className="bi bi-folder-fill me-2"></i> Proyek
              </h3>
              <span className="badge bg-custom rounded-pill px-3 py-2">
                {projects.length} projects
              </span>
            </div>

            {projects.length > 0 ? (
              <Carousel
                responsive={carouselResponsive}
                itemClass="px-2"
                containerClass="px-0 py-3"
                arrows
                infinite={false}
                autoPlay={false}
                keyBoardControl
              >
                {projects.map((p) => {
                  const shortDesc =
                    p.deskripsi.length > 100
                      ? `${p.deskripsi.substring(0, 100)}...`
                      : p.deskripsi;

                  return (
                    <div key={p.id} className="h-100">
                      <div className="card border-0 shadow-sm h-100">
                        {p.foto && (
                          <div
                            className="overflow-hidden"
                            style={{ height: "180px" }}
                          >
                            <img
                              src={`${baseImageUrl}${p.foto}`}
                              alt={p.name_project}
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                        )}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title fw-bold">
                            {p.name_project}
                          </h5>
                          <p className="card-text text-muted mb-3">
                            {shortDesc}
                            {p.deskripsi.length > 100 && (
                              <span
                                className="text-free ms-1 cursor-pointer"
                                onClick={() => handleShowMore(p)}
                              >
                                Baca Selengkapnya →
                              </span>
                            )}
                          </p>
                          {p.tools && (
                            <div className="mt-auto">
                              <div className="d-flex flex-wrap gap-2 mb-3">
                                {p.tools.split(",").map((tool, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-secondary bg-opacity-10 text-secondary"
                                  >
                                    {tool.trim()}
                                  </span>
                                ))}
                              </div>
                              {p.link_web && (
                                <a
                                  href={p.link_web}
                                  className="btn btn-free w-100"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Lihat Proyek{" "}
                                  <i className="bi bi-box-arrow-up-right ms-2"></i>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              <div className="text-center py-5 bg-light rounded-3">
                <i className="bi bi-folder-x text-muted fs-1 mb-3"></i>
                <h5 className="text-muted">No projects available</h5>
              </div>
            )}
          </section>

          {/* Experience Section */}
          <section className="mb-4">
            <h3 className="fw-bold mb-4 text-custom">
              <i className="bi bi-award-fill me-2"></i> Pengalaman
            </h3>

            {pengalaman.length > 0 ? (
              <div className="row g-4">
                {pengalaman.map((exp, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{exp.name}</h5>
                      <p className="card-text">{exp.deskripsi}</p>
                      <p className="text-muted">{exp.lokasi}</p>
                      {exp.foto && (
                        <button
                          className="btn btn-sm btn-free"
                          onClick={() => {
                            setSelectedFoto(
                              `https://backend_best.smktibazma.com/uploads/${exp.foto}`
                            );
                            setShowFotoModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i> Lihat Sertifikat
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-light rounded-3">
                <i className="bi bi-award text-muted fs-1 mb-3"></i>
                <h5 className="text-muted">No experience listed</h5>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Project Modal */}
      {showModal && selectedProject && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header navbar-custom text-white">
                <h5 className="modal-title">{selectedProject.name_project}</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedProject.foto && (
                  <img
                    src={`${baseImageUrl}${selectedProject.foto}`}
                    className="img-fluid rounded-3 mb-4"
                    alt={selectedProject.name_project}
                  />
                )}
                <p className="lead">{selectedProject.deskripsi}</p>
                {selectedProject.tools && (
                  <div className="mb-4">
                    <h6>Alat yang digunakan:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedProject.tools.split(",").map((tool, index) => (
                        <span
                          key={index}
                          className="badge py-2 px-3"
                          style={{ border: "1px solid #12294A", color: "#12294A" }}
                        >
                          {tool.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedProject.link_web && (
                  <a
                    href={selectedProject.link_web}
                    className="btn btn-free-nooutline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat Project{" "}
                    <i className="bi bi-box-arrow-up-right ms-2"></i>
                  </a>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFotoModal && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Sertifikat Pengalaman</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowFotoModal(false)}
          ></button>
        </div>
        <div className="modal-body text-center">
          {selectedFoto ? (
            <img
              src={selectedFoto}
              alt="Sertifikat"
              className="img-fluid rounded"
            />
          ) : (
            <p className="text-muted">Tidak ada foto sertifikat</p>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowFotoModal(false)}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default SiswaDetail;
