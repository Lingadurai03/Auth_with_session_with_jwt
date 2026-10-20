import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function Register() {
  // Stable IDs for SSR & accessible relationships
  const nameInputId = useId();
  const nameErrorId = useId();

  const emailInputId = useId();
  const emailHintId = useId();
  const emailErrorId = useId();

  const passwordInputId = useId();
  const passwordHintId = useId();
  const passwordErrorId = useId();

  const confirmPasswordInputId = useId();
  const confirmPasswordErrorId = useId();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear individual field errors on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please retype your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setGlobalError("Please fix the highlighted errors before continuing.");
      return false;
    }

    setGlobalError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      alert("Account created successfully!");
    } else {
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-md w-full p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Create an Account
        </h2>

        {/* Global Live Region */}
        {globalError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium text-sm"
          >
            <span className="sr-only">Form Error:</span> {globalError}
          </div>
        )}

        {/* 1. Full Name */}
        <div className="mb-5">
          <label
            htmlFor={nameInputId}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Full Name{" "}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </label>
          <input
            id={nameInputId}
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={errors.name ? nameErrorId : undefined}
            aria-invalid={Boolean(errors.name)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
              errors.name
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.name && (
            <p
              id={nameErrorId}
              className="mt-1 text-sm text-red-600 font-medium"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. Email Address */}
        <div className="mb-5">
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
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={`${emailHintId} ${errors.email ? emailErrorId : ""}`.trim()}
            aria-invalid={Boolean(errors.email)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
              errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.email && (
            <p
              id={emailErrorId}
              className="mt-1 text-sm text-red-600 font-medium"
            >
              {errors.email}
            </p>
          )}
          <p id={emailHintId} className="mt-1 text-sm text-gray-500">
            We will never share your email with anyone else.
          </p>
        </div>

        {/* 3. Password */}
        <div className="mb-5">
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
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={`${passwordHintId} ${errors.password ? passwordErrorId : ""}`.trim()}
            aria-invalid={Boolean(errors.password)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
              errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.password && (
            <p
              id={passwordErrorId}
              className="mt-1 text-sm text-red-600 font-medium"
            >
              {errors.password}
            </p>
          )}
          <p id={passwordHintId} className="mt-1 text-sm text-gray-500">
            Must be at least 8 characters.
          </p>
        </div>

        {/* 4. Retype Password */}
        <div className="mb-6">
          <label
            htmlFor={confirmPasswordInputId}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Retype Password{" "}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </label>
          <input
            id={confirmPasswordInputId}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={
              errors.confirmPassword ? confirmPasswordErrorId : undefined
            }
            aria-invalid={Boolean(errors.confirmPassword)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.confirmPassword && (
            <p
              id={confirmPasswordErrorId}
              className="mt-1 text-sm text-red-600 font-medium"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* 6. Submit Button */}
        <Button type="submit" title="Submit" />
        <p>
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
