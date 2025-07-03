"use client";

import { uploadPDF } from "@/actions/uploadPDF";
import { useUser } from "@clerk/clerk-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";

const PDFDropzone = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const router = useRouter();
  const { user } = useUser();
  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    featureAllocation,
    featureUsage,
  } = useSchematicEntitlement("scans");

  //   console.log("Feature Enabled: ", isFeatureEnabled);
  //   console.log("Feature Usage: ", featureUsage);
  //   console.log("Feature Allocation: ", featureAllocation);
  //   console.log("Feature Exceeded: ", featureUsageExceeded);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      console.log(files);
      if (!user) {
        alert("Please Sign in to Upload the File");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter((file) => {
        file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");
      });

      if (pdfFiles.length === 0) {
        alert("Please Drop the PDF Files.");
        return;
      }

      setIsUploading(true);

      try {
        // Uplaod Files
        const newUploadedFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const result = await uploadPDF(formData);

          if (!result.success) {
            throw new Error(result.error);
          }
          newUploadedFiles.push(file.name);

          setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

          setTimeout(() => {
            setUploadedFiles([]);
          }, 5000);

          router.push("/receipts");
        }
      } catch (error) {
        console.error("Upload Failed: ", error);
        alert(
          `Upload Failed: ${error instanceof Error ? error.message : "Unknown Error"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user, router],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      console.log("File Dropped");

      if (!user) {
        console.log("Please Sign in to Upload files");
        return null;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [user, handleUpload],
  );

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrag={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"} ${!canUpload ? "opacity-70 cursor-not-allowed" : ""} `}
        ></div>
      </div>
    </DndContext>
  );
};

export default PDFDropzone;
