import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordInfo, setPasswordInfo] = useState({ currentPassword: "", newPassword: "" });
  const navigate = useNavigate();

  // FETCH USER FROM DATABASE
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/status", {
        withCredentials: true,
      });
      setUserInfo(response.data);
      setUpdatedUser(response.data);
    } catch (error) {
      setError("Failed to fetch user information. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUserInfo(null);
      navigate("/");
    } catch (error) {
      setError("Failed to log out. Please try again.");
      console.error(error);
    }
  };

  // SHOW EDIT
  const handleEdit = () => {
    setIsEditing(true);
  };

  // CHANGING USER INFO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // FETCH CHANGE PASSWORD
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  };

  // FETCH SAVE USER INFO
  const handleSave = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/users/${userInfo._id}`, updatedUser, {
        withCredentials: true,
      });

      setUserInfo(response.data.user);
      setSuccessMessage("User information updated successfully.");

      if (passwordInfo.newPassword) {
        await handlePasswordUpdate();
      }

      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Failed to update user information. Please try again.");
      console.error(error);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/users/${userInfo._id}/password`, passwordInfo, {
        withCredentials: true,
      });
      setSuccessMessage("Password updated successfully.");
      setPasswordInfo({ currentPassword: "", newPassword: "" });
      setError(null);
    } catch (error) {
      setError("Failed to update password. Please try again.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedUser(userInfo);
  };

  // DELETE USER ACCOUNT
  const handleDeleteAccount = async () => {
    // Confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) {
      return; // Exit if the user cancels
    }

    try {
      await axios.delete(`http://localhost:3000/api/users/${userInfo._id}`, {
        withCredentials: true,
      });
      setSuccessMessage("Account deleted successfully.");
      setUserInfo(null);
      navigate("/");
    } catch (error) {
      setError("Failed to delete account. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {loading ? (
          <p>Loading user information...</p>
        ) : userInfo ? (
          <div>
            <p className="mb-2">Welcome!</p>
            {isEditing ? (
              <div>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-1 mb-2 w-full"
                />
                <input
                  type="text"
                  name="displayName"
                  value={updatedUser.displayName}
                  onChange={handleChange}
                  placeholder="Display Name"
                  className="border p-1 mb-2 w-full"
                />
                <button
                  onClick={handleSave}
                  type="button"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 transition mb-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 transition"
                >
                  Cancel
                </button>
                <h3 className="text-lg font-semibold mt-4">Change Password</h3>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordInfo.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="border p-1 mb-2 w-full"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordInfo.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="border p-1 mb-2 w-full"
                />
                <button
                  onClick={handlePasswordUpdate}
                  type="button"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition mb-2"
                >
                  Update Password
                </button>
              </div>
            ) : (
              <>
                <p>ID: {userInfo._id}</p>
                <p>Username: {userInfo.username}</p>
                <p>Email: {userInfo.email}</p>
                <p>DisplayName: {userInfo.displayName}</p>
                <br />
                <button
                  onClick={handleEdit}
                  type="button"
                  className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
                >
                  Edit User
                </button>
              </>
            )}
            <br />
            <button
              onClick={handleDeleteAccount}
              type="button"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 transition"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <p>No user information available.</p>
        )}
        <br />
        <button
          onClick={handleLogout}
          type="button"
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
