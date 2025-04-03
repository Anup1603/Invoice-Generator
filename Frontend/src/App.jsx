import React, { useState, useEffect, useMemo, useCallback } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import { generateInvoiceNumber } from "./utils/invoiceNumber";

const theme = createTheme({
  palette: {
    primary: {
      main: "#015401",
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

const initialInvoiceData = {
  billedTo: {
    companyName: "xxxxxxxxxxx TECH PRIVATE LIMITED",
    address: "56/9 Block A xxxxxxx road xxxxxxxx state PIN - xxxxxxxx",
    gstin: "27AAIxxxxxxxxx",
    contact: "Axxxxxx Gxxxxxx",
    phone: "+91-9xxxx56xxx",
    domain: "example.com",
  },
  billedBy: {
    companyName: "Anocloud Technology Solutions LLP",
    address: "C/67, Vijay Nagar, P.O Agrico, Jamshedpur, India - 831009",
    gstin: "20ACGFA0573N1ZJ",
    pan: "ACGFA0573N",
    contact: "Vishal Kumar Gupta",
    phone: "+91-6366338242",
  },
  invoiceDetails: {
    number: generateInvoiceNumber(),
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  items: [
    {
      id: Date.now(),
      description:
        "Google Workspace [Business Starter] Subscription Term: Annual Commitment, Service Period: 1st April 2025 to 31st March 2026",
      quantity: 4,
      unitPrice: 9999.0,
      amount: 39996.0,
    },
  ],
  totals: {
    subtotal: 39996.0,
    discount: 0.0,
    gst: 7199.28,
    grandTotal: 47195.28,
    addLessAdjustments: 0.0,
  },
  paymentDetails: {
    accountName: "ANOCLOUD TECHNOLOGY SOLUTIONS LLP",
    accountNumber: "50200103310501",
    bankName: "HDFC",
    branch: "Old Airport Road",
    ifscCode: "HDFC0000075",
  },
  logo: "/Anocloud logo.png",
};

function App() {
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [activeSection, setActiveSection] = useState(null);
  const [draftData, setDraftData] = useState(
    JSON.parse(JSON.stringify(initialInvoiceData))
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = draftData.items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    setDraftData((prev) => ({
      ...prev,
      totals: {
        ...prev.totals,
        subtotal,
        gst,
        grandTotal,
      },
    }));
  }, [draftData.items]);

  const handleUpdate = useCallback((section, data) => {
    setDraftData((prev) => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  const handleSave = useCallback(() => {
    setInvoiceData(draftData);
    setActiveSection(null);
  }, [draftData]);

  const handleCancel = useCallback(() => {
    setDraftData(invoiceData);
    setActiveSection(null);
  }, [invoiceData]);

  const previewData = useMemo(() => {
    return activeSection ? draftData : invoiceData;
  }, [activeSection, draftData, invoiceData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Navbar */}
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img src="/Anocloud logo.png" alt="Logo" style={{ height: 40 }} />
            </Typography>
            {!isMobile && (
              <>
                <Button color="inherit">Dashboard</Button>
                <Button color="inherit">Invoices</Button>
                <Button color="inherit">Settings</Button>
              </>
            )}
            <IconButton color="inherit" sx={{ ml: 2 }}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Form Panel (Left) */}
          <Box
            sx={{
              width: isMobile ? (activeSection ? "100%" : "0") : "44%",
              p: isMobile ? 1 : 3,
              overflowY: "auto",
              borderRight: "1px solid #e0e0e0",
              display: isMobile && !activeSection ? "none" : "block",
              transition: "all 0.3s ease",
            }}
          >
            {activeSection ? (
              <InvoiceForm
                activeSection={activeSection}
                data={draftData}
                onUpdate={handleUpdate}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No section selected
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Please select a field to edit from the invoice preview
                </Typography>
              </Box>
            )}
          </Box>

          {/* Preview Panel (Right) */}
          <Box
            sx={{
              flex: 1,
              p: isMobile ? 1 : 3,
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
              display: isMobile && activeSection ? "none" : "block",
            }}
          >
            <InvoicePreview
              data={previewData}
              onSectionClick={setActiveSection}
              isMobile={isMobile}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
