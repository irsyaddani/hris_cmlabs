"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTrash, IconUpload } from "@tabler/icons-react";

export default function UploadFile() {
  // Explicitly type file as File | null
  const [file, setFile] = useState<File | null>(null);

  // Type the event as React.ChangeEvent<HTMLInputElement>
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Type the event as React.FormEvent<HTMLFormElement>
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      console.log("Uploading file:", file);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-3">
                <IconUpload className="w-10 h-10 text-gray-400" />
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {file && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button type="reset" variant="ghost">
                <IconTrash className="w-8 h-8 text-danger-main" />
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
