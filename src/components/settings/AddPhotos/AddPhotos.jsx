import { useContext, useEffect, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-skeleton-image';
import { toast } from 'react-toastify';
import API_URL from '../../../../config';
import { clientAuth } from '../../../../firebase';
import plusIcon from '../../../assets/icons/plus.svg'; // your "+" icon
import { AppContext } from '../../../context/AppContext';
import UpdateLoader from '../../../models/UpdateLoader/UpdateLoader';
import './AddPhotos.css';
import YesNoModal from '../../../models/YesNoModal/YesNoModal';

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

const AddPhotos = () => {
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([null, null, null, null]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [touchStartIndex, setTouchStartIndex] = useState(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  useEffect(() => {
    if (!globalData.photos) return;
    const loaded = globalData.photos || [];
    const padded = [...loaded, ...Array(4 - loaded.length).fill(null)];
    setImages(padded);
    setIsLoading(false);
  }, [globalData]);

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

  const [isPhotoReArranged, setIsPhotoReArranged] = useState(false);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages[draggedIndex] = newImages[index];
    newImages[index] = draggedImage;
    setImages(newImages);
    setIsPhotoReArranged(true);
    setDraggedIndex(null);
  };

  const handleDeletePhoto = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    setIsPhotoReArranged(true);
  };
  const handleTouchStart = (e, index) => {
    if (images[index] !== null) {
      setTouchStartIndex(index);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartIndex === null) return;
    e.preventDefault(); // REQUIRED
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();

    if (touchStartIndex === null) return;

    const touch = e.changedTouches[0];

    const target = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    if (!target) {
      setTouchStartIndex(null);
      return;
    }

    const dropBox = target.closest('.photo-box');
    const dropIndex = dropBox?.dataset?.index;

    if (
      dropIndex === undefined ||
      dropIndex === null ||
      Number(dropIndex) === touchStartIndex ||
      images[dropIndex] === null
    ) {
      setTouchStartIndex(null);
      return;
    }

    const newImages = [...images];
    [newImages[touchStartIndex], newImages[dropIndex]] =
      [newImages[dropIndex], newImages[touchStartIndex]];

    setImages(newImages);
    setIsPhotoReArranged(true);
    setTouchStartIndex(null);
  };


  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const [loading, setLoading] = useState(false);

  const handleSavePhotos = async () => {
    if (!isPhotoReArranged) {
      const newImages = images.filter(img => img && !(img?.src ? img?.src?.startsWith('https') : img?.startsWith('https')));

      if (newImages.length === 0) {
        setErrorMessage("No new images to upload, All selected images are already uploaded.");
        setIsErrorPopupVisible(true);
        return;
      }
    }

    if (images.filter(img => img !== null).length < 2) {
      setErrorMessage("Please upload at least 2 photos");
      setIsErrorPopupVisible(true);
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img && !(img?.src ? img?.src?.startsWith('https') : img?.startsWith('https'))) {
        // If base64, convert to File
        const fileName = img?.fileName || `photo${i + 1}.png`;
        const blob = base64ToBlob(img?.src ? img.src : img, img.type || 'image/png');
        const file = new File([blob], `${i} ${fileName}`, { type: img.type || 'image/png' });
        if (i === 0) {
          formData.append('profilePic', file);
        } else {
          formData.append(`images`, file);
        }
      } else if (img && (img?.src ? img?.src?.startsWith('https') : img?.startsWith('https'))) {
        // Already uploaded
        if (i === 0) {
          formData.append('uploadedProfilePic', img);
        } else {
          formData.append('uploadedImages', img);
        }
      }
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/update-photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.error || "Something went wrong. Please try again.");

      setGlobalData(prev => ({
        ...prev,
        photos: data
      }));
      await clientAuth.currentUser.reload();
      setImages(data ?? [null, null, null, null]);
      setIsSuccessPopupVisible(true);
    } catch (error) {
      setErrorMessage(error?.message || "Something went wrong. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Add Photos</p>
        </div>
      </div>
      <div className="edit-profile-details">
        <div>
          <div className='desktop-only'>
            <h2 className="account-title">Add Photos</h2>
          </div>
          <div className="edit-profile-form add-photos-form">
            <div className="photo-grid">
              {
                isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} height={220} width={170} style={{ borderRadius: '8px' }} />
                  ))
                ) : (
                  images.map((img, index) => (
                    <div className="photo-box" key={index} data-index={index}>
                      <label htmlFor={`upload-${index}`} className="upload-label">
                        {img ? (
                          <div
                            className="uploaded-image-container"
                            draggable={img !== null}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            onContextMenu={handleContextMenu}
                            onTouchStart={(e) => {
                              if (e.target.closest('.delete-photo-btn')) {
                                e.stopPropagation();
                                return;
                              }
                              handleTouchStart(e, index);
                            }}
                            onTouchMove={(e) => {
                              if (e.target.closest('.delete-photo-btn')) return;
                              handleTouchMove(e);
                            }}
                            onTouchEnd={(e) => {
                              if (e.target.closest('.delete-photo-btn')) return;
                              handleTouchEnd(e);
                            }}
                            style={{
                              opacity: draggedIndex === index || touchStartIndex === index ? 0.5 : 1,
                              cursor: img !== null ? 'grab' : 'pointer',
                              transition: 'opacity 0.2s ease',
                              position: 'relative',
                              touchAction: 'none',
                              userSelect: 'none',
                              WebkitUserSelect: 'none',
                              WebkitTouchCallout: 'none'
                            }}
                          >
                            <Image
                              src={img?.src || img}
                              alt={`uploaded-${index}`}
                              className="uploaded-image"
                              style={{
                                pointerEvents: 'none',
                                userSelect: 'none'
                              }}
                            />
                            <button
                              type="button"
                              className="delete-photo-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeletePhoto(index);
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeletePhoto(index);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div
                            className="plus-icon-container"
                            key={index}
                            draggable={img !== null}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                          >
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
                  ))

                )}
            </div>

            <p style={{ flexWrap: "wrap", width: "80%", fontSize: 14, color: "#696969" }}>
              Upload at least 2 high resolution photos for better engagement
            </p>
            {loading && (
              <p style={{ flexWrap: "wrap", width: "80%", fontSize: 14, color: "#696969" }}>
                Uploading may take up a minute, please wait...
              </p>
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
          {/* <div> */}
          <button
            className="save-btn add-photos-btn"
            style={{
              marginTop: "10px",
              fontSize: "16px",
              width: "100%"
            }}
            onClick={handleSavePhotos}
            disabled={loading}
          >
            {loading ? <UpdateLoader /> : "Save Photos"}
          </button>
          {/* </div> */}
        </div>
      </div>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />
      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading="Success"
        data={"Your images have been successfully uploaded."}
        buttonText="Ok"
      />
    </>
  );
};

export default AddPhotos;
