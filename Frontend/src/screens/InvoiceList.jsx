import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Button,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { Search as SearchIcon, Print as PrintIcon } from "@mui/icons-material";
import { fetchInvoiceData, updateInvoiceStatus } from "../invoiceApi";

const statusOptions = [
  { value: "draft", label: "Draft", color: "#d1d1e0" },
  { value: "sent", label: "Sent", color: "#6666ff" },
  { value: "paid", label: "Paid", color: "#66ff66" },
  { value: "overdue", label: "Overdue", color: "#ff66ff" },
  { value: "cancelled", label: "Cancelled", color: "#ff6666" },
];

// ✅ Get background color directly from custom hex
const getStatusColor = (status) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.color : "#D1D5DB"; // fallback gray-300
};

// ✅ Get readable text color (black or white) based on background brightness
const getStatusTextColor = (status) => {
  const bgColor = getStatusColor(status);
  return getContrastColor(bgColor);
};

// 🔧 Utility: Determines best text color (black or white) for contrast
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const InvoiceList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadInvoices = async () => {
    try {
      const data = await fetchInvoiceData();
      setInvoices(data.data);
      setFilteredInvoices(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch invoices");
      setLoading(false);
    }
  };
  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    const results = invoices.filter(
      (invoice) =>
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.customer.companyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(results);
  }, [searchTerm, invoices]);

  const handleOpen = (invoice) => {
    setSelectedInvoice(invoice);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvoice(null);
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus);
      setInvoices(
        invoices.map((invoice) =>
          invoice._id === invoiceId
            ? { ...invoice, status: newStatus }
            : invoice
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

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
          Loading Invoices...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Box mt={3}>
        <Alert severity="info">No invoices found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          mb: 3,
          gap: isMobile ? 2 : 0,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom color="text.secondary">
            Invoice List
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Total Invoices: {filteredInvoices.length}
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search invoices..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: isMobile ? "100%" : 300,
            backgroundColor: "background.paper",
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          maxHeight: "calc(90vh - 200px)",
          overflow: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>
                Invoice Number
              </TableCell>
              {!isMobile && (
                <TableCell style={{ fontWeight: "bold" }}>Customer</TableCell>
              )}
              {!isMobile && (
                <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
              )}
              <TableCell style={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                Amount
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => {
              const statusColor = getStatusColor(invoice.status, theme);
              const statusTextColor = getStatusTextColor(invoice.status, theme);

              return (
                <TableRow
                  key={invoice._id}
                  hover
                  onClick={() => handleOpen(invoice)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  {!isMobile && (
                    <TableCell>{invoice.customer.companyName}</TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      {format(new Date(invoice.createdAt), "dd MMM yyyy")}
                    </TableCell>
                  )}
                  <TableCell>
                    {format(
                      new Date(invoice.dueDate),
                      isMobile ? "dd/MM" : "dd MMM yyyy"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    ₹{invoice.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={invoice.status}
                      onChange={(e) =>
                        handleStatusChange(invoice._id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      size="small"
                      sx={{
                        "& .MuiSelect-select": {
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          backgroundColor: statusColor,
                          color: statusTextColor,
                        },
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Details Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : isTablet ? "90%" : "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: isMobile ? 2 : 4,
            borderRadius: 1,
            maxHeight: isMobile ? "65vh" : "90vh",
            overflowY: "auto",
            border: "none",
            outline: "none",
          }}
        >
          {selectedInvoice && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getInitials(selectedInvoice.customer.companyName)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Invoice Details
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedInvoice.invoiceNumber}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={
                    statusOptions.find(
                      (opt) => opt.value === selectedInvoice.status
                    )?.label
                  }
                  variant="outlined"
                  size="medium"
                  style={{
                    fontWeight: "600",
                    backgroundColor: getStatusColor(selectedInvoice.status),
                    color: getStatusTextColor(selectedInvoice.status),
                    borderColor: getStatusColor(selectedInvoice.status),
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    To
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.customer.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedInvoice.customer.address.street},<br />
                    {selectedInvoice.customer.address.city},{" "}
                    {selectedInvoice.customer.address.state}
                    <br />
                    {selectedInvoice.customer.address.postalCode},{" "}
                    {selectedInvoice.customer.address.country}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    GST: {selectedInvoice.customer.gstNumber}
                  </Typography>
                  <Typography variant="body2">
                    Contact: {selectedInvoice.customer.contactPerson} (
                    {selectedInvoice.customer.phoneNumber})
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Invoice Items
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size={isMobile ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Discount %</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.item.description}</TableCell>
                        <TableCell align="right">
                          ₹{item.item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.itemDiscount}</TableCell>
                        <TableCell align="right">
                          ₹{selectedInvoice.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals Section - Updated to match your data structure */}
              <Box sx={{ mt: 3, textAlign: "right" }}>
                {/* Subtotal - Always shown */}
                <Typography variant="body1">
                  Subtotal: ₹{selectedInvoice.subtotal.toFixed(2)}
                </Typography>

                {/* Item Discount - Only shown if there are item discounts */}
                {selectedInvoice.items.some(
                  (item) => item.itemDiscount > 0
                ) && (
                  <>
                    <Typography variant="body1" sx={{ color: "error.main" }}>
                      Item Discounts: - ₹
                      {(
                        selectedInvoice.subtotal -
                        selectedInvoice.amountAfterItemDiscounts
                      ).toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      Amount After Item Discounts: ₹
                      {selectedInvoice.amountAfterItemDiscounts.toFixed(2)}
                    </Typography>
                  </>
                )}

                {/* Overall Discount - Only shown if there's an overall discount */}
                {selectedInvoice.overAllDiscount > 0 && (
                  <>
                    <Typography variant="body1" sx={{ color: "error.main" }}>
                      Overall Discount ({selectedInvoice.overAllDiscount}%): - ₹
                      {(
                        selectedInvoice.amountAfterItemDiscounts -
                        selectedInvoice.amountAfterAllDiscounts
                      ).toFixed(2)}
                    </Typography>
                    {/* Total Discount - Only shown if there are any discounts */}
                    {selectedInvoice.totalDiscount > 0 && (
                      <Typography variant="body1" sx={{ color: "error.main" }}>
                        Total Discounts (both item and overall): - ₹
                        {selectedInvoice.totalDiscount.toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      Amount After All Discounts: ₹
                      {selectedInvoice.amountAfterAllDiscounts.toFixed(2)}
                    </Typography>
                  </>
                )}

                {/* GST - Always shown */}
                <Typography variant="body1">
                  GST ({selectedInvoice.gstRate}%): ₹
                  {selectedInvoice.gstAmount.toFixed(2)}
                </Typography>

                {/* Divider before total */}
                <Divider sx={{ my: 1 }} />

                {/* Total - Always shown */}
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                  Total: ₹{selectedInvoice.totalAmount.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Created:{" "}
                  {format(new Date(selectedInvoice.createdAt), "PPPpp")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {format(new Date(selectedInvoice.dueDate), "PPP")}
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button variant="contained" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default InvoiceList;
