import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddPengalaman() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    lokasi: "",
    deskripsi: "",
    db_siswa_id: "",
  });
  const [foto, setFoto] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [siswaList, setSiswaList] = useState([]);

  useEffect(() => {
    fetchData();
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    const res = await axios.get(
      "https://backend_best.smktibazma.com/api/getsiswa"
    );
    setSiswaList(res.data || []);
  };

  const fetchData = async () => {
    const res = await axios.get(
      "https://backend_best.smktibazma.com/api/pengalaman"
    );
    setList(res.data || []);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Jangan kirim id
    const { id, ...safeFormData } = formData;
    Object.entries(safeFormData).forEach(([k, v]) => data.append(k, v));
    if (foto) data.append("foto", foto);

    try {
      if (isEdit) {
        await axios.put(
          `https://backend_best.smktibazma.com/api/editpengalaman/${formData.id}`,
          data
        );
        alert("Pengalaman diperbarui");
      } else {
        await axios.post(
          "https://backend_best.smktibazma.com/api/pengalaman",
          data
        );
        alert("Pengalaman ditambahkan");
      }

      fetchData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pengalaman");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      db_siswa_id: item.db_siswa_id,
    });
    setFoto(null);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengalaman ini?")) {
      try {
        await axios.delete(
          `https://backend_best.smktibazma.com/api/pengalaman/${id}`
        );
        fetchData();
        alert("Data dihapus");
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      lokasi: "",
      deskripsi: "",
      db_siswa_id: "",
    });
    setFoto(null);
    setIsEdit(false);
  };

  return (
    <div className="container py-5 mt-5 mb-5">
      <h2 className="h4 mb-4 fw-bold mt-5">Data Pengalaman</h2>

      <div className="d-flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-primary text-decoration-none mb-3"
        >
          &larr; Back
        </button>
        <button
          className="btn btn-success mb-3"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Tambah Pengalaman
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Lokasi</th>
            <th>Nama Siswa</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list
            .slice()
            .sort((a, b) => a.siswa_name.localeCompare(b.siswa_name))
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.lokasi}</td>
                <td>{item.siswa_name}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <button
              className="btn-close position-absolute end-0 me-3 mt-3"
              onClick={() => setShowModal(false)}
            />
            <h5 className="mb-3">{isEdit ? "Edit" : "Tambah"} Pengalaman</h5>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Nama Pengalaman"
                required
              />
              <input
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Lokasi"
              />
              <input
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Deskripsi"
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
              <input
                type="file"
                name="foto"
                onChange={handleFileChange}
                className="form-control mb-3"
              />
              <button type="submit" className="btn btn-primary me-2">
                Simpan
              </button>
              <button
                type="button"
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

export default AddPengalaman;
