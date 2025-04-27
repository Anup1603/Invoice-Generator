import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { Edit, PictureAsPdf } from "@mui/icons-material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GeneratePDF from "./GeneratePDF";

function InvoicePreview({
  data = {},
  onSectionClick = () => {},
  isMobile = false,
  onGeneratePDF,
  isGenerating,
}) {
  const [pdfError, setPdfError] = useState(null);
  const matchesSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
  };

  const isFormValid = () => {
    return (
      data.billedTo?.companyName &&
      data.billedTo?.address &&
      data.billedTo?.gstin &&
      data.billedTo?.contact &&
      data.billedTo?.phone &&
      data.items?.length > 0 &&
      data.invoiceDetails?.type &&
      data.invoiceDetails?.date &&
      data.invoiceDetails?.dueDate
    );
  };

  const handlePdfGeneration = async () => {
    if (!isFormValid()) {
      setPdfError("Please fill all required fields before generating PDF");
      return;
    }

    try {
      setPdfError(null);
      await onGeneratePDF();
    } catch (error) {
      setPdfError("Failed to generate PDF. Please try again.");
    }
  };

  const pdfDocument = <GeneratePDF data={data} />;

  return (
    <Paper elevation={3} sx={{ p: matchesSM ? 1 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              fontSize: matchesSM ? "1.5rem" : "2.125rem",
            }}
          >
            TAX INVOICE
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSectionClick("invoiceDetails")}
            startIcon={<Edit />}
            sx={{ display: isMobile ? "inline-flex" : "inline-flex" }}
          >
            Edit
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontSize: matchesSM ? "0.875rem" : "1rem" }}
          >
            Invoice No:{" "}
            <strong>
              ANO/
              {data.invoiceDetails?.type || "N/A"}/
              {data.invoiceDetails?.currentFY || "N/A"}/
              {data.invoiceDetails?.number || "N/A"}
            </strong>
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: matchesSM ? "0.875rem" : "1rem" }}
          >
            Type: <strong>{data.invoiceDetails?.type || "N/A"}</strong>
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: matchesSM ? "0.875rem" : "1rem" }}
          >
            Date:{" "}
            <strong>
              {new Date(data.invoiceDetails?.date).toLocaleDateString(
                "en-IN"
              ) || "N/A"}
            </strong>
            {!matchesSM && " | "}
            {matchesSM ? <br /> : " "}
            Due Date:{" "}
            <strong>
              {new Date(data.invoiceDetails?.dueDate).toLocaleDateString(
                "en-IN"
              ) || "N/A"}
            </strong>
          </Typography>
        </Box>
      </Box>

      {/* Billed To / Billed By */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          flexDirection: matchesSM ? "column" : "row",
        }}
      >
        <Paper elevation={1} sx={{ p: 2, flex: 1, position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                fontSize: matchesSM ? "1rem" : "1.25rem",
                marginRight: 1,
              }}
            >
              Billed to:
            </Typography>
            {!isMobile && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onSectionClick("billedTo")}
                startIcon={<Edit />}
              >
                Edit
              </Button>
            )}
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              mt: 1,
              fontSize: matchesSM ? "0.875rem" : "1rem",
            }}
          >
            {data.billedTo?.companyName || "Company Name"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            {formatAddress(data.billedTo?.address)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            GSTIN: {data.billedTo?.gstin || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Contact: {data.billedTo?.contact || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Phone: {data.billedTo?.phone || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Domain: {data.billedTo?.domain || "N/A"}
          </Typography>
          {isMobile && (
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => onSectionClick("billedTo")}
              startIcon={<Edit />}
            >
              Edit Billed To
            </Button>
          )}
        </Paper>

        <Paper elevation={1} sx={{ p: 2, flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontSize: matchesSM ? "1rem" : "1.25rem",
            }}
          >
            Billed by:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              mt: 1,
              fontSize: matchesSM ? "0.875rem" : "1rem",
            }}
          >
            {data.billedBy?.companyName || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            {data.billedBy?.address || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            GSTIN: {data.billedBy?.gstin || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            PAN: {data.billedBy?.pan || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Contact: {data.billedBy?.contact || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Phone: {data.billedBy?.phone || "N/A"}
          </Typography>
        </Paper>
      </Box>

      {/* Product/Service Details */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontSize: matchesSM ? "1rem" : "1.25rem",
              marginRight: 1,
            }}
          >
            PRODUCT/SERVICE DETAILS
          </Typography>
          {!isMobile && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onSectionClick("items")}
              startIcon={<Edit />}
            >
              Edit
            </Button>
          )}
        </Box>
        <TableContainer>
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Sr.
                </TableCell>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Description
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Qty
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Unit Price (₹)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Amount (₹)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items?.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell
                    sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                  >
                    {item.description || "N/A"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                  >
                    {item.quantity || "0"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                  >
                    {(item.unitPrice || 0).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                  >
                    {(item.amount || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isMobile && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => onSectionClick("items")}
            startIcon={<Edit />}
          >
            Edit Items
          </Button>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: matchesSM ? "0.875rem" : "1rem",
            }}
          >
            Total Value: ₹{(data.totals?.subtotal || 0).toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Totals */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontSize: matchesSM ? "1rem" : "1.25rem",
          }}
        >
          Totals
        </Typography>
        <TableContainer>
          <Table size="small" sx={{ mt: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Total
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.subtotal || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  (-) Discount
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.discount || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  (+) GST (@18%)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.gst || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Net total
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.grandTotal || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Add/Less Adjustments
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.addLessAdjustments || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: matchesSM ? "0.75rem" : "0.875rem",
                  }}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    fontSize: matchesSM ? "0.75rem" : "0.875rem",
                  }}
                >
                  ₹{(data.totals?.grandTotal || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Terms and Conditions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontSize: matchesSM ? "1rem" : "1.25rem",
          }}
        >
          TERMS AND CONDITIONS:
        </Typography>
        <List dense sx={{ listStyleType: "disc", pl: 2 }}>
          {[
            "Price will be valid for annual commit & annual payment only.",
            "No cancellation or partial upgradation is allowed.",
            "Transfer token is mandatory for processing the order.",
            "Purchase order should be in the name of our company only.",
            "If vendor makes any changes in terms of pricing, then pricing will be revised and informed.",
          ].map((item, index) => (
            <ListItem key={index} sx={{ display: "list-item", py: 0 }}>
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontSize: matchesSM ? "0.75rem" : "0.875rem",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Payment Details */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontSize: matchesSM ? "1rem" : "1.25rem",
          }}
        >
          PAYMENT METHOD
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 1,
            fontWeight: "bold",
            fontSize: matchesSM ? "0.875rem" : "1rem",
          }}
        >
          Bank Transfer (NEFT/RTGS/IMPS):
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
        >
          Account Name:{" "}
          <strong>{data.paymentDetails?.accountName || "N/A"}</strong>
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
        >
          Account Number:{" "}
          <strong>{data.paymentDetails?.accountNumber || "N/A"}</strong>
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
        >
          Bank Name: <strong>{data.paymentDetails?.bankName || "N/A"}</strong>
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
        >
          Branch: <strong>{data.paymentDetails?.branch || "N/A"}</strong>
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
        >
          IFSC Code: <strong>{data.paymentDetails?.ifscCode || "N/A"}</strong>
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontSize: matchesSM ? "0.875rem" : "1rem" }}
        >
          Credit Card/Debit Card/UPI
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
        >
          Payment Gateway Link:{" "}
          <strong>Please ask to generate, if required</strong>
        </Typography>
      </Paper>

      {/* Additional Terms */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontSize: matchesSM ? "1rem" : "1.25rem",
          }}
        >
          TERMS AND CONDITIONS:
        </Typography>
        <List dense sx={{ listStyleType: "disc", pl: 2 }}>
          {[
            "Payment Due Date: Payment is due strictly by the Due Date mentioned on this invoice.",
            "Late Payment Charges: We reserve the right to levy interest at 1.5% per month on any overdue amounts.",
            "Payment Reference: Please ensure the Invoice Number is clearly mentioned in your payment transaction details.",
            "Scope of Invoice: This invoice pertains solely to the Google Workspace subscription licenses.",
            "Governing Agreements: The provision and use of Google Workspace services are subject to the terms outlined in the signed Master Service Agreement.",
            "Taxes: All prices listed are exclusive of applicable taxes unless explicitly stated otherwise.",
            "Service Continuity: Provisioning of new licenses is contingent upon the timely receipt of payment in full.",
            "Cancellations & Refunds: Unless otherwise specified, subscription fees are non-refundable once the service period has commenced.",
            "Invoice Discrepancies: Any disputes must be communicated to Anocloud.in in writing within 7 days.",
            "Governing Law & Jurisdiction: This invoice shall be governed by the laws of India.",
          ].map((item, index) => (
            <ListItem key={index} sx={{ display: "list-item", py: 0 }}>
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontSize: matchesSM ? "0.75rem" : "0.875rem",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Signature */}
      <Box sx={{ textAlign: "right", mt: 4 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", fontSize: matchesSM ? "0.875rem" : "1rem" }}
        >
          Authorized Signatory
        </Typography>
        <Typography
          sx={{
            mt: 1,
            fontWeight: "bold",
            fontSize: matchesSM ? "0.875rem" : "1rem",
          }}
        >
          {data.billedBy?.contact || "N/A"}
        </Typography>
        <Typography sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}>
          Director
        </Typography>
        <Typography sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}>
          {data.billedBy?.companyName || "N/A"}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ mt: 4 }}>
        {pdfError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {pdfError}
          </Alert>
        )}
        <PDFDownloadLink
          document={pdfDocument}
          fileName={`invoice_ANO-${data.invoiceDetails?.type}-${data.invoiceDetails?.currentFY}-${data.invoiceDetails?.number}.pdf`}
          onClick={(e) => {
            if (!isFormValid()) {
              e.preventDefault();
              setPdfError(
                "Please fill all required fields before generating PDF"
              );
            }
          }}
        >
          {({ loading, error }) => (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              disabled={!isFormValid() || loading || isGenerating}
              onClick={handlePdfGeneration}
              fullWidth
              size={matchesSM ? "small" : "medium"}
            >
              {loading || isGenerating ? "Generating PDF..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </Box>
    </Paper>
  );
}

export default InvoicePreview;
