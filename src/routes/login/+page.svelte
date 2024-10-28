<script lang="ts">
  import * as Form from "$ui/form";
  import { Input } from "$ui/input";
  import { superForm } from "sveltekit-superforms";
  import Loader from "lucide-svelte/icons/loader";

  // Props
  const { data } = $props();
  const loginForm = superForm(data.loginForm);
  const { form: loginData, delayed: loginDelayed, submitting: loginSubmitting, enhance: loginEnhance } = loginForm;
</script>

<svelte:head>
  <title>Login - Ffi</title>
</svelte:head>

<div class="flex h-screen items-center justify-center px-4">
  <div class="max-w-xs flex-grow">
    <h1 class="mb-2 text-2xl font-bold">Login</h1>

    <form class="grid gap-2" method="post" action="?/login" use:loginEnhance>
      <Form.Field form={loginForm} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} bind:value={$loginData.email} type="email" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field form={loginForm} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input {...attrs} bind:value={$loginData.password} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button disabled={$loginSubmitting}>
        {#if $loginDelayed}
          <Loader class="animate-spin" />
        {:else}
          Login
        {/if}
      </Form.Button>
    </form>

    <p class="mt-4 text-center">
      Don't have an account? <a class="underline" href="/register">Register</a>
    </p>
  </div>
</div>
