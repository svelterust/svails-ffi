<script lang="ts">
  import * as Form from "$ui/form";
  import { Input } from "$ui/input";
  import { superForm } from "sveltekit-superforms";
  import Loader from "lucide-svelte/icons/loader";

  // Props
  const { data } = $props();
  const registerForm = superForm(data.registerForm);
  const { form: registerData, delayed: registerDelayed, submitting: registerSubmitting, enhance: registerEnhance } = registerForm;
</script>

<svelte:head>
  <title>Register - Ffi</title>
</svelte:head>

<div class="flex h-screen items-center justify-center px-4">
  <div class="max-w-xs flex-grow">
    <h1 class="mb-2 text-2xl font-bold">Register</h1>

    <form class="grid gap-2" method="post" action="?/register" use:registerEnhance>
      <Form.Field form={registerForm} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} bind:value={$registerData.email} type="email" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field form={registerForm} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input {...attrs} bind:value={$registerData.password} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button disabled={$registerSubmitting}>
        {#if $registerDelayed}
          <Loader class="animate-spin" />
        {:else}
          Register
        {/if}
      </Form.Button>
    </form>

    <p class="mt-4 text-center">
      Already have an account? <a class="underline" href="/login">Login</a>
    </p>
  </div>
</div>
