"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { useUser } from "@clerk/clerk-react";
import { getFileDownloadUrl } from "./getFileDownloadUrl";

export async function uploadPDF(formData: FormData) {
  const { user } = await useUser();

  if (!user) {
    return { success: false, error: "not Authorized" };
  }

  try {
    // get file from FormData
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No File Provided" };
    }

    // Validate the file
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      return { success: false, error: "only PDF Files are allowed" };
    }

    // get upload URL from Convex
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});

    // convert the fie to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // upload the file to convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Failed to Upload the File: ${uploadResponse.statusText}`,
      );
    }

    // get storage from the database
    const { storageId } = await uploadResponse.json();

    // add the receipt to db
    const receipId = await convex.mutation(api.receipts.storeReceipt, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    // generate the file URL

    const fileUrl = await getFileDownloadUrl(storageId);

    // TODO: Trigger inngest agent flow....

    return {
      success: true,
      data: {
        receipId,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error("Server action upload error: ", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "an Unknown Error occurred",
    };
  }
}
