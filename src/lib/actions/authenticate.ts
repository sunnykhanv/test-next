"use server";
import { signIn, signOut } from "@/lib/next-auth/auth";

export async function credentialsSigning(formData: FormData) {
  formData.append("redirect", "false");
  return await signIn("credentials", formData);
}

export async function logout() {
  return await signOut();
}
