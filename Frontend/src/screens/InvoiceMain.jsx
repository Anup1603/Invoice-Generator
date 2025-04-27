import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";
import { useNavigate } from "react-router-dom";
import {
  fetchCompanyDetails,
  fetchInvoiceItems,
  createInvoice,
} from "../invoiceApi";
import ErrorBoundary from "../utils/ErrorBoundary";
import axios from "../axiosInstence";

const theme = createTheme({
  palette: {
    primary: { main: "#7e57c2" },
    secondary: { main: "#404040" },
    background: { default: "#f5f5f5" },
  },
  typography: { fontFamily: "'Roboto', sans-serif" },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
});

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
};

const initialInvoiceData = {
  billedTo: {
    companyName: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
    gstin: "",
    contact: "",
    phone: "",
    domain: "",
  },
  billedBy: {
    companyName: "",
    address: "",
    gstin: "",
    pan: "",
    contact: "",
    phone: "",
  },
  invoiceDetails: {
    type: "SW",
    number: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  items: [],
  paymentDetails: {
    accountName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    ifscCode: "",
  },
  logo: "",
  totals: {
    subtotal: 0,
    discount: 0,
    gst: 0,
    grandTotal: 0,
    addLessAdjustments: 0,
  },
};

function InvoiceMain() {
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [activeSection, setActiveSection] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pdfGenerationError, setPdfGenerationError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState("0004"); // Initialize to one less than the default
  const [currentFY, setCurrentFY] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4
      ? `${year}-${(year + 1).toString().slice(-2)}`
      : `${year - 1}-${year.toString().slice(-2)}`;
  });

  const fetchLastInvoiceNumberFromBackend = async () => {
    try {
      const response = await axios.get(`/api/invoices`);
      const invoices = response.data.data;
      if (invoices && invoices.length > 0) {
        invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const lastInvoice = invoices[0];
        const parts = lastInvoice.invoiceNumber.split("/");
        const lastNumber = parts[parts.length - 1];
        setLastInvoiceNumber(lastNumber);
        return lastNumber;
      }
      return "0004"; // Default if no invoices exist in backend
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return "0004"; // Default on error
    }
  };

  let nextNumber = null;
  const generateNextInvoiceNumber = (lastNumber) => {
    nextNumber = String(parseInt(lastNumber || "0004", 10) + 1).padStart(
      4,
      "0"
    );
    return `ANO/${invoiceData.invoiceDetails.type}/${currentFY}/${nextNumber}`;
  };

  useEffect(() => {
    if (!token) navigate("/auth/login");

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [companyData, itemsData, fetchedLastInvoiceNum] =
          await Promise.all([
            fetchCompanyDetails(),
            fetchInvoiceItems(),
            fetchLastInvoiceNumberFromBackend(),
          ]);

        // Use the fetched last invoice number if available, otherwise use the initialized state
        const currentLastNumber =
          fetchedLastInvoiceNum !== "0004"
            ? fetchedLastInvoiceNum
            : lastInvoiceNumber;
        const nextInvoiceNumber = generateNextInvoiceNumber(currentLastNumber);

        setInvoiceData((prev) => ({
          ...prev,
          billedBy: {
            companyName: companyData.data.companyName,
            address: formatAddress(companyData.data.address),
            gstin: companyData.data.gstNumber,
            pan: companyData.data.panNumber,
            contact: companyData.data.directorName,
            phone: companyData.data.phoneNumber,
          },
          paymentDetails: companyData.data.bankDetails,
          logo: companyData.data.logo,
          invoiceDetails: {
            ...prev.invoiceDetails,
            number: nextNumber,
            currentFY,
          },
        }));

        setAvailableItems(itemsData.data);
      } catch (error) {
        console.error("Data loading error:", error);
        setError("Failed to load initial data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, currentFY]);

  useEffect(() => {
    if (activeSection) {
      setDraftData({
        ...invoiceData,
        [activeSection]: JSON.parse(JSON.stringify(invoiceData[activeSection])),
      });
    }
  }, [activeSection, invoiceData]);

  const handleSave = (updatedData) => {
    if (activeSection === "items") {
      const subtotal = updatedData.items.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      updatedData.totals = {
        subtotal,
        discount: 0,
        gst: subtotal * 0.18,
        grandTotal: subtotal * 1.18,
        addLessAdjustments: 0,
      };
    }
    setInvoiceData(updatedData);
    setActiveSection(null);
    setDraftData(null);
  };

  const handleGeneratePDF = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);
      setPdfGenerationError(null);

      const payload = {
        invoiceNumber: invoiceData.invoiceDetails.number,
        invoiceType: invoiceData.invoiceDetails.type,
        customer: {
          companyName: invoiceData.billedTo.companyName,
          address: invoiceData.billedTo.address,
          gstNumber: invoiceData.billedTo.gstin,
          phoneNumber: invoiceData.billedTo.phone,
          contactPerson: invoiceData.billedTo.contact,
          domainName: invoiceData.billedTo.domain,
        },
        items: invoiceData.items.map((item) => ({
          itemId: item._id || item.id,
          quantity: item.quantity,
        })),
        discount: invoiceData.totals.discount,
        gstRate: 18,
        dueDate: invoiceData.invoiceDetails.dueDate,
      };

      const response = await createInvoice(payload);
      if (response && response.data && response.data.newInvoiceNumber) {
        const parts = response.data.newInvoiceNumber.split("/");
        setLastInvoiceNumber(parts[parts.length - 1]);
      } else {
        // If newInvoiceNumber is not returned, refetch to get the updated last number
        const latestInvoiceNumber = await fetchLastInvoiceNumberFromBackend();
        setLastInvoiceNumber(latestInvoiceNumber);
      }
      setSuccess(true);

      setInvoiceData({
        ...initialInvoiceData,
        billedBy: invoiceData.billedBy,
        paymentDetails: invoiceData.paymentDetails,
        logo: invoiceData.logo,
        invoiceDetails: {
          ...initialInvoiceData.invoiceDetails,
          number: generateNextInvoiceNumber(
            response?.data?.newInvoiceNumber?.split("/").pop() ||
              lastInvoiceNumber
          ),
          date: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      });
    } catch (error) {
      setError("Failed to generate PDF and save invoice");
      setPdfGenerationError("Failed to generate PDF. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {pdfGenerationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {pdfGenerationError}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Invoice created successfully!
          </Alert>
        )}

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
                onCancel={() => {
                  setActiveSection(null);
                  setDraftData(null);
                }}
                availableItems={availableItems}
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
            <ErrorBoundary>
              {" "}
              {/* Wrap InvoicePreview with ErrorBoundary */}
              <InvoicePreview
                data={invoiceData}
                onSectionClick={setActiveSection}
                isMobile={isMobile}
                onGeneratePDF={handleGeneratePDF}
                isGenerating={submitting}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default InvoiceMain;
