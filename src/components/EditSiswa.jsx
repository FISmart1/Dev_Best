import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import CropModal from "../components/CropModal"; // pastikan path-nya sesuai file
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid"; // letakkan di paling atas file
const EditSiswa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [skillList, setSkillList] = useState([]);
  const skillOptions = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "iot", label: "iot" },
    { value: "figma", label: "figma" },
    { value: "photoshop", label: "photoshop" },
    { value: "illustrator", label: "illustrator" },
    { value: "premiere", label: "premiere" },
    { value: "mysql", label: "mysql" },
  ];
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    angkatan: "",
    keahlian: "",
    alamat: "",
    deskripsi: "",
    posisi: "",
    instansi: "",
    skill: "",
    linkedin: "",
    email: "",
    telepon: "",
    password: "",
    hafalan: "",
    status: "",
  });

  const [pengalamanForm, setPengalamanForm] = useState({
    name: "",
    lokasi: "",
    deskripsi: "",
    foto: null,
  });

  const [projectForm, setProjectForm] = useState({
    name_project: "",
    link_web: "",
    deskripsi: "",
    tools: "",
    foto: null,
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Kompres gambar
    try {
      const options = {
        maxSizeMB: 0.5, // Ukuran maksimal dalam MB
        maxWidthOrHeight: 800, // Resolusi maksimal
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // Preview ke CropModal
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result); // Data URL for crop preview
        setShowCropModal(true);
      };
      reader.readAsDataURL(compressedFile);
      alert("Gambar berhasil dikompres.");
      // Simpan sementara file asli hasil kompres
      setFotoFile(compressedFile);
    } catch (error) {
      console.error("Gagal kompres gambar:", error);
    }
  };

  const handleCropDone = async (croppedFile) => {
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedCroppedFile = await imageCompression(
        croppedFile,
        options
      );

      setFotoFile(compressedCroppedFile);
      setShowCropModal(false);
    } catch (error) {
      console.error("Gagal kompres gambar hasil crop:", error);
    }
  };

  // Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://backend_best.smktibazma.com/api/siswa/${id}`
        );
        console.log("🔥 Full API response:", res.data);
        setSiswa({
          ...res.data.siswa,
          pengalaman: res.data.pengalaman || [],
          projects: res.data.projects || [],
        });
        setProfileForm({
          id: res.data.siswa.id,
          name: res.data.siswa.name || "",
          angkatan: res.data.siswa.angkatan || "",
          keahlian: res.data.siswa.keahlian || "",
          alamat: res.data.siswa.alamat || "",
          deskripsi: res.data.siswa.deskripsi || "",
          posisi: res.data.siswa.posisi || "",
          instansi: res.data.siswa.instansi || "",
          skill: res.data.siswa.skill || "",
          linkedin: res.data.siswa.linkedin || "",
          email: res.data.siswa.email || "",
          telepon: res.data.siswa.telepon || "",
          password: res.data.siswa.password || "",
          hafalan: res.data.siswa.hafalan || "",
          status: res.data.siswa.status || "",
        });
        console.log("Data siswa:", res.data.siswa);
      } catch (err) {
        console.error("Error fetching student data:", err);
        toast.error("Gagal memuat data siswa");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    console.log("📦 siswa state terisi:", siswa);
  }, [siswa]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/home");
    toast.success("Anda telah logout");
  };

  // Handle form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePengalamanChange = (e) => {
    const { name, value } = e.target;
    setPengalamanForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };
  const deletePengalaman = async (pengalamanId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengalaman ini?")) {
      try {
        await axios.delete(
          `https://backend_best.smktibazma.com/api/pengalaman/${pengalamanId}`
        );
        alert("Pengalaman berhasil dihapus");
        await refreshSiswa();
      } catch (err) {
        console.error("Gagal menghapus pengalaman:", err);
        alert("Gagal menghapus pengalaman");
      }
    }
  };

  // Function to delete project
  const deleteProject = async (projectId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        await axios.delete(
          `https://backend_best.smktibazma.com/api/delproject/${projectId}`
        );
        alert("Proyek berhasil dihapus");
        await refreshSiswa();
      } catch (err) {
        console.error("Gagal menghapus proyek:", err);
        alert("Gagal menghapus proyek");
      }
    }
  };
  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      // Append semua field dari profileForm
      for (const key in profileForm) {
        if (key === "password" && !profileForm[key]) continue;
        if (key !== "foto") {
          fd.append(key, profileForm[key]);
        }
      }

      // Append file jika ada
      if (fotoFile) fd.append("foto", fotoFile);
      if (cvFile) fd.append("cv", cvFile);

      const response = await axios.put(
        `https://backend_best.smktibazma.com/api/siswa/update/${id}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Profil berhasil diperbarui!");
        const res = await axios.get(
          `https://backend_best.smktibazma.com/api/siswa/${id}`
        );
        setSiswa(res.data.siswa);

        // Reset file inputs
        setFotoFile(null);
        document.getElementById("fotoInput").value = "";
        setCvFile(null);

        // Arahkan ke halaman profil
        navigate(`/siswa/${id}`);
      } else {
        alert("Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      toast.error("Terjadi kesalahan saat memperbarui profil");
    }
  };

  // Handle experience form submission
  const handlePengalamanSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", pengalamanForm.name);
    fd.append("lokasi", pengalamanForm.lokasi);
    fd.append("deskripsi", pengalamanForm.deskripsi);
    fd.append("db_siswa_id", id);
    if (pengalamanForm.foto) {
      fd.append("foto", pengalamanForm.foto);
    }

    try {
      const response = await axios.post(
        "https://backend_best.smktibazma.com/api/pengalaman",
        fd // JANGAN tambahkan headers!
      );
      toast.success("Pengalaman berhasil ditambahkan");
      setPengalamanForm({ name: "", lokasi: "", deskripsi: "", foto: null });
      setActiveTab("experience");
      await refreshSiswa();
    } catch (err) {
      console.error("Gagal simpan pengalaman:", err);
      toast.error("Gagal menambahkan pengalaman");
    }
  };

  // Handle project form submission
  const handleProjectSubmit = async (e) => {
  e.preventDefault();
  try {
    const fd = new FormData();

    // ✅ Tambahkan ID unik untuk kolom 'id' di database
    const idProject = uuidv4();
    fd.append("id", idProject);

    // Append project data
    fd.append("name_project", projectForm.name_project);
    fd.append("link_web", projectForm.link_web);
    fd.append("deskripsi", projectForm.deskripsi);
    fd.append("tools", projectForm.tools);
    fd.append("db_siswa_id", id);

    // Append file if exists
    if (projectForm.foto) {
      fd.append("foto", projectForm.foto);
    }

    const response = await axios.post(
      "https://backend_best.smktibazma.com/api/project/upload",
      fd
    );

    if (response.data.success || response.data.message) {
      toast.success("Project berhasil ditambahkan!");
      setProjectForm({
        name_project: "",
        link_web: "",
        deskripsi: "",
        tools: "",
        foto: null,
      });
      setActiveTab("projects");
      await refreshSiswa(); // ✅ untuk menampilkan data terbaru
    } else {
      toast.error(response.data.message || "Gagal menambahkan project");
    }
  } catch (err) {
    console.error("Project error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Gagal menambahkan project");
  }
};
    
   

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Student not found
  if (!siswa) {
    return (
      <div className="container py-5 text-center">
        <h4>Data siswa tidak ditemukan</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Profile Header */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center">
            <div className="col-md-3 text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                <img
                  src={
                    fotoFile
                      ? URL.createObjectURL(fotoFile)
                      : `https://backend_best.smktibazma.com/uploads/${siswa.foto}`
                  }
                  alt={siswa.name}
                  className="rounded-circle img-thumbnail shadow"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
                <button
                  className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle"
                  style={{ backgroundColor: "#12294A", color: "white" }}
                  onClick={() => document.getElementById("fotoInput").click()}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <input
                  id="fotoInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="col-md-9">
              <h2 className="fw-bold mb-2">{siswa.name}</h2>
              <div className="d-flex flex-wrap gap-2 mb-3 pb-3">
                {siswa.posisi && (
                  <span
                    className="badge bg-opacity-10 px-3 py-2"
                    style={{ backgroundColor: "#12294A", color: "white" }}
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    {siswa.posisi}
                  </span>
                )}
                {siswa.instansi && (
                  <span
                    className="badge bg-opacity-10 px-3 py-2"
                    style={{ border: "1px solid #12294A", color: "#12294A" }}
                  >
                    <i className="bi bi-building me-2"></i>
                    {siswa.instansi}
                  </span>
                )}
              </div>

              <div className="d-flex flex-wrap gap-3">
                <button
                  className={`btn ${
                    activeTab === "profile"
                      ? "btn-birutua"
                      : "btn-outline-birutua"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <i className="bi bi-person me-2"></i> Profil
                </button>
                <button
                  className={`btn ${
                    activeTab === "experience"
                      ? "btn-birutua"
                      : "btn-outline-birutua"
                  }`}
                  onClick={() => setActiveTab("experience")}
                >
                  <i className="bi bi-award me-2"></i> Pengalaman
                </button>
                <button
                  className={`btn ${
                    activeTab === "projects"
                      ? "btn-birutua"
                      : "btn-outline-birutua"
                  }`}
                  onClick={() => setActiveTab("projects")}
                >
                  <i className="bi bi-folder me-2"></i> Proyek
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
          <div className="card-body p-4 p-md-5">
            <h4 className="fw-bold mb-4">
              <i className="bi bi-pencil-square me-2"></i> Edit Profil
            </h4>

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Angkatan</label>
                  <select
                    name="angkatan"
                    value={profileForm.angkatan}
                    onChange={handleProfileChange}
                    className="form-select"
                  >
                    <option value="">Pilih Angkatan</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Bidang Keahlian</label>
                  <select
                    name="keahlian"
                    value={profileForm.keahlian}
                    onChange={handleProfileChange}
                    className="form-select"
                  >
                    <option value="">Pilih Kompetensi</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Back-End Developer">
                      Back-End Developer
                    </option>
                    <option value="Fullstack Developer">
                      Fullstack Developer
                    </option>
                    <option value="Mobile App Developer">
                      Mobile App Developer
                    </option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Machine Learning Engineer">
                      Machine Learning Engineer
                    </option>
                    <option value="Network Engineer">Network Engineer</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="IT Support">IT Support</option>
                    <option value="IT Support Assistant">
                      IT Support Assistant
                    </option>
                    <option value="IOT Engineer">IOT Engineer</option>
                    <option value="Desain Grafis">Desain Grafis</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Posisi</label>
                  <select
                    name="posisi"
                    value={profileForm.posisi}
                    onChange={handleProfileChange}
                    className="form-control"
                  >
                    <option value="">Pilih Posisi dalam instansi</option>
                    <option value="pelajar">Pelajar</option>
                    <option value="Staff">Staff</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Belum bekerja">Belum Bekerja</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Instansi</label>
                  <input
                    type="text"
                    name="instansi"
                    value={profileForm.instansi}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Jumlah Hafalan</label>
                  <select
                    name="hafalan"
                    value={profileForm.hafalan}
                    onChange={handleProfileChange}
                    className="form-control"
                  >
                    <option value="">Pilih Hafalan</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Kota tinggal</label>
                  <input
                    type="text"
                    name="alamat"
                    value={profileForm.alamat}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={profileForm.status}
                    onChange={handleProfileChange}
                    className="form-control"
                  >
                    <option value="">Pilih Status</option>
                    <option value="siswa">Siswa</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="tel"
                    name="telepon"
                    value={profileForm.telepon}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Password Baru</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={profileForm.password}
                      onChange={handleProfileChange}
                      className="form-control"
                      placeholder="Kosongkan jika tidak ingin mengubah"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profileForm.linkedin}
                    onChange={handleProfileChange}
                    className="form-control"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Skill</label>
                  <CreatableSelect
                    isMulti
                    name="skill"
                    options={skillList}
                    value={
                      profileForm.skill
                        ? profileForm.skill
                            .split(",")
                            .map((s) => ({ value: s.trim(), label: s.trim() }))
                        : []
                    }
                    onChange={(selected) => {
                      const skills = selected.map((s) => s.value).join(",");
                      setProfileForm((prev) => ({ ...prev, skill: skills }));

                      // Tambahkan skill baru ke skillList jika belum ada
                      selected.forEach((s) => {
                        if (!skillList.find((opt) => opt.value === s.value)) {
                          setSkillList((prev) => [
                            ...prev,
                            { value: s.value, label: s.label },
                          ]);
                        }
                      });
                    }}
                    className="mb-3"
                    placeholder="Pilih atau tambahkan skill"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Deskripsi Diri</label>
                  <textarea
                    name="deskripsi"
                    rows="4"
                    value={profileForm.deskripsi}
                    onChange={handleProfileChange}
                    className="form-control"
                  ></textarea>
                </div>

                <div className="col-md-6">
                  <label className="form-label">CV/Resume (PDF)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setCvFile(e.target.files[0])}
                    accept=".pdf"
                  />
                </div>

                <div className="col-12 mt-4">
                  <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i> Logout
                    </button>
                    <button
                      type="submit"
                      className="btn px-4"
                      style={{ backgroundColor: "#12294A", color: "white" }}
                    >
                      <i className="bi bi-save me-2"></i> Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === "experience" && (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                <i className="bi bi-award me-2"></i> Pengalaman
              </h4>
              <button
                className="btn"
                style={{ backgroundColor: "#12294A", color: "white" }}
                onClick={() => setActiveTab("add-experience")}
              >
                <i className="bi bi-plus-lg me-2"></i> Tambah Pengalaman
              </button>
            </div>

            {siswa.pengalaman && siswa.pengalaman.length > 0 ? (
              <div className="row g-4">
                {siswa.pengalaman.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="card-title">{item.name}</h5>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deletePengalaman(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <p className="text-muted mb-1">{item.lokasi}</p>
                        <p className="card-text">{item.deskripsi}</p>
                        {item.foto && (
                          <img
                            src={`https://backend_best.smktibazma.com/uploads/${item.foto}`}
                            alt={item.name}
                            className="img-fluid mt-2 rounded"
                            style={{ maxHeight: "150px" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info mt-4">Belum ada pengalaman</div>
            )}
          </div>
        </div>
      )}

      {/* Add Experience Tab */}
      {activeTab === "add-experience" && (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                <i className="bi bi-plus-lg me-2"></i> Tambah Pengalaman
              </h4>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("experience")}
              >
                <i className="bi bi-arrow-left me-2"></i> Kembali
              </button>
            </div>

            <form onSubmit={handlePengalamanSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Pengalaman</label>
                  <input
                    type="text"
                    name="name"
                    value={pengalamanForm.name}
                    onChange={handlePengalamanChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Lokasi</label>
                  <input
                    type="text"
                    name="lokasi"
                    value={pengalamanForm.lokasi}
                    onChange={handlePengalamanChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    rows="4"
                    value={pengalamanForm.deskripsi}
                    onChange={handlePengalamanChange}
                    className="form-control"
                    required
                  ></textarea>
                </div>


                <div className="col-12 mt-4">
                  <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setActiveTab("experience")}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn px-4"
                      style={{ backgroundColor: "#12294A", color: "white" }}
                    >
                      Simpan Pengalaman
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                <i className="bi bi-folder me-2"></i> Proyek
              </h4>
              <button
                className="btn"
                style={{ backgroundColor: "#12294A", color: "white" }}
                onClick={() => setActiveTab("add-project")}
              >
                <i className="bi bi-plus-lg me-2"></i> Tambah Proyek
              </button>
            </div>

            {siswa.projects && siswa.projects.length > 0 ? (
              <div className="row g-4">
                {siswa.projects.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="card h-100 shadow-sm">
                      <div className="position-relative">
                        {item.foto ? (
                          <img
                            src={`https://backend_best.smktibazma.com/uploads/${item.foto}`}
                            className="card-img-top"
                            alt={item.name_project}
                            style={{ objectFit: "cover", height: "200px" }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{ height: "200px" }}
                          >
                            <span className="text-muted">Tidak ada foto</span>
                          </div>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                          onClick={() => deleteProject(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{item.name_project}</h5>
                        <p className="card-text">{item.deskripsi}</p>
                        <p className="text-muted mb-1">
                          <strong>Tools:</strong> {item.tools}
                        </p>
                        {item.link_web && (
                          <a
                            href={item.link_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary mt-2"
                          >
                            Lihat Proyek
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info mt-4">Belum ada proyek</div>
            )}
          </div>
        </div>
      )}

      {/* Add Project Tab */}
      {activeTab === "add-project" && (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                <i className="bi bi-plus-lg me-2"></i> Tambah Proyek
              </h4>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("projects")}
              >
                <i className="bi bi-arrow-left me-2"></i> Kembali
              </button>
            </div>

            <form onSubmit={handleProjectSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Nama Proyek</label>
                  <input
                    type="text"
                    name="name_project"
                    value={projectForm.name_project}
                    onChange={handleProjectChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Link Proyek (jika ada)</label>
                  <input
                    type="url"
                    name="link_web"
                    value={projectForm.link_web}
                    onChange={handleProjectChange}
                    className="form-control"
                    placeholder="https://"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Deskripsi Proyek</label>
                  <textarea
                    name="deskripsi"
                    rows="4"
                    value={projectForm.deskripsi}
                    onChange={handleProjectChange}
                    className="form-control"
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Tools/Teknologi (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    name="tools"
                    value={projectForm.tools}
                    onChange={handleProjectChange}
                    className="form-control"
                    placeholder="Contoh: React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Screenshot Proyek</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        foto: e.target.files[0],
                      })
                    }
                    accept="image/*"
                  />
                </div>

                <div className="col-12 mt-4">
                  <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setActiveTab("projects")}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn px-4"
                      style={{ backgroundColor: "#12294A", color: "white" }}
                    >
                      Simpan Proyek
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCropModal && (
        <CropModal
          imageSrc={tempImage}
          onClose={() => setShowCropModal(false)}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  );
};

export default EditSiswa;
