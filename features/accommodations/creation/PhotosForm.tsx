import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Image from "next/image";
import { ChangeEvent, type FC, useState } from "react";
import { type ImageOrder } from "../accommodationActions";

type PhotosFormProps = {
  imagePreviews: ImageOrder[];
  updateFiles: (files: File[]) => number;
  setImagePreviews: (images: ImageOrder[]) => void;
};

export const PhotosForm: FC<PhotosFormProps> = ({
  imagePreviews,
  updateFiles,
  setImagePreviews,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>();

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const n = updateFiles(files);
    const i0 = n - files.length;
    setImagePreviews([
      ...imagePreviews,
      ...files.map((file, i) => ({ url: URL.createObjectURL(file), index: i0 + i })),
    ]);
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
    setImagePreviews(imagePreviews);
  };

  const deleteImage = (img: ImageOrder) => {
    setSelectedImage(undefined);
    setImagePreviews(imagePreviews.filter((io) => io !== img));
  };

  return (
    <div>
      <h3 className="text-xl mb-6 font-semibold">Liven up your listing with photos</h3>
      <div className="flex justify-center">
        <div className="max-w-2xl rounded-lg bg-gray-50 m-2">
          <label className="flex flex-col w-full h-16 border-4 border-blue-300 border-dashed hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center cursor-pointer">
              <CloudArrowUpIcon className="w-8 h-8 text-gray-500" />
              <p className="pt-1 text-sm tracking-wider text-gray-500">Upload photos</p>
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3">
          {imagePreviews.map((img, i) => (
            <div
              key={img.url}
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
