import supabase from "./supabase";

export async function getGuests() {
  let { data: guests, error } = await supabase
    .from("guests")
    .select("id, fullName")

  if (error) {
    console.error(error);
    throw new Error("Guests could not be loaded");
  }

  return guests;
}