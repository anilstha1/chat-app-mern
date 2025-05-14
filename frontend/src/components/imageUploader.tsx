import Dropzone from "react-dropzone";
import {useState} from "react";
import {Image, X} from "lucide-react";

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
}

const ImageUploader = ({onFileChange}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      accept={{
        "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      }}
      maxFiles={1}
      multiple={false}
      disabled={!!preview}
    >
      {({getRootProps, getInputProps, isDragActive}) => (
        <div
          {...getRootProps()}
          className={`p-4 text-center ${
            preview
              ? ""
              : "border-2 border-dashed rounded-lg  cursor-pointer hover:bg-muted/50"
          } transition-colors ${
            isDragActive ? "border-primary" : "border-muted-foreground/25"
          }`}
        >
          <input {...getInputProps()} />{" "}
          {preview ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[8rem] h-[8rem] object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    onFileChange(null);
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4">
              <Image className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop an image or click to select
              </p>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default ImageUploader;
