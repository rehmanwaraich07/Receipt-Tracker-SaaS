"use server";

import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY!;
const client = new SchematicClient({ apiKey });

export async function getTemporaryAccessToken() {
  console.log("Fetching temporary access token...");
  const user = await currentUser();

  if (!user || !user.id) {
    console.log("No Usser Id Found, returning null");
    return null;
  }

  const resp = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    lookup: { id: user.id },
  });

  console.log("Temporary access token fetched successfully:", resp.data?.token);
  return resp.data?.token;
}
