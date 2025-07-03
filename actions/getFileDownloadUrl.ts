"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";

export async function getFileDownloadUrl(fileId: Id<"_storage"> | string) {
  try {
    const downloadUrl = await convex.query(api.receipts.getReceiptDonwloadUrl, {
      fileId: fileId as Id<"_storage">,
    });

    if (!downloadUrl) {
      throw new Error("could not generate the URL");
    }

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error in Generating the File URL: ", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unkown error occurred",
    };
  }
}
