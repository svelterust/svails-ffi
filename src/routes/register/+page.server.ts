import { z } from "zod";
import { zod } from "sveltekit-superforms/adapters";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { login, register } from "$lib/session";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be minimum 8 characters" }),
});

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    registerForm: await superValidate(zod(registerSchema)),
  };
};

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    // Validate form
    const registerForm = await superValidate(request, zod(registerSchema));
    if (!registerForm.valid) return fail(400, { registerForm });
    const { email, password } = registerForm.data;

    // Register then login user
    try {
      await register(email, password);
      await login(email, password, cookies);
    } catch (error) {
      return setError(registerForm, "password", "Failed to create account");
    }
    return redirect(303, "/");
  },
};
