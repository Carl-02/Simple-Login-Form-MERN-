import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Transition } from "@headlessui/react";
import axios from "axios";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayname] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setLoading(true);

    // Simple validation for matching passwords
    if (password !== confirmPassword) {
      setShowError(true);
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users",
        { username, password, email, displayName },
        { withCredentials: true }
      );

      if (response.status === 201) {
        console.log("Registration successful!");
        navigate("/");
      }
    } catch (error) {
      setShowError(true);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Registration failed");
        console.error("Registration error:", error.response.data);
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {showError && (
          <Transition
            show={showError}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="mb-4 text-red-600" aria-live="assertive">
              {errorMessage}
            </div>
          </Transition>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="displayname" className="block text-sm font-medium">
            DisplayName
          </label>
          <input
            type="text"
            id="displayname"
            value={displayName}
            onChange={(e) => setDisplayname(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
