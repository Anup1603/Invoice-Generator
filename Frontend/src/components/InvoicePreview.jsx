import React, { useRef, useState } from "react";
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
import { Edit, PictureAsPdf, Save } from "@mui/icons-material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GeneratePDF from "./GeneratePDF";

function InvoicePreview({
  data = {},
  onSectionClick = () => {},
  isMobile = false,
  onSaveInvoice,
  onPdfDownloaded,
  isSaving = false,
  pdfReady = false,
}) {
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const matchesSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const pdfDownloadLinkRef = useRef(null);

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
  };

  const isFormValid = () => {
    return (
      data.billedTo?.companyName &&
      data.billedTo?.address &&
      data.billedTo?.gstNumber &&
      data.billedTo?.contactPerson &&
      data.billedTo?.phoneNumber &&
      data.items?.length > 0 &&
      data.invoiceDetails?.type &&
      data.invoiceDetails?.date &&
      data.invoiceDetails?.dueDate
    );
  };

  const handleSaveClick = async () => {
    if (!isFormValid()) {
      setError("Please fill all required fields before saving");
      return;
    }

    try {
      setError(null);
      await onSaveInvoice();
    } catch (err) {
      setError("Failed to save invoice");
    }
  };

  const handleDownloadClick = () => {
    setIsDownloading(true);
    // Trigger the download
    if (pdfDownloadLinkRef.current) {
      pdfDownloadLinkRef.current.click();
    }
  };

  const handleDownloadComplete = () => {
    setIsDownloading(false);
    onPdfDownloaded();
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
              {data.billedBy?.companyCode || "N/A"}/
              {data.invoiceDetails?.type || "N/A"}/
              {data.invoiceDetails?.currentFY || "N/A"}/
              {data.invoiceDetails?.number || "N/A"}
            </strong>
          </Typography>
          {/* <Typography
            variant="body1"
            sx={{ fontSize: matchesSM ? "0.875rem" : "1rem" }}
          >
            Type: <strong>{data.invoiceDetails?.type || "N/A"}</strong>
          </Typography> */}
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
            GSTIN: {data.billedTo?.gstNumber || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Contact: {data.billedTo?.contactPerson || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Phone: {data.billedTo?.phoneNumber || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Domain: {data.billedTo?.domainName || "N/A"}
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
            GSTIN: {data.billedBy?.gstNumber || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            PAN: {data.billedBy?.panNumber || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Contact: {data.billedBy?.directorName || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
          >
            Phone: {data.billedBy?.phoneNumber || "N/A"}
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
                  Discount (%)
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
                    {(item.discountPercentage || 0).toFixed(2)}%
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
            Totals
          </Typography>
          {!isMobile && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onSectionClick("totals")}
              startIcon={<Edit />}
            >
              Edit
            </Button>
          )}
        </Box>
        <TableContainer>
          <Table size="small" sx={{ mt: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Subtotal
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
                  (-) Item Discounts
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.itemDiscounts || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Amount After Item Discounts
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.amountAfterItemDiscounts || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  (-) Additional Discount (
                  {data.totals?.discountPercentage || 0}%)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.discountAmount || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  Amount After All Discounts
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.amountAfterAllDiscounts || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  (+) GST (@{data.totals?.gstRate || 18}%)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: matchesSM ? "0.75rem" : "0.875rem" }}
                >
                  ₹{(data.totals?.gstAmount || 0).toFixed(2)}
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
                  ₹{(data.totals?.totalAmount || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {isMobile && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => onSectionClick("totals")}
            startIcon={<Edit />}
          >
            Edit Totals
          </Button>
        )}
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
          {data.billedBy?.directorName || "N/A"}
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!pdfReady ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSaveClick}
            disabled={!isFormValid() || isSaving}
            fullWidth
            sx={{ mb: 2 }}
          >
            {isSaving ? "Saving..." : "Save Invoice"}
          </Button>
        ) : (
          <>
            {/* Hidden download link that we'll trigger programmatically */}
            <div style={{ display: "none" }}>
              <PDFDownloadLink
                document={pdfDocument}
                fileName={`Invoice_${data.billedBy?.companyCode}-${data.invoiceDetails?.type}-${data.invoiceDetails?.currentFY}-${data.invoiceDetails?.number}.pdf`}
                ref={pdfDownloadLinkRef}
                onClick={handleDownloadComplete}
              >
                {({ loading }) => (loading ? "Loading..." : "Download")}
              </PDFDownloadLink>
            </div>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdf />}
              onClick={handleDownloadClick}
              disabled={isDownloading}
              fullWidth
            >
              {isDownloading ? "Downloading..." : "Download PDF"}
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}

export default InvoicePreview;
