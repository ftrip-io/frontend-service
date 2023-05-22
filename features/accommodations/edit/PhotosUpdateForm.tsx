import { type FC, FormEvent, useState } from "react";
import { uploadFiles, type ImageOrder, renameFiles } from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { PhotosForm } from "../creation/PhotosForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";

const PhotosUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
  photoUrls,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImageOrder[]>(
    photoUrls?.map((url) => ({ url })) ?? []
  );

  function updateFiles(files: File[]) {
    const allFiles = [...selectedFiles, ...files];
    setSelectedFiles(allFiles);
    return allFiles.length;
  }

  const updateAccommodationPhotos = async () => {
    const deleted = photoUrls?.filter((url) => !imagePreviews.some((ip) => ip.url === url)) ?? [];
    const toRenameOrRemove: { old: string; new?: string }[] = [];
    deleted?.forEach((url) => {
      const name = url.split("/").at(-1);
      if (name) toRenameOrRemove.push({ old: name });
    });
    imagePreviews.forEach((ip, i) => {
      const name = ip.url.split("/").at(-1) ?? "";
      if (ip.index === undefined) {
        const oldIndex = +(name?.split("-", 1).at(0) ?? "");
        if (oldIndex !== i)
          toRenameOrRemove.push({
            old: name,
            new: `${("000" + i).slice(-3)}${name.substring(name.indexOf("-"))}`,
          });
      } else {
        ip.name = `${("000" + i).slice(-3)}-${name}.${selectedFiles[ip.index ?? 0].type
          .split("/")
          .at(1)}`;
      }
    });
    try {
      await uploadFiles(selectedFiles, imagePreviews, accommodation.id);
      const res = await renameFiles(toRenameOrRemove, accommodation.id);
      onSuccess(accommodation, res.data);
    } catch (e: any) {
      onError(e);
    }
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await updateAccommodationPhotos();
  }

  return (
    <form onSubmit={onSubmit}>
      <PhotosForm
        imagePreviews={imagePreviews}
        updateFiles={updateFiles}
        setImagePreviews={setImagePreviews}
      />
      <div className="flex flex-wrap justify-between mt-10">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button>Save changes</Button>
      </div>
    </form>
  );
};

export default PhotosUpdateForm;
