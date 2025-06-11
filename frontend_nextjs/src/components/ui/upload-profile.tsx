import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconCamera, IconUpload, IconX } from "@tabler/icons-react";

type SimpleProfileUploadProps = {
  onChange: (file: File) => void;
};

export default function SimpleProfileUpload({ onChange }: SimpleProfileUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        alert("Please select a valid image file (JPEG, PNG, GIF)");
        return;
      }

      setSelectedImage(file);
      onChange(file); // ✅ Tambahkan ini agar file dikirim ke parent form

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-6">
      {/* Profile Picture Circle */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors bg-neutral-50 overflow-hidden group"
          onClick={handleUploadClick}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-full"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <IconCamera className="h-6 w-6 text-white" />
              </div>
            </>
          ) : (
            <IconCamera className="h-8 w-8 text-neutral-400" />
          )}
        </div>

        {/* Remove button when image is selected */}
        {preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-danger-main hover:bg-danger-hover text-white rounded-full flex items-center justify-center transition-colors"
            title="Remove image"
          >
            <IconX className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex-1 space-y-3">
        <div className="flex gap-3">
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <IconUpload className="h-4 w-4" />
            Upload profile photo
          </Button>
          {/* 
          {selectedImage && (
            <Button
              onClick={() => {
                console.log("Uploading file:", selectedImage);
                alert("Profile picture uploaded successfully!");
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Upload Picture
            </Button>
          )} */}
        </div>

        {selectedImage ? (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{selectedImage.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Click the circle or "Choose File" to select your profile picture
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
