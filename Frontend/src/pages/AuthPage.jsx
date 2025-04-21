import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import axiosInstance from "../axiosInstence";

// Keyframes for up-and-down animation
const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const AuthPage = () => {
  const theme = useTheme();
  const { authMode } = useParams(); // Get authMode from URL
  const navigate = useNavigate(); // For programmatic navigation
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check for mobile view

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State for Snackbar (success/error messages)
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // State for progress loader
  const [loading, setLoading] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMode === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const userData = {
      email,
      password,
      ...(authMode === "register" && { confirmPassword }), // Include confirmPassword only for registration
    };

    setLoading(true); // Show loader

    try {
      if (authMode === "register") {
        await registerUser(userData);
      } else {
        await loginUser(userData);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "An error occurred");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setTimeout(() => {
        setLoading(false); // Hide loader after 500ms
      }, 300);
    }
  };

  // Register user
  const registerUser = async (userData) => {
    const { data } = await axiosInstance.post("api/auth/register", userData);
    setMessage("Registration Successful");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/auth/login"); // Redirect to login page after registration
    }, 300);
  };

  // Login user
  const loginUser = async (userData) => {
    const { data } = await axiosInstance.post("api/auth/login", userData);
    localStorage.setItem("token", data.token); // Store JWT securely
    if (data) {
      localStorage.setItem("user", JSON.stringify(data)); // Store user data
    }
    // setUser(data); // Set user in App state
    setMessage("Login Successful");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setTimeout(() => {
      // Check if profile is complete
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.profileComplete === false) {
        navigate("/profile-complete"); // Redirect to profile completion page
      } else {
        navigate("/invoice-board/create-invoice"); // Redirect to dashboard after login
      }
    }, 300);
  };

  // Toggle between login and registration forms
  const toggleForm = () => {
    setLoading(true); // Show loader
    setTimeout(() => {
      navigate(`/auth/${authMode === "register" ? "login" : "register"}`);
      setLoading(false); // Hide loader
    }, 300);
  };

  const toggleHomePage = () => {
    setLoading(true); // Show loader
    setTimeout(() => {
      navigate("/");
      setLoading(false); // Hide loader
    }, 300);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Progress Loader */}
      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "#00e68a",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#fff",
            },
          }}
        />
      )}

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000} // 5 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top-center
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Logo in the Top-Left Corner */}
      <Box
        sx={{
          position: "absolute",
          top: 16, // Professional margin from the top
          left: 16, // Professional margin from the left
          zIndex: 1, // Ensure the logo is above other elements
        }}
      >
        <img
          src="/invoiceLogo.gif"
          alt="TMS Portal Logo"
          style={{
            width: "70px", // Adjust size as needed
            height: "auto",
            borderRadius: 50, // Add border radius for a modern look
            cursor: "pointer", // Add cursor pointer on hover
          }}
          onClick={toggleHomePage}
        />
      </Box>

      {/* Left Section: Images */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // Needed for absolute positioning of child elements
          marginRight: isMobile ? 0 : 4, // Remove margin on mobile
          marginBottom: isMobile ? 4 : 0, // Add margin at the bottom on mobile
        }}
      >
        {/* First Image (Centered Vertically) */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "600px", // Adjust as needed
            marginTop: "10%",
            animation: `${floatAnimation} 3s ease-in-out infinite`, // Add animation
          }}
        >
          <img
            src="/LandingPageImage.jpg" // Replace with your image URL
            alt="Main"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 16, // Add border radius for a modern look
              marginLeft: "-20%", // Adjust top margin as needed
            }}
          />

          {/* Second Image Container (Top-Right Corner of First Image) */}
          <Box
            sx={{
              position: "absolute",
              top: "-55%",
              right: "-30%",
              width: "80%", // Adjust size as needed
              height: "80%",
              transform: "translate(25%, -25%)", // Adjust positioning
              animation: `${floatAnimation} 2s ease-in-out infinite`, // Add animation
            }}
          >
            {/* First Image in Container (Left Half) */}
            <img
              src="/Invoice1.jpg" // Replace with your image URL
              alt="Left"
              style={{
                width: "50%",
                height: "100%",
                borderRadius: 8, // Add border radius for a modern look
              }}
            />

            {/* Second and Third Images in Container (Right Half) */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1, // Add spacing between images
              }}
            >
              <img
                src="/Invoice2.jpg" // Replace with your image URL
                alt="Top Right"
                style={{
                  width: "100%",
                  height: "50%",
                  borderRadius: 8, // Add border radius for a modern look
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Section: Forms */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: "600px", // Limit form width
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          {authMode === "register" ? "Register" : "Login"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: isMobile ? "100%" : "70%", // Full width on mobile, half on desktop
            display: "flex",
            flexDirection: "column",
            gap: 2, // Add spacing between form fields
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {authMode === "register" && (
            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#00e68a",
              "&:hover": { backgroundColor: "#00ff99" },
            }}
          >
            {authMode === "register" ? "Register" : "Login"}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {authMode === "register"
            ? "Already have an account? "
            : "Don't have an account? "}
          <Button
            onClick={toggleForm}
            sx={{
              textTransform: "none",
              color: "#00e68a",
              "&:hover": { color: "#00ff99" },
            }}
          >
            {authMode === "register" ? "Login here" : "Register here"}
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthPage;
