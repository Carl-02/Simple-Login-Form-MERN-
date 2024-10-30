import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
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

  const theme = createTheme({
    palette: {
      mode: "light", // Set to dark mode for consistency
    },
  });

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
        navigate("/"); // Navigate to the login or home page after registration
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
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ bgcolor: "background.paper", padding: 4, borderRadius: 2, boxShadow: 3 }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Create Account
          </Typography>
          <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
            <Alert onClose={() => setShowError(false)} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "background.default", // Set input background color to match dark mode
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "background.default", // Set input background color to match dark mode
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "background.default", // Set input background color to match dark mode
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "background.default", // Set input background color to match dark mode
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="displayName"
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayname(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "background.default", // Set input background color to match dark mode
              },
            }}
          />

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

          <Typography align="center" mt={2}>
            Already have an account?{" "}
            <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterForm;
