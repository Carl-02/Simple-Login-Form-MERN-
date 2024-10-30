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

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: "light", // Change to "dark" for dark mode
    },
  });

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
        navigate("/navbar");
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
            Login
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
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Typography align="center" my={2}>
            OR
          </Typography>
          <Button onClick={handleDiscord} fullWidth variant="outlined" color="secondary">
            Login with Discord
          </Button>
          <Typography align="center" mt={2}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginForm;
