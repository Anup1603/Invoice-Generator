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
    gstNumber: "",
    contactPerson: "",
    phoneNumber: "",
    domainName: "",
  },
  billedBy: {
    companyName: "",
    companyCode: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    directorName: "",
    phoneNumber: "",
  },
  invoiceDetails: {
    type: "SW",
    number: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currentFY: "",
    fullInvoiceNumber: "",
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
    itemDiscounts: 0,
    amountAfterItemDiscounts: 0,
    discountPercentage: 0,
    discountAmount: 0,
    amountAfterAllDiscounts: 0,
    gstRate: 18,
    gstAmount: 0,
    totalAmount: 0,
  },
};

function InvoiceMain() {
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [activeSection, setActiveSection] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfGenerationError, setPdfGenerationError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState("0004");

  const getCurrentFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4
      ? `${year}-${(year + 1).toString().slice(-2)}`
      : `${year - 1}-${year.toString().slice(-2)}`;
  };

  const [currentFY, setCurrentFY] = useState(getCurrentFinancialYear());

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
      return "0004";
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return "0004";
    }
  };

  const generateNextInvoiceNumber = (lastNumber) => {
    const nextNumber = String(parseInt(lastNumber || "0004", 10) + 1).padStart(
      4,
      "0"
    );
    return `${invoiceData.billedBy.companyCode}/${invoiceData.invoiceDetails.type}/${currentFY}/${nextNumber}`;
  };

  const resetForm = () => {
    const nextInvoiceNumber = generateNextInvoiceNumber(lastInvoiceNumber);
    setInvoiceData({
      ...initialInvoiceData,
      billedBy: invoiceData.billedBy,
      paymentDetails: invoiceData.paymentDetails,
      logo: invoiceData.logo,
      invoiceDetails: {
        ...initialInvoiceData.invoiceDetails,
        number: nextInvoiceNumber.split("/").pop(),
        fullInvoiceNumber: nextInvoiceNumber,
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        currentFY,
      },
    });
    setPdfReady(false);
    setSuccess(false);
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

        const currentLastNumber =
          fetchedLastInvoiceNum !== "0004"
            ? fetchedLastInvoiceNum
            : lastInvoiceNumber;
        const nextInvoiceNumber = generateNextInvoiceNumber(currentLastNumber);

        setInvoiceData((prev) => ({
          ...prev,
          billedBy: {
            companyName: companyData.data.companyName,
            companyCode: companyData.data.companyCode,
            address: formatAddress(companyData.data.address),
            gstNumber: companyData.data.gstNumber,
            panNumber: companyData.data.panNumber,
            directorName: companyData.data.directorName,
            phoneNumber: companyData.data.phoneNumber,
          },
          paymentDetails: companyData.data.bankDetails,
          logo: companyData.data.logo,
          invoiceDetails: {
            ...prev.invoiceDetails,
            number: nextInvoiceNumber.split("/").pop(),
            currentFY,
            fullInvoiceNumber: nextInvoiceNumber,
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
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const itemDiscounts = updatedData.items.reduce(
        (sum, item) =>
          sum +
          (item.quantity * item.unitPrice * (item.discountPercentage || 0)) /
            100,
        0
      );
      const amountAfterItemDiscounts = subtotal - itemDiscounts;
      const discountAmount =
        (amountAfterItemDiscounts *
          (updatedData.totals.discountPercentage || 0)) /
        100;
      const amountAfterAllDiscounts = amountAfterItemDiscounts - discountAmount;
      const gstAmount =
        (amountAfterAllDiscounts * (updatedData.totals.gstRate || 18)) / 100;
      const totalAmount = amountAfterAllDiscounts + gstAmount;

      updatedData.totals = {
        ...updatedData.totals,
        subtotal,
        itemDiscounts,
        amountAfterItemDiscounts,
        discountAmount,
        amountAfterAllDiscounts,
        gstAmount,
        totalAmount,
      };
    } else if (activeSection === "totals") {
      const subtotal = invoiceData.totals.subtotal;
      const itemDiscounts = invoiceData.totals.itemDiscounts;
      const amountAfterItemDiscounts = subtotal - itemDiscounts;
      const discountAmount =
        (amountAfterItemDiscounts *
          (updatedData.totals.discountPercentage || 0)) /
        100;
      const amountAfterAllDiscounts = amountAfterItemDiscounts - discountAmount;
      const gstAmount =
        (amountAfterAllDiscounts * (updatedData.totals.gstRate || 18)) / 100;
      const totalAmount = amountAfterAllDiscounts + gstAmount;

      updatedData.totals = {
        ...updatedData.totals,
        subtotal,
        itemDiscounts,
        amountAfterItemDiscounts,
        discountAmount,
        amountAfterAllDiscounts,
        gstAmount,
        totalAmount,
      };
    }
    setInvoiceData(updatedData);
    setActiveSection(null);
    setDraftData(null);
  };

  const handleSaveInvoice = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      setPdfGenerationError(null);

      const payload = {
        invoiceNumber: invoiceData.invoiceDetails.fullInvoiceNumber,
        invoiceType: invoiceData.invoiceDetails.type,
        customer: {
          companyName: invoiceData.billedTo.companyName,
          address: invoiceData.billedTo.address,
          gstNumber: invoiceData.billedTo.gstNumber,
          phoneNumber: invoiceData.billedTo.phoneNumber,
          contactPerson: invoiceData.billedTo.contactPerson,
          domainName: invoiceData.billedTo.domainName,
        },
        items: invoiceData.items.map((item) => ({
          item: item._id || item.id,
          quantity: item.quantity,
          itemDiscount: item.discountPercentage || 0,
          priceAtTime: item.unitPrice,
        })),
        overAllDiscount: invoiceData.totals.discountPercentage || 0,
        gstRate: invoiceData.totals.gstRate || 18,
        dueDate: invoiceData.invoiceDetails.dueDate,
        subtotal: invoiceData.totals.subtotal || 0,
        totalDiscount:
          (invoiceData.totals.itemDiscounts || 0) +
          (invoiceData.totals.discountAmount || 0),
        amountAfterItemDiscounts:
          invoiceData.totals.amountAfterItemDiscounts || 0,
        amountAfterAllDiscounts:
          invoiceData.totals.amountAfterAllDiscounts || 0,
        gstAmount: invoiceData.totals.gstAmount || 0,
        totalAmount: invoiceData.totals.totalAmount || 0,
      };

      const response = await createInvoice(payload);

      if (response && response.data) {
        setSuccess(true);
        const newInvoiceNumber = response.data.invoiceNumber;
        const parts = newInvoiceNumber?.split("/");
        if (parts) {
          setLastInvoiceNumber(parts[parts.length - 1]);
        }
        setPdfReady(true);
      } else {
        throw new Error("Failed to create invoice");
      }
    } catch (error) {
      console.error("Invoice creation error:", error);
      setError("Failed to save invoice to database");
      setPdfGenerationError("Failed to save invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePdfDownloaded = () => {
    resetForm();
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
      <Box sx={{ display: "flex", flexDirection: "column", height: "84vh" }}>
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
            Invoice saved successfully! You can now download the PDF.
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
              <InvoicePreview
                data={invoiceData}
                onSectionClick={setActiveSection}
                isMobile={isMobile}
                onSaveInvoice={handleSaveInvoice}
                onPdfDownloaded={handlePdfDownloaded}
                isSaving={saving}
                pdfReady={pdfReady}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default InvoiceMain;
