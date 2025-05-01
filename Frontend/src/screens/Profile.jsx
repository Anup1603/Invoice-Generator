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
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import {
  Business,
  AccountBalance,
  Info,
  Edit,
  Save,
  ArrowBack,
} from "@mui/icons-material";
import axios from "../axiosInstence";
import { deepPurple } from "@mui/material/colors";
import { fetchCompanyDetails } from "../invoiceApi";

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyCode: "",
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
    logo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCompanyDetails();
      setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch company data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

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
      const response = await axios.put("api/company/", formData);
      if (response.data.success) {
        setIsEditing(false);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.companyName) {
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
          Loading Company Data...
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: isMobile ? 2 : 4,
        mb: isMobile ? 2 : 4,
        p: isMobile ? 1 : 2,
      }}
    >
      <Paper
        elevation={isMobile ? 1 : 4}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: isMobile ? 2 : 4,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
            )}
            <Avatar sx={{ bgcolor: deepPurple[500], mr: 2 }}>
              <Business />
            </Avatar>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1">
              Company Profile
            </Typography>
          </Box>

          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: "#ff4d4d",
                "&:hover": { bgcolor: "#ff3333" },
                width: isMobile ? "100%" : "auto",
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={isMobile ? 1 : 2}
              width={isMobile ? "100%" : "auto"}
            >
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{ width: isMobile ? "100%" : "auto" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  bgcolor: "#ff8000",
                  "&:hover": { bgcolor: "#e67300" },
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Save Changes
              </Button>
            </Stack>
          )}
        </Box>

        {error && (
          <Typography
            color="error"
            align="center"
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "#ffeeee",
              borderRadius: 1,
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          {/* Company Information Section */}
          <Paper
            elevation={isMobile ? 0 : 2}
            sx={{
              p: isMobile ? 2 : 3,
              mb: isMobile ? 2 : 4,
              border: isMobile ? "1px solid #eee" : "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Business color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Company Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={isMobile ? 3 : 3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Code"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Director Name"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="address[street]"
                  value={formData.address.street}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="address[city]"
                  value={formData.address.city}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="address[state]"
                  value={formData.address.state}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="address[postalCode]"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="address[country]"
                  value={formData.address.country}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  name="logoUrl"
                  value={formData.logo}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  placeholder="https://example.com/logo.png"
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Bank Details Section */}
          <Paper
            elevation={isMobile ? 0 : 2}
            sx={{
              p: isMobile ? 2 : 3,
              mb: isMobile ? 2 : 4,
              border: isMobile ? "1px solid #eee" : "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccountBalance color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Bank Details</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={isMobile ? 3 : 3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Name"
                  name="bankDetails[accountName]"
                  value={formData.bankDetails.accountName}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Tax Information Section */}
          <Paper
            elevation={isMobile ? 0 : 2}
            sx={{
              p: isMobile ? 2 : 3,
              mb: isMobile ? 2 : 4,
              border: isMobile ? "1px solid #eee" : "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Info color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Tax Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={isMobile ? 3 : 3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
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
                  size={isMobile ? "small" : "medium"}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
