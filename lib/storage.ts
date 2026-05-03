import { supabase } from "./supabase";

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ext(filename: string) {
  return filename.split(".").pop() ?? "bin";
}

export async function uploadArtwork(file: File): Promise<string> {
  const path = `uploads/${randomId()}.${ext(file.name)}`;
  const { error } = await supabase.storage.from("artwork").upload(path, file);
  if (error) throw new Error(error.message);
  return supabase.storage.from("artwork").getPublicUrl(path).data.publicUrl;
}

export async function uploadProof(file: File, orderId: string): Promise<string> {
  const path = `${orderId}/${randomId()}.${ext(file.name)}`;
  const { error } = await supabase.storage.from("proofs").upload(path, file);
  if (error) throw new Error(error.message);
  return supabase.storage.from("proofs").getPublicUrl(path).data.publicUrl;
}
