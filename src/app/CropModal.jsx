import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./utils/cropImageHelper"; // kita bikin fungsi util crop di bawah
import { Modal, Button } from "react-bootstrap";

const CropModal = ({ imageSrc, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Crop Foto</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "400px", position: "relative" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleCrop}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CropModal;
