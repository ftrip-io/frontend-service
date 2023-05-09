import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Image from "next/image";
import { ChangeEvent, type FC, useState } from "react";

export type ImageOrder = {
  url: string;
  index: number;
};

type PhotosFormProps = {
  imagePreviews: ImageOrder[];
  updateFiles: (files: any) => void;
  updateImagePreviews: (images: ImageOrder[]) => void;
};

export const PhotosForm: FC<PhotosFormProps> = ({
  imagePreviews,
  updateFiles,
  updateImagePreviews,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>();

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    let images = [];
    const files = event.target.files ?? [];
    for (let i = 0; i < files.length; i++) {
      images.push({ url: URL.createObjectURL(files[i]), index: i });
    }
    updateFiles(files);
    updateImagePreviews(images);
  };

  const moveBefore = (img: ImageOrder) => {
    if (selectedImage === undefined) return;
    if (imagePreviews[selectedImage] === img) {
      setSelectedImage(undefined);
      return;
    }
    const imageToMove = imagePreviews.splice(selectedImage, 1)[0];
    imagePreviews.splice(imagePreviews.indexOf(img), 0, imageToMove);
    setSelectedImage(undefined);
    updateImagePreviews(imagePreviews);
  };

  const deleteImage = (img: ImageOrder) => {
    setSelectedImage(undefined);
    updateImagePreviews(imagePreviews.filter((io) => io !== img));
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-2xl rounded-lg bg-gray-50 m-2">
          <label className="flex flex-col w-full h-16 border-4 border-blue-200 border-dashed hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                Upload photos
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={selectFiles}
              className="opacity-0"
            />
          </label>
        </div>
      </div>

      {imagePreviews && (
        <div className="grid grid-cols-3">
          {imagePreviews.map((img, i) => (
            <div
              key={img.index}
              className={`w-full items-center flex relative ${
                selectedImage === i ? "bg-blue-400" : ""
              }`}
            >
              {selectedImage === i && (
                <div className="absolute top-1 right-1 ">
                  <button
                    type="button"
                    onClick={() => deleteImage(img)}
                    className="bg-blue-400 rounded-sm"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              {selectedImage !== undefined && (
                <div
                  className="border-4 h-4/5 cursor-pointer border-dashed hover:border-blue-400"
                  onClick={() => moveBefore(img)}
                ></div>
              )}
              <div>
                <Image
                  src={img.url}
                  alt={"image-" + i}
                  width={1000}
                  height={1000}
                  className="h-auto w-full p-2"
                  onClick={() => setSelectedImage(i)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
