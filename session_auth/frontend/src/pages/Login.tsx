import React, { useId, useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  // Generates unique, stable IDs for SSR and a11y linking
  const emailInputId = useId();
  const emailHintId = useId();
  const emailErrorId = useId();

  const passwordInputId = useId();
  const passwordErrorId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
    }

    setIsSubmitting(false);
  };

  const hasErrors = Boolean(errors.email || errors.password);

  return (
    <section className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>

        {/* 1. Global Live Region for Errors */}
        {hasErrors && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium text-sm"
          >
            <span className="sr-only">Error:</span> Please correct the errors
            below to continue.
          </div>
        )}

        {/* 2. Email Field Group */}
        <div className="mb-4">
          <label
            htmlFor={emailInputId}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Email Address{" "}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </label>

          <input
            id={emailInputId}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            required
            aria-required="true"
            aria-describedby={`${emailHintId} ${errors.email ? emailErrorId : ""}`.trim()}
            aria-invalid={errors.email ? "true" : "false"}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          />

          {/* Dynamic Error Messaging */}
          {errors.email && (
            <p
              id={emailErrorId}
              className="mt-1 text-sm text-red-600 font-medium"
            >
              {errors.email}
            </p>
          )}

          {/* Contextual Hint */}
          <p id={emailHintId} className="mt-1 text-sm text-gray-500">
            We will never share your email with anyone else.
          </p>
        </div>

        {/* 3. Password Field Group */}
        <div className="mb-6">
          <label
            htmlFor={passwordInputId}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Password{" "}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </label>

          <input
            id={passwordInputId}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            required
            aria-required="true"
            aria-describedby={errors.password ? passwordErrorId : undefined}
            aria-invalid={errors.password ? "true" : "false"}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          />

          {/* Dynamic Error Messaging */}
          {errors.password && (
            <p
              id={passwordErrorId}
              className="mt-1 text-sm text-red-600 font-medium"
            >
              {errors.password}
            </p>
          )}
        </div>

        {/* 4. Accessible Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        <p>
          Don't have an account?{" "}
          <Link to={"/register"} className="text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
