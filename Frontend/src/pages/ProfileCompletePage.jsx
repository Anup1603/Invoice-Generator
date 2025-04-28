import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Logout, Business, AccountBalance, Info } from "@mui/icons-material";
import axios from "../axiosInstence";
import { deepPurple, teal, orange } from "@mui/material/colors";

const ProfileCompletePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      ifscCode: "",
    },
    gstNumber: "",
    panNumber: "",
    directorName: "",
    phoneNumber: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
    if (user?.profileComplete === true) {
      navigate("/invoice-board/create-invoice");
    }
  }, [token, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("[")) {
      const [parent, child] = name.replace("]", "").split("[");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "api/company/complete-profile",
        formData
      );

      if (response.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            profileComplete: true,
          })
        );
        navigate("/invoice-board/create-invoice");
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading Invoice Page...
        </Typography>
      </Box>
    );
  }

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/auth/login");
      setIsLoading(false);
    }, 300);
  };

  const handleLogoutCancel = () => {
    setLogoutOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: deepPurple[400] }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Invoice System
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogoutClick}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar sx={{ bgcolor: teal[500], mr: 2 }}>
              <Business />
            </Avatar>
            <Typography variant="h4" component="h1">
              Please Complete Your Company Profile
            </Typography>
          </Box>

          {error && (
            <Typography
              color="error"
              align="center"
              sx={{ mb: 3, p: 2, bgcolor: "#ffeeee", borderRadius: 1 }}
            >
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            {/* Company Information Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "#f5f7fa" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Company Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="address[street]"
                    value={formData.address.street}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="address[city]"
                    value={formData.address.city}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    name="address[state]"
                    value={formData.address.state}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="address[postalCode]"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="address[country]"
                    value={formData.address.country}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Details Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "#f5f5f5" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalance color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="secondary">
                  Bank Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Name"
                    name="bankDetails[accountName]"
                    value={formData.bankDetails.accountName}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    name="bankDetails[accountNumber]"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    name="bankDetails[bankName]"
                    value={formData.bankDetails.bankName}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Branch"
                    name="bankDetails[branch]"
                    value={formData.bankDetails.branch}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    name="bankDetails[ifscCode]"
                    value={formData.bankDetails.ifscCode}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Additional Information Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "#f5f5f5" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Info sx={{ color: orange[500], mr: 1 }} />
                <Typography variant="h6" sx={{ color: orange[500] }}>
                  Additional Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Director Name"
                    name="directorName"
                    value={formData.directorName}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="GST Number"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website URL"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: deepPurple[600],
                  "&:hover": { bgcolor: deepPurple[800] },
                  px: 4,
                  py: 1,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </Box>
          </form>

          {/* Logout Confirmation Dialog */}
          <Dialog
            open={logoutOpen}
            onClose={handleLogoutCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 1,
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#ff4d4d",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Confirm Logout
            </DialogTitle>
            <DialogContent sx={{ py: 3, mt: 2 }}>
              <Typography variant="body1">
                Are you sure you want to <strong>logout</strong>?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={handleLogoutCancel}
                sx={{
                  color: "#ff4d4d",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogoutConfirm}
                variant="contained"
                sx={{
                  borderRadius: 1,
                  backgroundColor: "#ff4d4d",
                  px: 2,
                  py: 1,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </>
  );
};

export default ProfileCompletePage;
