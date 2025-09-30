import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import imageCompression from "browser-image-compression";

function AddSiswa() {
  const navigate = useNavigate();
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
  const [formData, setFormData] = useState({
    id: "",
    id_lama: "",
    name: "",
    angkatan: "",
    keahlian: "",
    link_porto: "",
    alamat: "",
    deskripsi: "",
    posisi: "",
    instansi: "",
    skill: "",
    linkedin: "",
    status: "", // �TAMBAHKAN INI
    email: "",
    telepon: "",
    hafalan: "",
    password: "",
  });
  const [files, setFiles] = useState({
    foto: null,
    portofolio_foto: null,
    cv: null,
  });
  const [siswaList, setSiswaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [skillList, setSkillList] = useState(skillOptions);
  /* ------------ handlers ------------ */
  const handleEdit = (fd) => {
    setFormData({
      id: fd.id,
      id_lama: fd.id,
      name: fd.name,
      angkatan: fd.angkatan,
      keahlian: fd.keahlian,
      link_porto: fd.link_porto,
      alamat: fd.alamat,
      deskripsi: fd.deskripsi,
      posisi: fd.posisi,
      instansi: fd.instansi,
      email: fd.email,
      telepon: fd.telepon,

      skill: fd.skill,
      linkedin: fd.linkedin,
      status: fd.status, // �TAMBAHKAN INI
      hafalan: fd.hafalan,
      password: fd.password,
    });

    console.log({
      id: fd.id,
      id_lama: fd.id,
      name: fd.name,
      angkatan: fd.angkatan,
      keahlian: fd.keahlian,
      link_porto: fd.link_porto,
      alamat: fd.alamat,
      deskripsi: fd.deskripsi,
      posisi: fd.posisi,
      instansi: fd.instansi,
      email: fd.email,
      telepon: fd.telepon,
      hafalan: fd.hafalan,
      skill: fd.skill,
      linkedin: fd.linkedin,
      status: fd.status,
      password: fd.password,
    });
    setShowModal(true);
    setIsEdit(true); // TAMBAHKAN INI
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus siswa ini?")) {
      try {
        await axios.delete(
          `https://backend_best.smktibazma.com/api/siswa/${id}`
        );
        alert("Data berhasil dihapus.");
        fetchSiswa();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus data.");
      }
    }
  };

  /* ------------ fetch data ------------ */
  const fetchSiswa = async () => {
    const res = await axios.get(
      "https://backend_best.smktibazma.com/api/getsiswa"
    );
    setSiswaList(res.data || []);
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  /* ------------ handlers ------------ */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5, // target maksimal 500KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      setFiles((prev) => ({
        ...prev,
        [name]: compressedFile,
      }));
    } catch (error) {
      console.error("Gagal kompres file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    Object.entries(files).forEach(([k, v]) => v && fd.append(k, v));

    try {
      if (isEdit) {
        await axios.put(
          `https://backend_best.smktibazma.com/api/siswa/update/${formData.id_lama}`,
          fd
        );
        alert("Data siswa berhasil diperbarui.");
      } else {
        await axios.post("https://backend_best.smktibazma.com/api/siswa", fd);
        alert("Siswa ditambahkan!");
      }

      fetchSiswa();
      setShowModal(false);
      setFormData({
        id: "",
        id_lama: "",
        name: "",
        angkatan: "",
        keahlian: "",
        link_porto: "",
        alamat: "",
        deskripsi: "",
        posisi: "",
        instansi: "",
        skill: "",
        linkedin: "",
        status: "",
        email: "",
        telepon: "",
        hafalan: "",
	password: "",
      });
      console.log("Mengirim PUT ke:", formData.id_lama);

      setFiles({ foto: null, portofolio_foto: null, cv: null });
      setIsEdit(false); // RESET
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data siswa.");
      console.log("Error detail:", err.response?.data || err.message);
      console.log({
        id: formData.id,
        id_lama: formData.id,
        name: formData.name,
      });
    }
  };

  /* ------------ JSX ------------ */
  return (
    <div className="container py-4 mt-5 mb-5">
      <h2 className="h4 fw-bold mb-4 mt-5">Data Siswa</h2>
      <div className="d-flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-primary text-decoration-none mb-4"
        >
          &larr; Back
        </button>
        <button
          className="btn btn-success mb-4"
          onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setFormData({
              id: "",
              id_lama: "",
              name: "",
              angkatan: "",
              keahlian: "",
              link_porto: "",
              alamat: "",
              deskripsi: "",
              posisi: "",
              instansi: "",
              skill: "",
              linkedin: "",
              status: "",
              email: "",
              telepon: "",
              hafalan: "",
	      password: "",
            });
            setFiles({ foto: null, portofolio_foto: null, cv: null });
          }}
        >
          Tambah Siswa Baru
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: "15%" }}>NIS</th>
              <th>Nama</th>
              <th style={{ width: "3%" }}>Angkatan</th>
              <th style={{ width: "20%" }}>Keahlian</th>
              <th style={{ width: "10%" }}>Linkedin</th>
              <th style={{ width: "15%" }}>Profil</th>
              <th style={{ width: "15%" }}>Aksi</th> {/* Kolom Aksi */}
            </tr>
          </thead>
          <tbody>
            {siswaList.map((s, i) => (
              <tr key={i}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.angkatan}</td>
                <td>{s.keahlian}</td>
                <td>
                  {s.linkedin && (
                    <a
                      href={s.linkedin}
                      target="_blank"
                      className="btn btn-primary"
                    >
                      Lihat
                    </a>
                  )}
                </td>
                <td>
                  <Link
                    to={`/siswa/${s.id}`}
                    className="text-decoration-none btn btn-primary"
                  >
                    Lihat Profil
                  </Link>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Bootstrap 5 manual (tanpa JS plugin) */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.6)",
            overflowY: "auto",
          }}
        >
          <div
            className="bg-white rounded-3 shadow w-100 px-3 py-4 position-relative"
            style={{
              maxWidth: "700px",
              marginTop: "2rem",
              marginBottom: "2rem",
              maxHeight: "95vh",
              overflowY: "auto",
            }}
          >
            <button
              className="btn-close position-absolute end-0 me-3 mt-3"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>

            <h5 className="fw-semibold mb-4 mt-2 ps-2">
              {isEdit ? "Edit Siswa" : "Tambah Siswa"}
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="hidden"
                    name="id_lama"
                    value={formData.id_lama}
                  />

                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="NIS"
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Nama"
                    required
                  />
                  <select
                    name="angkatan"
                    value={formData.angkatan || ""}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option value="">Pilih Angkatan</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <select
                    name="keahlian"
                    value={formData.keahlian || ""}
                    onChange={handleChange}
                    className="form-select mb-2"
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
                    <option value="IT Support Assistant">IOT Engineer</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                  </select>
                  <CreatableSelect
                    isMulti
                    name="skill"
                    options={skillList}
                    value={
                      formData.skill
                        ? formData.skill
                            .split(",")
                            .map((s) => ({ value: s.trim(), label: s.trim() }))
                        : []
                    }
                    onChange={(selected) => {
                      const skills = selected.map((s) => s.value).join(",");
                      setFormData((prev) => ({ ...prev, skill: skills }));

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

                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Link LinkedIn"
                  />
                  <input
                    name="link_porto"
                    value={formData.link_porto}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Link Portofolio"
                  />
                  <input
                    name="password"
                    value={formData.password }
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="password"
                  />
                </div>

                <div className="col-md-6">
                  <input
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Kota tinggal"
                  />
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Deskripsi"
                    rows={3}
                  ></textarea>
                  <input
                    name="instansi"
                    value={formData.instansi}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Instansi (kosongkan jika belum bekerja)"
                  />
                  <select
                    name="posisi"
                    value={formData.posisi}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option value="">Pilih Posisi dalam instansi</option>
                    <option value="pelajar">Pelajar</option>
                    <option value="Staff">Staff</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Junior Programmer">Junior Programmer</option>
                    <option value="Belum bekerja">Belum Bekerja</option>
                  </select>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Email"
                  />
                  <input
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="No. Telepon (628...)"
                  />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select mb-3"
                  >
                    <option value="">Pilih Status</option>
                    <option value="siswa">Siswa</option>
                    <option value="alumni">Alumni</option>
                  </select>
                  <select
                    name="hafalan"
                    value={formData.hafalan}
                    onChange={handleChange}
                    className="form-select mb-3"
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
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Foto</label>
                  <input
                    type="file"
                    name="foto"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">CV (PDF/DOC)</label>
                  <input
                    type="file"
                    name="cv"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Update" : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSiswa;
