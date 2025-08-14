import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SiswaByAngkatan() {
  const { angkatan } = useParams();
  const navigate = useNavigate();

  // State management
  const [siswa, setSiswa] = useState([]);
  const [filteredSiswa, setFilteredSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(true);

  // Filter options state
  const [filters, setFilters] = useState({
    angkatan: angkatan || "all",
    keahlian: "",
    skill: "",
    daerah: "",
    posisi: "",
    instansi: "",
  });

  // Filter lists
  const [filterOptions, setFilterOptions] = useState({
    keahlian: [],
    skill: [],
    daerah: [],
    posisi: [],
    instansi: [],
  });

  const baseImageUrl = "https://backend_best.smktibazma.com/uploads/";
  const cardRefs = useRef([]);

  // Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://backend_best.smktibazma.com/api/getsiswa"
        );
        const sortedData = response.data.sort((a, b) => {
          if (a.angkatan !== b.angkatan) return a.angkatan - b.angkatan;
          return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
        });

        setSiswa(sortedData);
        setFilteredSiswa(sortedData);

        // Extract unique filter options
        setFilterOptions({
          keahlian: [
            ...new Set(sortedData.map((s) => s.keahlian).filter(Boolean)),
          ],
          daerah: [...new Set(sortedData.map((s) => s.alamat).filter(Boolean))],
          posisi: [...new Set(sortedData.map((s) => s.posisi).filter(Boolean))],
          instansi: [
            ...new Set(sortedData.map((s) => s.instansi).filter(Boolean)),
          ],
          skill: [
            ...new Set(
              sortedData.flatMap((s) =>
                s.skill ? s.skill.split(",").map((sk) => sk.trim()) : []
              )
            ),
          ],
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...siswa];

    // Apply text search
    if (searchTerm) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply all other filters
    result = result.filter((s) => {
      return (
        (filters.angkatan === "all" ||
          s.angkatan === Number(filters.angkatan)) &&
        (!filters.keahlian || s.keahlian === filters.keahlian) &&
        (!filters.skill ||
          s.skill?.toLowerCase().includes(filters.skill.toLowerCase())) &&
        (!filters.daerah ||
          s.alamat?.toLowerCase().includes(filters.daerah.toLowerCase())) &&
        (!filters.posisi ||
          s.posisi?.toLowerCase().includes(filters.posisi.toLowerCase())) &&
        (!filters.instansi ||
          s.instansi?.toLowerCase().includes(filters.instansi.toLowerCase()))
      );
    });

    setFilteredSiswa(result);
  }, [searchTerm, filters, siswa]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      cardRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [filteredSiswa]);

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Filter configuration
  const filterConfig = [
    { label: "Keahlian", name: "keahlian", options: filterOptions.keahlian },
    { label: "Skill", name: "skill", options: filterOptions.skill },
    { label: "Asal Daerah", name: "daerah", options: filterOptions.daerah },
    { label: "Posisi", name: "posisi", options: filterOptions.posisi },
    { label: "Instansi", name: "instansi", options: filterOptions.instansi },
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <motion.div
        className="text-center p-5 text-white rounded-4 mb-4"
        style={{ backgroundColor: "#12294A" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="display-5 fw-bold mb-3">Temukan Portofolio Alumni atau Siswa</h1>
        <p className="lead mb-4">
          Jelajahi talenta-talenta terbaik dari berbagai keahlian dan latar belakang.
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="container pt-2 mb-4">
        <div className="row justify-content-center">
          <div className="col-md-8 mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Cari siswa berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn"
                style={{ backgroundColor: "#12294A", color: "white" }}
                onClick={() => setShowFilter(!showFilter)}
              >
                {showFilter ? (
                  <>
                    <i className="bi bi-funnel-fill me-2"></i>
                    Sembunyikan Filter
                  </>
                ) : (
                  <>
                    <i className="bi bi-funnel me-2"></i>
                    Tampilkan Filter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mb-0">
          Menampilkan{" "}
          <span className="badge" style={{ backgroundColor: "#12294A" }}>
            {filteredSiswa.length}
          </span>{" "}
          siswa dan alumni
        </p>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <motion.div
          className="bg-light p-4 rounded-4 shadow-sm mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-sliders me-2"></i>
              Filter Siswa
            </h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setFilters({
                  angkatan: angkatan || "all",
                  keahlian: "",
                  skill: "",
                  daerah: "",
                  posisi: "",
                  instansi: "",
                });
              }}
            >
              Reset Filter
            </button>
          </div>

          <div className="row g-3">
            <div className="col-md-2 col-6">
              <label className="form-label small fw-bold text-uppercase text-muted">
                Angkatan
              </label>
              <select
                className="form-select"
                value={filters.angkatan}
                onChange={(e) => handleFilterChange("angkatan", e.target.value)}
              >
                <option value="all">Semua Angkatan</option>
                {[1, 2, 3, 4, 5].map((item) => (
                  <option key={item} value={item}>
                    Angkatan {item}
                  </option>
                ))}
              </select>
            </div>
            
            {filterConfig.map((filter, i) => (
              <div className="col-md-2 col-6" key={i}>
                <label className="form-label small fw-bold text-uppercase text-muted">
                  {filter.label}
                </label>
                <select
                  className="form-select"
                  value={filters[filter.name]}
                  onChange={(e) =>
                    handleFilterChange(filter.name, e.target.value)
                  }
                >
                  <option value="">Semua {filter.label}</option>
                  {filter.options.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Student Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Memuat data siswa/alumni...</p>
        </div>
      ) : filteredSiswa.length > 0 ? (
        <div className="row g-3">
          {filteredSiswa.map((s, index) => (
            <div
              key={s.id}
              className="col-6 col-sm-4 col-md-3 col-lg-2" // Adjusted for better responsiveness
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <motion.div
                className="card h-100 border-0 shadow-sm overflow-hidden hover-effect"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="position-relative" 
                  style={{ 
                    height: "150px",
                    backgroundColor: "#f8f9fa" // Fallback background
                  }}
                >
                  <img
                    src={`${baseImageUrl}${s.foto}`}
                    alt={s.name}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x150?text=No+Image";
                    }}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-gradient-dark">
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="badge text-truncate"
                        style={{ 
                          backgroundColor: "#12294A",
                          maxWidth: "50%"
                        }}
                        title={s.keahlian}
                      >
                        {s.keahlian}
                      </span>
                      <span className="badge bg-secondary">
                        {s.angkatan}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-body p-2 d-flex flex-column">
                  <h6 className="card-title fw-bold mb-1 text-truncate" title={s.name}>
                    {s.name}
                  </h6>
                  <p className="card-text small text-muted mb-2 text-truncate" title={`${s.posisi || ''} ${s.instansi ? `di ${s.instansi}` : 'SMK TI BAZMA'}`}>
                    {s.posisi && `${s.posisi} `}
                    {s.instansi ? `di ${s.instansi}` : 'SMK TI BAZMA'}
                  </p>

                  {s.skill && (
                    <div className="mb-2">
                      {s.skill
                        .split(",")
                        .slice(0, 2) // Show only 2 skills on mobile
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="badge bg-light text-dark me-1 mb-1 small"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      {s.skill.split(",").length > 2 && (
                        <span className="badge bg-light text-dark small">
                          +{s.skill.split(",").length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    className="btn btn-sm w-100 mt-auto"
                    style={{ 
                      backgroundColor: "#12294A", 
                      color: "white",
                      fontSize: "0.75rem"
                    }}
                    onClick={() => navigate(`/siswa/${s.id}`)}
                  >
                    Lihat Profil <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">
            <i className="bi bi-people"></i>
          </div>
          <h4 className="mb-3">Tidak ada siswa ditemukan</h4>
          <p className="text-muted mb-4">
            Coba gunakan kata kunci atau filter yang berbeda
          </p>
          <button
            className="btn"
            style={{ backgroundColor: "#12294A", color: "white" }}
            onClick={() => {
              setSearchTerm("");
              setFilters({
                angkatan: angkatan || "all",
                keahlian: "",
                skill: "",
                daerah: "",
                posisi: "",
                instansi: "",
              });
            }}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}

export default SiswaByAngkatan;