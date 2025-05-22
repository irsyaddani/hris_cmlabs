import React from "react";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileUrl,
  fileName,
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("File berhasil diunduh");
  };

  return (
    <Button variant="ghost" className="" size="icon" onClick={handleDownload}>
      <IconDownload />
    </Button>
  );
};

export default DownloadButton;
