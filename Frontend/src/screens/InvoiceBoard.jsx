import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      // main: "#015401",
      main: "#7e57c2",
    },
    secondary: {
      main: "#404040",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function InvoiceBoard() {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);

  // Update draft data when active section changes

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token]);

  if (loading) {
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
          Logout ...
        </Typography>
      </Box>
    );
  }

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setTimeout(() => {
      navigate("/auth/login");
      setLoading(false);
    }, 300);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                src="/Anocloud logo.png"
                alt="Logo"
                style={{
                  height: 45,
                  objectFit: "contain",
                  background: "transparent",
                  display: "block",
                }}
              />
            </Typography>

            {!isMobile && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/invoice-board/create-invoice")}
                >
                  Invoice Board
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/invoice-board/invoices")}
                >
                  Invoices
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/invoice-board/profile")}
                >
                  Profile
                </Button>
              </>
            )}
            <IconButton color="inherit" sx={{ ml: 2 }} onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Outlet />
      </Box>
    </ThemeProvider>
  );
}

export default InvoiceBoard;
