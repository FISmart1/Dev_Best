import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name_project: "",
    deskripsi: "",
    link_web: "",
    tools: "",
    db_siswa_id: "",
  });
  const [foto, setFoto] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchProject = async () => {
    const res = await fetch("https://backend_best.smktibazma.com/api/projects");
    const data = await res.json();
    setProjectList(data || []);
  };

  const fetchSiswa = async () => {
    const res = await fetch("https://backend_best.smktibazma.com/api/getsiswa");
    const data = await res.json();
    setSiswaList(data || []);
  };

  useEffect(() => {
    fetchProject();
    fetchSiswa();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const generatedId = formData.id || Date.now().toString();
    data.append("id", generatedId);
    data.append("name_project", formData.name_project);
    data.append("deskripsi", formData.deskripsi);
    data.append("link_web", formData.link_web);
    data.append("tools", formData.tools);
    data.append("db_siswa_id", formData.db_siswa_id);
    if (foto) data.append("foto", foto);

    try {
      if (isEdit) {
        await fetch(`https://backend_best.smktibazma.com/api/project/${generatedId}`, {
          method: "PUT",
          body: data,
        });
        alert("Project diperbarui!");
      } else {
        await fetch("https://backend_best.smktibazma.com/api/project/upload", {
          method: "POST",
          body: data,
        });
        alert("Project ditambahkan!");
      }

      fetchProject();
      setShowModal(false);
      setFormData({
        id: "",
        name_project: "",
        deskripsi: "",
        link_web: "",
        tools: "",
        db_siswa_id: "",
      });
      setFoto(null);
      setIsEdit(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data project.");
    }
  };

  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      name_project: data.name_project,
      deskripsi: data.deskripsi,
      link_web: data.link_web,
      tools: data.tools,
      db_siswa_id: data.db_siswa_id,
    });
    setShowModal(true);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus project ini?")) {
      try {
        await fetch(`https://backend_best.smktibazma.com/api/delproject/${id}`, {
          method: "DELETE",
        });
        alert("Project dihapus.");
        fetchProject();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus project.");
      }
    }
  };

  const truncate = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="container py-4 mt-5 mb-5">
      <h2 className="h4 fw-bold mb-4 mt-5">Data Project</h2>
      <div className="d-flex gap-4">
        <button onClick={() => navigate(-1)} className="btn btn-primary mb-4">
          &larr; Back
        </button>
        <button
          className="btn btn-success mb-4"
          onClick={() => {
            setShowModal(true);
            setFormData({
              id: "",
              name_project: "",
              deskripsi: "",
              link_web: "",
              tools: "",
              db_siswa_id: "",
            });
            setFoto(null);
            setIsEdit(false);
          }}
        >
          Tambah Project
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nama Project</th>
              <th>Link</th>
              <th>Nama Siswa</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((p, i) => (
              <tr key={i}>
                <td>{p.id}</td>
                <td>{p.name_project}</td>
                <td>
                  <a href={p.link_web} target="_blank" rel="noreferrer">
                    {p.link_web}
                  </a>
                </td>
                <td>{p.nama_siswa}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
        >
          <div
            className="bg-white rounded-3 p-4 shadow w-100"
            style={{ maxWidth: "600px" }}
          >
            <button
              className="btn position-absolute end-0 me-3 mt-3"
              onClick={() => {
                setShowModal(false);
                setFormData({
                  id: "",
                  name_project: "",
                  deskripsi: "",
                  link_web: "",
                  tools: "",
                  db_siswa_id: "",
                });
              }}
            >
              Back
            </button>
            <h5 className="fw-semibold mb-3">
              {isEdit ? "Edit Project" : "Tambah Project"}
            </h5>

            <form onSubmit={handleSubmit}>
              <input
                name="name_project"
                value={formData.name_project}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Nama Project"
                required
              />
              <input
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Deskripsi"
              />
              <input
                name="link_web"
                value={formData.link_web}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Link Website"
              />
              <textarea
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Tools yang digunakan"
              />
              <select
                name="db_siswa_id"
                value={formData.db_siswa_id}
                onChange={handleChange}
                className="form-control mb-3"
                required
              >
                <option value="">Pilih Siswa</option>
                {siswaList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.name}
                  </option>
                ))}
              </select>
              <div className="mb-4">
                <label className="form-label d-block">
                  Upload Gambar Project
                </label>
                <input
                  type="file"
                  name="foto"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary me-2">
                Simpan
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-link"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProject;
