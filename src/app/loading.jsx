import React, { useEffect, useState, useContext } from "react";
import "../../src/animation.css"
import { AuthContext} from "../../context/AuthContext"; // sesuaikan path
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-bazma.png"; // pastikan path ini sesuai dengan struktur folder Anda
// ... import lainnya
function Loading() {
  const { setShowLayout } = useContext(AuthContext);
const [isLoading, setIsLoading] = useState(true);
const Navigate = useNavigate();

  // Menggunakan useEffect untuk mengatur loading dan navigasi

useEffect(() => {
  setShowLayout(false); // sembunyikan navbar/footer saat loading

  const timer = setTimeout(() => {
    setIsLoading(false);
    setShowLayout(true); // munculkan lagi setelah 10 detik
    Navigate("/home"); // arahkan ke halaman home
  }, 2000);

  return () => {
    clearTimeout(timer);
    setShowLayout(true); // pastikan kembali jika user navigasi

  };
}, []);

  if (isLoading) {
    return (
      <div className="floating-container ">
      <div className="image-wrapper">
        <img src={logo} alt="Gambar Porto" className="floating-image" />
        <div className="shadowh"></div>
      </div>
      <div className="text-section">
        <h2>BEST</h2>
      </div>
    </div>
    );
  }
}
export default Loading;
