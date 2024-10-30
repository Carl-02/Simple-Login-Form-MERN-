import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Transition } from "@headlessui/react";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/local",
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Login successful!");
        console.log("User Data:", response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      setShowError(true);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiscord = () => {
    window.location.href = "http://localhost:3000/api/auth/discord"; // Redirect to Discord OAuth
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
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
            <div className="mb-4 text-red-600">{errorMessage}</div>
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
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center my-4">OR</div>
        <button
          onClick={handleDiscord}
          type="button"
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
        >
          Login with Discord
        </button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
