import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, TextField, Snackbar, Alert } from "@mui/material";

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
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) {
      return;
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
    <Container component="main" maxWidth="xs">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Dashboard
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {loading ? (
            <Typography>Loading user information...</Typography>
          ) : userInfo ? (
            <div>
              <Typography variant="body1">Welcome!</Typography>
              {isEditing ? (
                <div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    value={updatedUser.email}
                    onChange={handleChange}
                    disabled={userInfo.loginMethod === "discord"} // Disable for Discord login
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="displayName"
                    label="Display Name"
                    value={updatedUser.displayName}
                    onChange={handleChange}
                    disabled={userInfo.loginMethod === "discord"} // Disable for Discord login
                  />
                  <Button
                    onClick={handleSave}
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  >
                    Save
                  </Button>
                  <Button onClick={handleCancel} type="button" variant="outlined" color="secondary" fullWidth>
                    Cancel
                  </Button>
                  <Typography variant="h6" style={{ marginTop: "16px" }}>
                    Change Password
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    value={passwordInfo.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={passwordInfo.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <Button
                    onClick={handlePasswordUpdate}
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  >
                    Update Password
                  </Button>
                </div>
              ) : (
                <>
                  {/* Show all user information for local login */}
                  {userInfo.provider === "local" ? (
                    <>
                      <Typography>ID: {userInfo._id}</Typography>
                      <Typography>Username: {userInfo.username}</Typography>
                      <Typography>Email: {userInfo.email}</Typography>
                      <Typography>Display Name: {userInfo.displayName}</Typography>
                      <Button
                        onClick={handleEdit}
                        type="button"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ marginTop: "16px" }}
                      >
                        Edit User
                      </Button>
                      <Button
                        onClick={handleDeleteAccount}
                        type="button"
                        variant="contained"
                        color="error"
                        fullWidth
                        style={{ marginTop: "16px" }}
                      >
                        Delete Account
                      </Button>
                    </>
                  ) : (
                    // Show only ID and username for Discord login
                    <>
                      <Typography>ID: {userInfo._id}</Typography>
                      <Typography>Username: {userInfo.username}</Typography>
                    </>
                  )}
                </>
              )}
              <Button
                onClick={handleLogout}
                type="button"
                variant="outlined"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Typography>No user information available.</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
