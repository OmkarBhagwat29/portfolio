import { SignupFormSchema } from "../libs/definitions";
import bcrypt from "bcryptjs";

export async function signup(formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log({
      errors: validatedFields.error.flatten().fieldErrors,
    });

    return;
    // return {
    //   errors: validatedFields.error.flatten().fieldErrors,
    // };
  }
  const { name, email, password } = validatedFields.data;

  const res = await fetch("https://localhost:7180/api/authentication", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(res);
}
