import { z } from "zod";
import { zod } from "sveltekit-superforms/adapters";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { login } from "$lib/session";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be minimum 8 characters" }),
});

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    loginForm: await superValidate(zod(loginSchema)),
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    // Validate form
    const loginForm = await superValidate(request, zod(loginSchema));
    if (!loginForm.valid) return fail(400, { loginForm });
    const { email, password } = loginForm.data;

    // Login user
    try {
      await login(email, password, cookies);
    } catch (error) {
      return setError(loginForm, "password", "Email or password is invalid");
    }
    return redirect(303, "/");
  },
};
