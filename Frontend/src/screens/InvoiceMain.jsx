import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";
import { generateInvoiceNumber } from "../utils/invoiceNumber";
import { useNavigate } from "react-router-dom";

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

const initialInvoiceData = {
  billedTo: {
    companyName: "xxxxxxxxxxx TECH PRIVATE LIMITED",
    address: "56/9 Block A xxxxxxx road xxxxxxxx state PIN - xxxxxxxx",
    gstin: "28ZIxxxxxxxxx",
    contact: "Dxxxxxx Axxxxxx",
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
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ),
  },
  items: [
    {
      id: Date.now(),
      description:
        "Google Workspace [Business Starter] Subscription Term: Annual Commitment, Service Period: 1st April 2025 to 31st March 2026",
      quantity: 4,
      unitPrice: 1000.0,
      amount: 4000.0,
    },
  ],
  paymentDetails: {
    accountName: "ANOCLOUD TECHNOLOGY SOLUTIONS LLP",
    accountNumber: "50200103310501",
    bankName: "HDFC",
    branch: "Old Airport Road",
    ifscCode: "HDFC0000075",
  },
  logo: "/Anocloud logo.png",
};

// Calculate initial totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  return {
    subtotal,
    discount: 0.0,
    gst,
    grandTotal,
    addLessAdjustments: 0.0,
  };
};

initialInvoiceData.totals = calculateTotals(initialInvoiceData.items);

function InvoiceMain() {
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [activeSection, setActiveSection] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Update draft data when active section changes
  useEffect(() => {
    if (activeSection) {
      setDraftData({
        ...invoiceData,
        [activeSection]: JSON.parse(JSON.stringify(invoiceData[activeSection])),
      });
    }
  }, [activeSection, invoiceData]);

  const handleSave = (updatedData) => {
    // Recalculate totals if items were updated
    if (activeSection === "items") {
      updatedData.totals = calculateTotals(updatedData.items);
    }

    setInvoiceData(updatedData);
    setActiveSection(null);
    setDraftData(null);
  };

  const handleCancel = () => {
    setActiveSection(null);
    setDraftData(null);
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
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
                data={draftData || invoiceData}
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
              data={invoiceData}
              onSectionClick={setActiveSection}
              isMobile={isMobile}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default InvoiceMain;
