import { useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import plusIcon from "../../../../assets/icons/plus.svg";
import UpdateLoader from "../../../../models/UpdateLoader/UpdateLoader";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

function base64ToBlob(base64Data, contentType) {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}

const array1 = [
  "✅ Upload a clear and recent photo of yourself",
  "🧑‍🦱 Face must be clearly visible – avoid sunglasses or heavy filters",
  "👤 Solo photos only – no group pictures",
  "🪞 Use real, natural photos – no AI images, cartoons, or celebrity pics (It’s ok, if you are the one 😁)",
  "🔒 At least 2 photos are required to activate your profile"
];

const array2 = [
  "📷 Blurry or pixelated images",
  "🚫 Inappropriate or offensive content",
  "📝 Images with text, watermarks, or brand logos",
  "🕵️‍♂️ Uploading someone else’s photo"
];

const Upload = ({ onNext, viewportHeight }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prevImages => {
          const newImages = [...prevImages];
          newImages[index] = {
            src: reader.result,
            fileName: file.name,
            type: file.type
          };
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSavePhotos = async () => {

    const newImages = images.filter(img => img && !(img?.src ? img?.src?.startsWith('https') : img?.startsWith('https')));

    if (newImages.length === 0) {
      setErrorMessage("No images are selected");
      setIsErrorPopupVisible(true);
      return;
    }

    if (newImages.filter(img => img !== null).length < 2) {
      setErrorMessage("Please upload at least 2 photos.");
      setIsErrorPopupVisible(true);
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img && !(img?.src ? img?.src?.startsWith('https') : img?.startsWith('https'))) {
        const fileName = img?.fileName || `photo${i + 1}.png`;
        const blob = base64ToBlob(img?.src ? img.src : img, img.type || 'image/png');
        const file = new File([blob], `${i} ${fileName}`, { type: img.type || 'image/png' });
        formData.append(`images`, file);
      }
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/upload-photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext();
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="inside-detail-container"
      style={{ height: viewportHeight - 160 }}
    >
      <div className="edit-profile-form add-photos-form">

        <div className="inside-detail-subcontainer">

          <div className="photo-grid">
            {images.map((img, index) => (
              <div className="photo-box" key={index}>
                <label htmlFor={`upload-${index}`} className="upload-label">
                  {img ? (
                    <div className="uploaded-image-container">
                      <img
                        src={img?.src || img}
                        alt={`uploaded-${index}`}
                        className="uploaded-image"
                      />
                    </div>
                  ) : (
                    <div className="plus-icon-container">
                      <img src={plusIcon} alt="plus" className="plus-icon" />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id={`upload-${index}`}
                  onChange={(e) => handleImageChange(e, index)}
                  style={{ display: 'none' }}
                />
              </div>
            ))}{" "}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 14, color: '#696969', marginTop: 12 }}>
          Upload at least 2 high resolution photos for better engagement
        </div>
        {loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 14, color: '#696969', marginTop: 8 }}>
            Uploading may take up a minute, please wait...
          </div>
        )}

        <div style={{ width: "100%", marginTop: 18 }}>
          <p style={{ fontSize: 16, marginBottom: 12, marginTop: "4px" }}>📸 Profile Photo Guidelines</p>
          <div style={{ marginBottom: 20 }}>
            {array1.map((text, idx) => (
              <p key={idx} style={{ fontSize: 14, color: "#333", marginBottom: idx < 4 ? 12 : 0, marginTop: "4px" }}>{text}</p>
            ))}
          </div>

          <p style={{ fontSize: 16, marginBottom: 12, marginTop: "4px" }}>🚫 Avoid These</p>
          <div>
            {array2.map((text, idx) => (
              <p key={idx} style={{ fontSize: 14, color: "#333", marginBottom: idx < 3 ? 12 : 0, marginTop: "4px" }}>{text}</p>
            ))}
          </div>
        </div>
      </div>

      <button className="get-started-btn" onClick={handleSavePhotos} disabled={loading}>
        {loading ?
          <UpdateLoader color="#fff" />
          :
          "Continue"
        }
      </button>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default Upload;
