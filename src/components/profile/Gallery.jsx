import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Skeleton from "react-loading-skeleton";

export default function Gallery({ profileData }) {
	const [loadedImages, setLoadedImages] = useState({});

	const handleImageLoad = (index) => {
		setLoadedImages((prev) => ({ ...prev, [index]: true }));
	};

	return (
		<PhotoProvider>
			<div className="gallery">
				{profileData?.photos?.map((src, i) => {
					const isLoaded = loadedImages[i];
					return (
						<div key={i}>
							{!isLoaded && <Skeleton height={220} width={170} />}
							<PhotoView src={src}>
								<img
									src={src}
									alt={`photo-${i}`}
									onLoad={() => handleImageLoad(i)}
									className={`thumb ${isLoaded ? "visible" : "hidden"} ${profileData?.photos?.length === 2 ? "two" : ""
										}`}
								/>
							</PhotoView>
						</div>
					);
				})}
			</div>
		</PhotoProvider>
	);
}
