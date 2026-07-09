"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ak-strannik/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@ak-strannik/ui/components/field";
import { Input } from "@ak-strannik/ui/components/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { authClient } from "../../lib/auth-client";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type LoginValues = z.input<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema as never),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values: LoginValues) => {
    setFormError(null);
    const callbackURL = searchParams.get("next") || "/";

    startTransition(async () => {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL,
      });

      if (result.error) {
        setFormError(result.error.message ?? "Unable to sign in.");
        return;
      }

      router.replace(callbackURL);
      router.refresh();
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            aria-invalid={Boolean(form.formState.errors.email)}
            autoComplete="email"
            id="login-email"
            type="email"
            {...form.register("email")}
          />
          {form.formState.errors.email?.message ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            aria-invalid={Boolean(form.formState.errors.password)}
            autoComplete="current-password"
            id="login-password"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password?.message ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
      {formError ? <FieldError>{formError}</FieldError> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
