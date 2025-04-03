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
  IconButton,
  Alert,
} from "@mui/material";
import { Edit, PictureAsPdf } from "@mui/icons-material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GeneratePDF from "./GeneratePDF";

function InvoicePreview({ data = {}, onSectionClick = () => {} }) {
  const [pdfError, setPdfError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const renderEditButton = (section) => (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onSectionClick(section);
      }}
      sx={{ ml: 1 }}
    >
      <Edit fontSize="small" />
    </IconButton>
  );

  const pdfDocument = <GeneratePDF data={data} />;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          TAX INVOICE
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="body1">
            Invoice No: <strong>{data.invoiceDetails?.number || "N/A"}</strong>
          </Typography>
          <Typography variant="body1">
            Date: <strong>{data.invoiceDetails?.date || "N/A"}</strong> | Due
            Date: <strong>{data.invoiceDetails?.dueDate || "N/A"}</strong>
          </Typography>
        </Box>
      </Box>

      {/* Billed To / Billed By */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <Paper elevation={1} sx={{ p: 2, flex: 1, position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              Billed to:
            </Typography>
            {renderEditButton("billedTo")}
          </Box>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
            {data.billedTo?.companyName || "N/A"}
          </Typography>
          <Typography variant="body2">
            {data.billedTo?.address || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            GSTIN: {data.billedTo?.gstin || "N/A"}
          </Typography>
          <Typography variant="body2">
            Contact: {data.billedTo?.contact || "N/A"}
          </Typography>
          <Typography variant="body2">
            Phone: {data.billedTo?.phone || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Domain: {data.billedTo?.domain || "N/A"}
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Billed by:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
            {data.billedBy?.companyName || "N/A"}
          </Typography>
          <Typography variant="body2">
            {data.billedBy?.address || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            GSTIN: {data.billedBy?.gstin || "N/A"}
          </Typography>
          <Typography variant="body2">
            PAN: {data.billedBy?.pan || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Contact: {data.billedBy?.contact || "N/A"}
          </Typography>
          <Typography variant="body2">
            Phone: {data.billedBy?.phone || "N/A"}
          </Typography>
        </Paper>
      </Box>

      {/* Product/Service Details */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            PRODUCT/SERVICE DETAILS
          </Typography>
          {renderEditButton("items")}
        </Box>
        <TableContainer>
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell>Sr.</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Unit Price (₹)</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items?.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.description || "N/A"}</TableCell>
                  <TableCell align="right">{item.quantity || "0"}</TableCell>
                  <TableCell align="right">
                    {(item.unitPrice || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {(item.amount || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Total Taxable Value: ₹{(data.totals?.subtotal || 0).toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Totals */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          Totals
        </Typography>
        <TableContainer>
          <Table size="small" sx={{ mt: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell align="right">
                  ₹{(data.totals?.subtotal || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>(-) Discount</TableCell>
                <TableCell align="right">
                  ₹{(data.totals?.discount || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>(+) GST (@18%)</TableCell>
                <TableCell align="right">
                  ₹{(data.totals?.gst || 0).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Grand Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ₹{(data.totals?.grandTotal || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Terms and Conditions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          TERMS AND CONDITIONS:
        </Typography>
        <List dense sx={{ listStyleType: "disc", pl: 2 }}>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Price will be valid for annual commit & annual payment only.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              No cancellation or partial upgradation is allowed.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Transfer token is mandatory for processing the order and customer
              registered country should be INDIA in customer's Panel.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Purchase order should be in the name of Anocloud Technology
              Solutions LLP only.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              No of users and SKU should be same in Purchase order and
              customer's admin.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              If Google makes any changes in terms of pricing, then pricing will
              be revised and informed.
            </ListItemText>
          </ListItem>
        </List>
      </Paper>

      {/* Payment Details */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          PAYMENT METHOD
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>
          Bank Transfer (NEFT/RTGS/IMPS):
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Account Name:{" "}
          <strong>{data.paymentDetails?.accountName || "N/A"}</strong>
        </Typography>
        <Typography variant="body2">
          Account Number:{" "}
          <strong>{data.paymentDetails?.accountNumber || "N/A"}</strong>
        </Typography>
        <Typography variant="body2">
          Bank Name: <strong>{data.paymentDetails?.bankName || "N/A"}</strong>
        </Typography>
        <Typography variant="body2">
          Branch: <strong>{data.paymentDetails?.branch || "N/A"}</strong>
        </Typography>
        <Typography variant="body2">
          IFSC Code: <strong>{data.paymentDetails?.ifscCode || "N/A"}</strong>
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Credit Card/Debit Card/UPI
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Payment Gateway Link:{" "}
          <strong>Please ask to generate, if required</strong>
        </Typography>
      </Paper>

      {/* Additional Terms */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          TERMS AND CONDITIONS:
        </Typography>
        <List dense sx={{ listStyleType: "disc", pl: 2 }}>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Payment Due Date: Payment is due strictly by the Due Date
              mentioned on this invoice. Timely payment is essential for the
              continuation of services.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Late Payment Charges: We reserve the right to levy interest at
              1.5% per month (or 18% per annum), calculated on a daily basis, on
              any overdue amounts from the due date until the date payment is
              received in full by Anocloud.in.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Payment Reference: Please ensure the Invoice Number is clearly
              mentioned in your payment transaction details (e.g.,
              NEFT/RTGS/IMPS remarks, cheque memo) for accurate reconciliation
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Scope of Invoice: This invoice pertains solely to the Google
              Workspace subscription licenses and service period(s) detailed
              herein. Any additional services will be invoiced separately.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Governing Agreements: The provision and use of Google Workspace
              services are subject to the terms outlined in the signed Master
              Service Agreement / Accepted Quote between Anocloud.in and the
              Client, and the applicable, then-current Google Workspace Terms of
              Service, which the Client is deemed to have accepted upon using
              the service.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Taxes: All prices listed are exclusive of applicable taxes unless
              explicitly stated otherwise. Goods and Services Tax (GST) has been
              charged based on the Place of Supply and prevailing Indian tax
              laws.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Service Continuity: Provisioning of new licenses and continued
              access to existing Google Workspace services covered by this
              invoice are contingent upon the timely receipt of payment in full.
              Non-payment may lead to suspension or termination of services as
              per the governing agreement.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Cancellations & Refunds: Unless otherwise specified in the Master
              Service Agreement, subscription fees are non-refundable once the
              service period has commenced or licenses have been provisioned by
              Google/Redington.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Invoice Discrepancies: Any disputes or discrepancies regarding
              this invoice must be communicated to Anocloud.in in writing within
              7 (seven) days of the invoice date. Otherwise, the invoice shall
              be deemed accepted by the Client.
            </ListItemText>
          </ListItem>
          <ListItem sx={{ display: "list-item", py: 0 }}>
            <ListItemText>
              Governing Law & Jurisdiction: This invoice, and any disputes
              arising from it, shall be governed by the laws of India. All
              disputes shall be subject to the exclusive jurisdiction of the
              competent courts in Jamshedpur, Jharkhand, India.
            </ListItemText>
          </ListItem>
        </List>
      </Paper>

      {/* Signature */}
      <Box sx={{ textAlign: "right", mt: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Authorized Signatory
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: "bold" }}>
          Vishal Kumar Gupta
        </Typography>
        <Typography>Director</Typography>
        <Typography>Anocloud Technology Solutions LLP</Typography>
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
          fileName={`invoice_${data.invoiceDetails?.number || "invoice"}.pdf`}
        >
          {({ loading }) => (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              disabled={loading || isGenerating}
              onClick={() => {
                setIsGenerating(true);
                setPdfError(null);
              }}
              fullWidth
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
