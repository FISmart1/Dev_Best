import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { fadeInUp } from './utils/animations';

// Import assets
import yakes from '../assets/logo-yakes.png';
import ptn from '../assets/ptn.png';
import hulurokan from '../assets/hulu-rokan.png';
import elnusa from '../assets/elnusa.png';
import pertamina from '../assets/pertamina.png';
import pgn from '../assets/pgn.png';
import ptc from '../assets/ptc.png';
import pertaminageo from '../assets/pertaminageo.png';
import retail from '../assets/retail.png';
import ssc from '../assets/ssc.png';
import pertalife from '../assets/perta.png';
import sekolah from '../assets/sekolah.png';
import sas from '../assets/sas.png';
import absensi from '../assets/absensi.png';
import orang from '../assets/orang.png';
import webJurnal from '../assets/web-jurnal.png';
import sesama from '../assets/sesama.png';

function Home() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [text, setText] = useState('');
  const [greetIndex, setGreetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [nonPelajar, setNonPelajar] = useState([]);
  const [allSiswa, setAllSiswa] = useState([]);
  const [filteredSiswa, setFilteredSiswa] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillList, setSkillList] = useState([]);
  const [keahlianList, setKeahlianList] = useState([]);
  const [AsalList, setAsalList] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedKeahlian, setSelectedKeahlian] = useState('');
  const [selectedAsal, setSelectedAsal] = useState('');
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const [testimoniList, setTestimoniList] = useState([]);
  const [showTestimoniForm, setShowTestimoniForm] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const [newTestimoni, setNewTestimoni] = useState({
    nama: '',
    instansi: '',
    pesan: '',
  });

  const nonPelajarScrollRef = useRef(null);
  const mitraRef = useRef(null);
  const imageBaseUrl = 'https://backend_best.smktibazma.com/uploads/';
  const logos = [yakes, ptn, hulurokan, elnusa, pertamina, pgn, ptc, pertaminageo, retail, ssc, pertalife];

  const greetings = ['Welcome To', 'Selamat Datang', 'ようこそ', '환영합니다', 'Bienvenue'];

  const truncateText = (text, maxLength = 120) => (text.length > maxLength ? `${text.substring(0, maxLength)}...` : text);

  const handleDoubleClick = () => {
    setReverseAnimation((prev) => !prev);
  };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < nonPelajar.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siswaRes, projectsRes, testimoniRes] = await Promise.all([
          axios.get('https://backend_best.smktibazma.com/api/getsiswa'),
          axios.get('https://backend_best.smktibazma.com/api/projects'),
          axios.get('https://backend_best.smktibazma.com/api/testimoni'),
        ]);

        const siswaData = siswaRes.data.filter((s) => s.status === 'alumni');

        const nonPelajarData = siswaData.filter((s) => s.posisi?.toLowerCase() !== 'pelajar' && s.instansi && s.instansi.trim() !== '');

        setTestimoniList(testimoniRes.data);
        setNonPelajar(nonPelajarData);
        setAllSiswa(siswaData);
        setFilteredSiswa(siswaData);
        setProjects(projectsRes.data);

        // Extract unique values
        const keahlianSet = new Set(siswaData.map((s) => s.keahlian).filter(Boolean));
        const asalSet = new Set(siswaData.map((s) => s.alamat).filter(Boolean));
        const allSkills = siswaData.flatMap((s) => (s.skill ? s.skill.split(',').map((sk) => sk.trim()) : []));

        setKeahlianList([...keahlianSet]);
        setAsalList([...asalSet]);
        setSkillList([...new Set(allSkills)]);
        console.log('Siswa Alumni:', siswaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Greeting animation
  useEffect(() => {
    const currentGreeting = greetings[greetIndex];
    if (charIndex < currentGreeting.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentGreeting[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setText('');
        setGreetIndex((prev) => (prev + 1) % greetings.length);
      }, 2500);
      return () => clearTimeout(pause);
    }
  }, [charIndex, greetIndex]);

  // Filter students
  useEffect(() => {
    const filtered = allSiswa.filter((s) => {
      const searchLower = searchTerm.toLowerCase();

      const nama = s.name?.toLowerCase() || '';
      const keahlian = s.keahlian?.toLowerCase() || '';
      const skill = s.skill?.toLowerCase() || '';
      const alamat = s.alamat || '';

      const matchSearch = nama.includes(searchLower) || keahlian.includes(searchLower) || skill.includes(searchLower);

      const matchKeahlian = selectedKeahlian === '' || s.keahlian === selectedKeahlian;

      const matchAsal = selectedAsal === '' || s.alamat === selectedAsal;

      const matchSkill =
        selectedSkill === '' ||
        skill
          .split(',')
          .map((sk) => sk.trim())
          .includes(selectedSkill.toLowerCase());

      return matchSearch && matchKeahlian && matchAsal && matchSkill;
    });

    setFilteredSiswa(filtered);

    // Filter aktif jika ada input di search atau dropdown
    const isAnyFilterActive = searchTerm !== '' || selectedKeahlian !== '' || selectedSkill !== '' || selectedAsal !== '';

    setFilterActive(isAnyFilterActive);
  }, [searchTerm, selectedKeahlian, selectedSkill, selectedAsal, allSiswa]);

  // Auto-scroll for partner logos
  useEffect(() => {
    const track = mitraRef.current;
    if (!track) return;

    let animationFrame;
    const speed = 0.15;
    const scroll = () => {
      track.scrollLeft += speed;
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft -= track.scrollWidth / 2;
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Touch events for alumni slider
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) > 50) {
        delta > 0 ? scrollRight() : scrollLeft();
      }
    };

    let touchStartX = 0;
    let touchEndX = 0;
    const container = nonPelajarScrollRef.current;

    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentIndex]);

  const handleSubmitTestimoni = async () => {
    if (!newTestimoni.nama || !newTestimoni.pesan) {
      alert('Nama dan pesan wajib diisi.');
      return;
    }

    try {
      const res = await axios.post('https://backend_best.smktibazma.com/api/testimoni', newTestimoni);
      setTestimoniList((prev) => [...prev, res.data]);
      setNewTestimoni({ nama: '', instansi: '', pesan: '' });
      setShowTestimoniForm(false);
    } catch (err) {
      console.error('Gagal kirim testimoni:', err);
      alert('Gagal menyimpan testimoni.');
    }
  };

  return (
    <div className="flex-column flex-md-row">
      {/* Hero Section */}
      <motion.div className="py-5 position-relative overflow-hidden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ backgroundColor: '#12294A', height: '90vh' }}>
        <div className="container" style={{ height: '80vh' }}>
          <div className="row align-items-center p-3" style={{ height: '100%' }}>
            <div className="col-12 col-md-6 text-white mb-4 mb-md-0 text-center text-md-start">
              <h3 className="fw-semibold" style={{ minHeight: '2.5rem' }}>
                {text}
                <span className="blinking-cursor">|</span>
              </h3>
              <h1 className="display-4 fw-bold">BEST</h1>
              <p className="fst-italic text-light">Temukan talenta terbaik dari SMK TI Bazma dan lihat karya nyata mereka.</p>
              <p className="text-justify">
                BEST adalah platform digital yang memudahkan alumni dan siswa SMK TI BAZMA untuk menampilkan portofolio mereka secara online. Karya-karya terbaik mereka kini bisa diakses dengan mudah oleh publik, industri, dan pihak yang
                ingin mengenal lebih dekat potensi generasi muda.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <span className="badge bg-light text-dark">Web Developer</span>
                <span className="badge bg-light text-dark">UI/UX Design</span>
                <span className="badge bg-light text-dark">Networking</span>
                <span className="badge bg-light text-dark">IoT Engineer</span>
              </div>
              <Link to="/angkatan" className="btn text-black mt-4" style={{ backgroundColor: 'white' }}>
                Lihat Alumni dan Siswa
              </Link>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <motion.img src={orang} alt="Ilustrasi Siswa" className="img-fluid" style={{ maxHeight: '600px', objectFit: 'contain' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alumni Section */}
      <motion.div className="container-fluid p-4 mt-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="d-flex flex-column align-items-center justify-content-center mx-auto">
          <h2 className="text-center fw-bold mb-3 text-black col-12 col-md-8">Jejak Alumni</h2>
          <p className="text-center mb-4 text-black col-12 col-md-10 ">
            Profil alumni berikut mencerminkan bahwa lulusan SMK TI BAZMA telah menempuh proses pembelajaran yang membekali mereka dengan keterampilan dan sikap kerja yang selaras dengan kebutuhan dunia profesional. Kehadiran mereka di
            berbagai bidang menjadi bagian dari kontribusi kecil yang terus bertumbuh, seiring dengan perjalanan belajar yang tidak berhenti setelah masa sekolah berakhir.
          </p>
        </div>

        <div className="d-flex align-items-center justify-content-center container">
          <button
            className="btn btn-outline-light rounded-circle shadow d-none d-md-block"
            style={{
              backgroundColor: '#12294A',
              width: '50px',
              height: '50px',
            }}
            onClick={scrollLeft}
            aria-label="Previous alumni"
          >
            ←
          </button>

          <div
            ref={nonPelajarScrollRef}
            className="d-flex align-items-center justify-content-center px-4 mb-3 w-100"
            style={{
              overflowX: 'hidden',
              position: 'relative',
              minHeight: '420px',
            }}
          >
            {nonPelajar.length > 0 && (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="row w-100 align-items-stretch flex-column flex-md-row"
                  style={{ minHeight: '420px', width: '100%' }}
                >
                  <div className="row w-100 align-items-center flex-column flex-md-row">
                    <div className="col-12 col-md-6 text-center">
                      <img
                        src={`${imageBaseUrl}${nonPelajar[currentIndex].foto}`}
                        className="img-fluid rounded-4"
                        alt={nonPelajar[currentIndex].name}
                        style={{
                          height: '320px',
                          objectFit: 'cover',
                          maxWidth: '100%',
                          minWidth: '100%',
                          border: '5px solid #12294A',
                        }}
                      />
                    </div>
                    <div
                      className="col-md-6 text-black text-justify text-md-start px-3 px-md-5 py-3"
                      style={{
                        minHeight: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h3 className="fw-bold">{nonPelajar[currentIndex].name}</h3>
                      <p className="ml-3 text-justify" style={{ minHeight: '72px', maxWidth: '80%' }}>
                        {truncateText(nonPelajar[currentIndex].deskripsi || 'Tidak ada deskripsi', 150)}
                      </p>
                      <p>
                        <i className="bi bi-building me-2"></i>
                        {nonPelajar[currentIndex].instansi} - {nonPelajar[currentIndex].posisi}
                      </p>
                      <Link to={`/siswa/${nonPelajar[currentIndex].id}`} className="btn mt-3 d-inline-block" style={{ color: 'white', backgroundColor: '#12294A' }}>
                        Lihat Detail!
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <button
            className="btn btn-outline-light rounded-circle shadow d-none d-md-block"
            style={{
              backgroundColor: '#12294A',
              width: '50px',
              height: '50px',
            }}
            onClick={scrollRight}
            aria-label="Next alumni"
          >
            →
          </button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div className="container-fluid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ backgroundColor: '#12294A' }}>
        <div className="container p-5">
          <div className="row text-center justify-content-center align-items-center">
            <div className="col-12 col-md-4">
              <div className="d-flex flex-column align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-people-fill fs-3 text-white"></i>
                </div>
                <h5 className="fw-bold mb-1 text-white">{filteredSiswa.length}+ Alumni</h5>
                <p className="text-white small">Talenta dari berbagai keahlian</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex flex-column align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-award-fill fs-3 text-white"></i>
                </div>
                <h5 className="fw-bold mb-1 text-white">{skillList.length}+ Skill</h5>
                <p className="text-white small">Skill yang dibutuhkan didunia kerja</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex flex-column align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-briefcase-fill fs-3 text-white"></i>
                </div>
                <h5 className="fw-bold mb-1 text-white">{AsalList.length}+ Asal daerah</h5>
                <p className="text-white small">Asal daerah talenta kita</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Student Search Section */}
      <motion.div className="container my-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="container-fluid my-5">
          <h2 className="fw-bold" style={{ color: '#12294A', textAlign: 'center' }}>
            Temukan Talenta Terbaik
          </h2>
          <p className="text-muted text-center">Jelajahi profil alumni dan siswa berbakat dari SMK TI BAZMA dan temukan kolaborator terbaik untuk proyek anda.</p>
        </div>

        <div className="container mb-5">
          <div className="bg-white shadow-sm rounded-4 px-3 px-md-5 py-4 mb-4 d-flex flex-column flex-lg-row align-items-stretch justify-content-between gap-3">
            <input type="text" className="form-control rounded-3 px-4" style={{ flex: 1, minWidth: '280px' }} placeholder="🔍 Cari nama atau keahlian..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="form-select rounded-3" style={{ maxWidth: '280px' }} value={selectedKeahlian} onChange={(e) => setSelectedKeahlian(e.target.value)}>
              <option value="">Keahlian</option>
              {keahlianList.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className="form-select rounded-3" style={{ maxWidth: '280px' }} value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="">Skill</option>
              {skillList.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className="form-select rounded-3" style={{ maxWidth: '280px' }} value={selectedAsal} onChange={(e) => setSelectedAsal(e.target.value)}>
              <option value="">Daerah Asal</option>
              {AsalList.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          {filterActive ? (
            filteredSiswa.length > 0 ? (
              filteredSiswa.map((s) => (
                <div className="col-6 col-sm-6 col-lg-4 mb-4" key={s.id}>
                  <div className="card h-100 shadow-custom border-0">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3" style={{ gap: '0.75rem' }}>
                        <img
                          src={`${imageBaseUrl}${s.foto}`}
                          alt={s.name}
                          className="rounded-circle"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <h5 className="mb-0 text-truncate" style={{ maxWidth: '100%' }}>
                            {s.name}
                          </h5>
                          <div className="d-flex flex-column">
                            <small className="text-muted">Angkatan {s.angkatan}</small>
                            <small className="text-muted">Alamat {s.alamat}</small>
                          </div>
                        </div>
                      </div>

                      <p
                        className="mb-3"
                        style={{
                          fontSize: '0.9rem',
                          backgroundColor: '#12294A',
                          color: 'white',
                          padding: '5px',
                          borderRadius: '5px',
                          width: 'fit-content',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={s.keahlian}
                      >
                        <strong>{s.keahlian}</strong>
                      </p>

                      <p className="mb-1 text-truncate">
                        <i className="bi bi-building me-1"></i>
                        {s.instansi || '-'}, {s.posisi || '-'}
                      </p>

                      <p className="small mb-3 text-truncate">
                        <i className="bi bi-lightning-fill me-1"></i>
                        {s.skill || '-'}
                      </p>

                      <div className="mt-auto">
                        <button className="btn w-100" style={{ backgroundColor: '#12294A', color: 'white' }} onClick={() => navigate(`/siswa/${s.id}`)}>
                          Lihat Profil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted mt-4">
                <p>❌ Tidak ada data alumni dan siswa yang cocok dengan filter.</p>
              </div>
            )
          ) : (
            <div className="text-center text-muted mt-4">
              <p>🔍 Gunakan filter di atas untuk mulai menelusuri data alumni dan siswa.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Projects Section */}
      <motion.div className="mt-5 mb-5 p-5" style={{ backgroundColor: '#12294A' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="container text-white text-center">
          {/* Bagian teks */}
          <div className="mb-5">
            <h1 className="fw-bold mb-3">Jejak Karya</h1>
            <p>
              Di balik setiap proyek, ada semangat belajar, kerja keras, dan inovasi. Proyek-proyek ini adalah bukti bahwa alumni dan siswa SMK TI BAZMA mampu menciptakan teknologi yang bermanfaat dan siap bersaing di dunia industri maupun
              masyarakat.
            </p>
          </div>

          {/* Bagian gambar: scroll horizontal */}
          <div
            className="d-flex flex-nowrap gap-3 overflow-auto pb-3 pt-3 pl-2"
            style={{
              scrollSnapType: 'x mandatory',
            }}
          >
            {/* Kartu 1 */}
            <motion.div
              className="card border-0 rounded p-0 flex-shrink-0"
              style={{
                minWidth: '220px', // batas minimal
                maxWidth: '300px', // batas maksimal
                width: '80%', // biar fleksibel
                height: 'auto',
                overflow: 'hidden',
                animation: 'glowChange 4s infinite',
                scrollSnapAlign: 'start',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={absensi} className="w-100" style={{ height: '200px', objectFit: 'cover' }} alt="Absensi Project" />
              <div className="p-3 bg-white">
                <h5 className="text-dark">Sistem Absensi</h5>
              </div>
            </motion.div>

            {/* Kartu 2 */}
            <motion.div
              className="card border-0 rounded p-0 flex-shrink-0"
              style={{
                minWidth: '220px',
                maxWidth: '300px',
                width: '80%',
                height: 'auto',
                overflow: 'hidden',
                animation: 'glowChange 4s infinite',
                scrollSnapAlign: 'start',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={sas} className="w-100" style={{ height: '200px', objectFit: 'cover' }} alt="Sismako Project" />
              <div className="p-3 bg-white">
                <h5 className="text-dark">SISMAKO</h5>
              </div>
            </motion.div>

            {/* Kartu 3 */}
            <motion.div
              className="card border-0 rounded p-0 flex-shrink-0"
              style={{
                minWidth: '220px',
                maxWidth: '300px',
                width: '80%',
                height: 'auto',
                overflow: 'hidden',
                animation: 'glowChange 4s infinite',
                scrollSnapAlign: 'start',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img src={sekolah} className="w-100" style={{ height: '200px', objectFit: 'cover' }} alt="Website Sekolah Project" />
              <div className="p-3 bg-white">
                <h5 className="text-dark">Website Sekolah</h5>
              </div>
            </motion.div>

            {/* Kartu 4 */}
            <motion.div
              className="card border-0 rounded p-0 flex-shrink-0"
              style={{
                minWidth: '220px',
                maxWidth: '300px',
                width: '80%',
                height: 'auto',
                overflow: 'hidden',
                animation: 'glowChange 4s infinite',
                scrollSnapAlign: 'start',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <img src={sesama} className="w-100" style={{ height: '200px', objectFit: 'cover' }} alt="SESAMA Project" />
              <div className="p-3 bg-white">
                <h5 className="text-dark">SESAMA</h5>
              </div>
            </motion.div>

            {/* Kartu 5 */}
            <motion.div
              className="card border-0 rounded p-0 flex-shrink-0"
              style={{
                minWidth: '220px',
                maxWidth: '300px',
                width: '80%',
                height: 'auto',
                overflow: 'hidden',
                animation: 'glowChange 4s infinite',
                scrollSnapAlign: 'start',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <img src={webJurnal} className="w-100" style={{ height: '200px', objectFit: 'cover' }} alt="Jurnal PKL Project" />
              <div className="p-3 bg-white">
                <h5 className="text-dark">Jurnal PKL</h5>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Partners Section */}

      {/* Testimonials Section */}
      <motion.div className="container my-2 py-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-5">
          <div className="text-center mb-4 mb-md-0">
            <h2 className="fw-bold mb-2">Kata Mereka</h2>
            <p className="text-muted">Komentar mereka menyadarkan kami: bahwa karya kecil sekalipun bisa membawa dampak besar. Ini bukan akhir—justru awal untuk mencipta yang lebih berarti.</p>
          </div>
          {/* <button
            className="btn btn-primary px-4 py-3 rounded-pill d-flex align-items-center"
            onClick={() => setShowTestimoniForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Testimonial
          </button>*/}
        </div>

        <div className="row g-4">
          {testimoniList.length > 0 ? (
            testimoniList.map((item) => (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <motion.div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 text-custom rounded-circle p-3 me-3">
                        <i className="bi bi-person-fill fs-4"></i>
                      </div>
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">{item.nama}</h5>
                        <small className="text-muted">{item.instansi || 'General Public'}</small>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-warning mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill"></i>
                        ))}
                      </div>
                      <p className="card-text fst-italic text-justify">"{item.pesan}"</p>
                    </div>
                    <div className="mt-auto text-end">
                      <i className="bi bi-quote fs-1 text-custom opacity-10"></i>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-light rounded-4 p-5">
                <i className="bi bi-chat-square-text fs-1 text-muted mb-3"></i>
                <h4 className="fw-semibold mb-3">No Testimonials Yet</h4>
                <p className="text-muted mb-4">Be the first to share your experience with us</p>
                <button className="btn btn-outline-primary rounded-pill" onClick={() => setShowTestimoniForm(true)}>
                  Share Your Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      {showTestimoniForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Testimoni</h5>
                <button type="button" className="btn-close" onClick={() => setShowTestimoniForm(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" placeholder="Nama" className="form-control mb-2" value={newTestimoni.nama} onChange={(e) => setNewTestimoni({ ...newTestimoni, nama: e.target.value })} />
                <input
                  type="text"
                  placeholder="Instansi (opsional)"
                  className="form-control mb-2"
                  value={newTestimoni.instansi}
                  onChange={(e) =>
                    setNewTestimoni({
                      ...newTestimoni,
                      instansi: e.target.value,
                    })
                  }
                />
                <textarea placeholder="Pesan" className="form-control mb-2" rows="4" value={newTestimoni.pesan} onChange={(e) => setNewTestimoni({ ...newTestimoni, pesan: e.target.value })}></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowTestimoniForm(false)}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleSubmitTestimoni}>
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <motion.div className="mt-5 py-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <h2 className="text-center fw-bold mb-5">Mitra Kami</h2>
        <div className="px-2">
          <div
            ref={mitraRef}
            className="slider overflow-hidden w-100"
            style={{
              width: '100vw',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              className="slide-track d-flex align-items-center gap-5 px-5"
              style={{
                width: `${logos.length * 2 * 220}px`,
              }}
            >
              {[...logos, ...logos].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`mitra-${i}`}
                  style={{
                    width: '200px',
                    height: '80px',
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
