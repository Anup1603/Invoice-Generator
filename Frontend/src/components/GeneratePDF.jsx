// import React, { memo } from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
//   Image,
// } from "@react-pdf/renderer";

// // Register fonts (keep existing font registration)
// Font.register({
//   family: "Roboto",
//   fonts: [
//     {
//       src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
//       fontWeight: "normal",
//     },
//     {
//       src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
//       fontWeight: "bold",
//     },
//   ],
// });

// Font.register({
//   family: "Noto Sans",
//   src: "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr6zRF.ttf",
// });

// // Keep all existing styles

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     paddingTop: 80, // Increased to accommodate header
//     paddingBottom: 60, // Increased to accommodate footer
//     fontFamily: "Roboto",
//     backgroundColor: "#fff",
//     position: "relative",
//   },
//   container: {
//     border: "1px solid #ccc",
//     borderRadius: 2,
//     padding: 15,
//     paddingTop: 40, // Added space for header
//     paddingBottom: 30, // Added space for footer
//   },
//   header: {
//     position: "absolute",
//     top: 30, // Reduced from 20 for better spacing
//     left: 40,
//     right: 40,
//     height: 70, // Fixed height for header
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     paddingBottom: 10,
//     marginBottom: 20,
//   },
//   headerLeft: {
//     flexDirection: "column",
//   },
//   headerRight: {
//     flexDirection: "column",
//     alignItems: "flex-end",
//     fontSize: 14,
//     color: "#003300",
//   },
//   gstSection: {
//     marginBottom: 5,
//   },
//   footer: {
//     position: "absolute",
//     bottom: 30, // Reduced from 20 for better spacing
//     left: 40,
//     right: 40,
//     height: 40, // Fixed height for footer
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingTop: 10,
//     fontSize: 8,
//     color: "#404040",
//   },
//   footerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   footerRight: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   footerIcon: {
//     marginRight: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#003300",
//     marginBottom: 15,
//   },
//   invoiceInfo: {
//     fontSize: 10,
//     color: "#404040",
//     marginBottom: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   leftText: {
//     textAlign: "left",
//     flex: 1,
//   },
//   rightText: {
//     textAlign: "right",
//     flex: 1,
//   },
//   columns: {
//     flexDirection: "row",
//     marginBottom: 20,
//     justifyContent: "space-between",
//   },
//   column: {
//     width: "46%",
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     backgroundColor: "#f5f5f5",
//     padding: 5,
//     marginBottom: 5,
//     borderBottom: "1px solid #ccc",
//   },
//   sectionContent: {
//     fontSize: 12,
//     lineHeight: 1.8,
//     paddingLeft: 5,
//     color: "#404040",
//   },
//   table: {
//     width: "100%",
//     marginTop: 10,
//     marginBottom: 15,
//     border: "1px solid #ccc",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f5f5f5",
//     borderBottom: "1px solid #ccc",
//     paddingVertical: 5,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottom: "1px solid #ccc",
//     paddingVertical: 8,
//   },
//   col1: {
//     width: "10%",
//     paddingLeft: 5,
//     fontSize: 10,
//   },
//   col2: {
//     width: "45%",
//     fontSize: 10,
//   },
//   col3: {
//     width: "10%",
//     fontSize: 10,
//     textAlign: "right",
//     paddingRight: 5,
//   },
//   col4: {
//     width: "20%",
//     fontSize: 10,
//     textAlign: "right",
//     paddingRight: 5,
//   },
//   col5: {
//     width: "15%",
//     fontSize: 9,
//     textAlign: "right",
//     paddingRight: 5,
//   },
//   totalsTable: {
//     width: "60%",
//     marginLeft: "auto",
//     marginTop: 10,
//     border: "1px solid #ccc",
//     fontSize: 10,
//     lineHeight: 1.8,
//   },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 8,
//     borderBottom: "1px solid #ccc",
//   },
//   termsList: {
//     marginTop: 10,
//     paddingLeft: 10,
//   },
//   termItem: {
//     fontSize: 10,
//     marginBottom: 4,
//     lineHeight: 1.8,
//   },
//   paymentDetails: {
//     marginTop: 15,
//   },
//   signature: {
//     marginTop: 30,
//     flexDirection: "column",
//     alignItems: "flex-end",
//     fontSize: 12,
//     textAlign: "right",
//   },
//   rupeeSymbol: {
//     fontFamily: "Noto Sans",
//   },
//   logo: {
//     width: 120,
//     height: 40,
//     marginBottom: 10,
//   },
//   secondaryLogo: {
//     width: 80,
//     height: 30,
//   },
//   fallbackCompanyName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#003300",
//   },
// });

// const formatCurrency = (amount) => {
//   return (
//     <Text>
//       <Text style={styles.rupeeSymbol}>₹</Text>
//       {amount.toFixed(2)}
//     </Text>
//   );
// };

// const formatAddress = (address) => {
//   if (!address) return "N/A";
//   if (typeof address === "string") return address;
//   return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
// };

// const GeneratePDF = memo(({ data }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View style={styles.header} fixed>
//           <View style={styles.headerLeft}>
//             {data.logo ? (
//               <Image style={styles.logo} src={data.logo} />
//             ) : (
//               <Text style={styles.fallbackCompanyName}>
//                 {data.billedBy?.companyName || "N/A"}
//               </Text>
//             )}
//           </View>
//           <View style={styles.headerRight}>
//             <View style={styles.gstSection}>
//               <Text>GSTIN: {data.billedBy?.gstNumber || "N/A"}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.container}>
//           {/* Invoice Info */}
//           <Text style={styles.title}>TAX INVOICE</Text>
//           <View style={styles.invoiceInfo}>
//             <Text style={styles.leftText}>
//               Invoice Number:{" "}
//               <Text style={{ fontWeight: "bold" }}>
//                 ANO/
//                 {data.invoiceDetails?.type || "N/A"}/
//                 {data.invoiceDetails?.currentFY || "N/A"}/
//                 {data.invoiceDetails?.number || "N/A"}
//               </Text>
//             </Text>
//             <Text style={styles.rightText}>
//               Date:{" "}
//               <Text style={{ fontWeight: "bold" }}>
//                 {new Date(data.invoiceDetails?.date).toLocaleDateString(
//                   "en-GB"
//                 ) || "N/A"}
//               </Text>{" "}
//               | Due Date:{" "}
//               <Text style={{ fontWeight: "bold" }}>
//                 {new Date(data.invoiceDetails?.dueDate).toLocaleDateString(
//                   "en-GB"
//                 ) || "N/A"}
//               </Text>
//             </Text>
//           </View>

//           {/* Billed To / Billed By */}
//           <View style={styles.columns}>
//             <View style={styles.column}>
//               <Text style={styles.sectionTitle}>Billed to:</Text>
//               <View style={styles.sectionContent}>
//                 <Text style={{ fontWeight: "bold", color: "#003300" }}>
//                   {data.billedTo?.companyName || "N/A"}
//                 </Text>
//                 <Text>{formatAddress(data.billedTo?.address)}</Text>
//                 <Text style={{ marginTop: "18px" }}>
//                   GSTIN: {data.billedTo?.gstNumber || "N/A"}
//                 </Text>
//                 <Text style={{ marginTop: "18px" }}>
//                   Contact: {data.billedTo?.contactPerson || "N/A"}
//                 </Text>
//                 <Text>Phone: {data.billedTo?.phoneNumber || "N/A"}</Text>
//                 <Text style={{ marginTop: "18px" }}>
//                   Domain: {data.billedTo?.domainName || "N/A"}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.column}>
//               <Text style={styles.sectionTitle}>Billed by:</Text>
//               <View style={styles.sectionContent}>
//                 <Text style={{ fontWeight: "bold", color: "#003300" }}>
//                   {data.billedBy?.companyName || "N/A"}
//                 </Text>
//                 <Text>{data.billedBy?.address || "N/A"}</Text>
//                 <Text style={{ marginTop: "18px" }}>
//                   GSTIN: {data.billedBy?.gstNumber || "N/A"}
//                 </Text>
//                 <Text>PAN: {data.billedBy?.panNumber || "N/A"}</Text>
//                 <Text style={{ marginTop: "18px" }}>
//                   Contact: {data.billedBy?.directorName || "N/A"}
//                 </Text>
//                 <Text>Phone: {data.billedBy?.phoneNumber || "N/A"}</Text>
//               </View>
//             </View>
//           </View>

//           {/* Product/Service Details */}
//           <Text style={styles.sectionTitle}>PRODUCT/SERVICE DETAILS</Text>
//           <View style={styles.table}>
//             {/* Table Header */}
//             <View style={styles.tableHeader}>
//               <Text style={styles.col1}>Sr.No</Text>
//               <Text style={styles.col2}>Description of Product / Service</Text>
//               <Text style={styles.col3}>Qty</Text>
//               <Text style={styles.col4}>Unit Price</Text>
//               <Text style={styles.col5}>Amount</Text>
//             </View>

//             {/* Table Rows */}
//             {data.items?.map((item, index) => (
//               <View style={styles.tableRow} key={item.id || index}>
//                 <Text style={styles.col1}>{index + 1}</Text>
//                 <Text style={styles.col2}>
//                   {item.description || item.name || "N/A"}
//                 </Text>
//                 <Text style={styles.col3}>{item.quantity || "0"}</Text>
//                 <Text style={styles.col4}>
//                   {formatCurrency(item.unitPrice || 0)}
//                 </Text>
//                 <Text style={styles.col5}>
//                   {formatCurrency(item.amount || 0)}
//                 </Text>
//               </View>
//             ))}
//           </View>

//           {/* Totals */}
//           <View style={styles.totalsTable}>
//             <View style={styles.totalRow}>
//               <Text>Total Taxable Value:</Text>
//               <Text>{formatCurrency(data.totals?.subtotal || 0)}</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text>(-) Discount:</Text>
//               <Text>{formatCurrency(data.totals?.discount || 0)}</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text>(+) GST (@18%):</Text>
//               <Text>{formatCurrency(data.totals?.gst || 0)}</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text>Net Total:</Text>
//               <Text>{formatCurrency(data.totals?.grandTotal || 0)}</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text>Add/Less Adjustments:</Text>
//               <Text>
//                 {formatCurrency(data.totals?.addLessAdjustments || 0)}
//               </Text>
//             </View>
//             <View style={[styles.totalRow, { backgroundColor: "#f5f5f5" }]}>
//               <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
//               <Text style={{ fontWeight: "bold" }}>
//                 {formatCurrency(data.totals?.grandTotal || 0)}
//               </Text>
//             </View>
//           </View>

//           {/* Terms and Conditions */}
//           <View style={{ marginTop: 15 }}>
//             <Text style={styles.sectionTitle}>TERMS AND CONDITIONS:</Text>
//             <View style={styles.termsList}>
//               <Text style={styles.termItem}>
//                 • Price will be valid for annual commit & annual payment only.
//               </Text>
//               <Text style={styles.termItem}>
//                 • No cancellation or partial upgradation is allowed.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Transfer token is mandatory for processing the order.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Purchase order should be in the name of{" "}
//                 {data.billedBy?.companyName || "our company"}.
//               </Text>
//               <Text style={styles.termItem}>
//                 • No of users and SKU should be same in Purchase order and
//                 customer's admin.
//               </Text>
//             </View>
//           </View>

//           {/* Payment Details */}
//           <View style={styles.paymentDetails}>
//             <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
//             <View style={styles.sectionContent}>
//               <Text style={{ fontWeight: "bold" }}>
//                 Bank Transfer (NEFT/RTGS/IMPS):
//               </Text>
//               <Text style={{ marginTop: "16px" }}>
//                 Account Name:{" "}
//                 <Text style={{ fontWeight: "bold", color: "black" }}>
//                   {data.paymentDetails?.accountName || "N/A"}
//                 </Text>
//               </Text>
//               <Text>
//                 Account Number:{" "}
//                 <Text style={{ fontWeight: "bold", color: "black" }}>
//                   {data.paymentDetails?.accountNumber || "N/A"}
//                 </Text>
//               </Text>
//               <Text>
//                 Bank Name:{" "}
//                 <Text style={{ fontWeight: "bold", color: "black" }}>
//                   {data.paymentDetails?.bankName || "N/A"}
//                 </Text>
//               </Text>
//               <Text>
//                 Branch:{" "}
//                 <Text style={{ fontWeight: "bold", color: "black" }}>
//                   {data.paymentDetails?.branch || "N/A"}
//                 </Text>
//               </Text>
//               <Text>
//                 IFSC Code:{" "}
//                 <Text style={{ fontWeight: "bold", color: "black" }}>
//                   {data.paymentDetails?.ifscCode || "N/A"}
//                 </Text>
//               </Text>
//             </View>
//           </View>

//           {/* Additional Payment Options */}
//           <View style={styles.paymentDetails}>
//             <Text style={styles.sectionTitle}>Credit Card/Debit Card/UPI</Text>
//             <Text style={styles.sectionContent}>
//               <Text>Payment Gateway Link: </Text>
//               <Text style={{ fontWeight: "bold" }}>
//                 Please ask to generate, if required
//               </Text>
//             </Text>
//           </View>

//           {/* INVOICE DETAILS Terms and Conditions */}
//           <View style={{ marginTop: 15 }}>
//             <Text style={styles.sectionTitle}>TERMS AND CONDITIONS:</Text>
//             <View style={styles.termsList}>
//               <Text style={styles.termItem}>
//                 • Payment Due Date: Payment is due strictly by the Due Date
//                 mentioned on this invoice. Timely payment is essential for the
//                 continuation of services.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Late Payment Charges: We reserve the right to levy interest at
//                 1.5% per month (or 18% per annum), calculated on a daily basis,
//                 on any overdue amounts from the due date until the date payment
//                 is received in full by Anocloud.in.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Payment Reference: Please ensure the Invoice Number is clearly
//                 mentioned in your payment transaction details (e.g.,
//                 NEFT/RTGS/IMPS remarks, cheque memo) for accurate reconciliation
//               </Text>
//               <Text style={styles.termItem}>
//                 • Scope of Invoice: This invoice pertains solely to the Google
//                 Workspace subscription licenses and service period(s) detailed
//                 herein. Any additional services will be invoiced separately.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Governing Agreements: The provision and use of Google
//                 Workspace services are subject to the terms outlined in the
//                 signed Master Service Agreement / Accepted Quote between
//                 Anocloud.in and the Client, and the applicable, then-current
//                 Google Workspace Terms of Service, which the Client is deemed to
//                 have accepted upon using the service.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Taxes: All prices listed are exclusive of applicable taxes
//                 unless explicitly stated otherwise. Goods and Services Tax (GST)
//                 has been charged based on the Place of Supply and prevailing
//                 Indian tax laws.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Service Continuity: Provisioning of new licenses and continued
//                 access to existing Google Workspace services covered by this
//                 invoice are contingent upon the timely receipt of payment in
//                 full. Non-payment may lead to suspension or termination of
//                 services as per the governing agreement.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Cancellations & Refunds: Unless otherwise specified in the
//                 Master Service Agreement, subscription fees are non-refundable
//                 once the service period has commenced or licenses have been
//                 provisioned by Google/Redington.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Invoice Discrepancies: Any disputes or discrepancies regarding
//                 this invoice must be communicated to Anocloud.in in writing
//                 within 7 (seven) days of the invoice date. Otherwise, the
//                 invoice shall be deemed accepted by the Client.
//               </Text>
//               <Text style={styles.termItem}>
//                 • Governing Law & Jurisdiction: This invoice, and any disputes
//                 arising from it, shall be governed by the laws of India. All
//                 disputes shall be subject to the exclusive jurisdiction of the
//                 competent courts in Jamshedpur, Jharkhand, India.
//               </Text>
//             </View>
//           </View>

//           {/* Signature */}
//           <View style={styles.signature}>
//             <Text
//               style={{
//                 fontWeight: "bold",
//                 textAlign: "right",
//                 color: "#003300",
//               }}
//             >
//               Authorized Signature
//             </Text>
//             <Text style={{ marginTop: 5, fontWeight: "bold" }}>
//               {data.billedBy?.contact || "N/A"}
//             </Text>
//             <Text>Director</Text>
//             <Text>{data.billedBy?.companyName || "N/A"}</Text>
//           </View>

//           {/* Declaration */}
//           <View style={{ marginTop: 30 }}>
//             <Text style={{ fontSize: 10, fontWeight: "bold" }}>
//               Declaration:
//             </Text>
//             <Text style={{ fontSize: 10 }}>
//               We declare that this invoice shows the actual price of the
//               goods/services described and that all particulars are true and
//               correct
//             </Text>
//           </View>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer} fixed>
//           <View style={styles.footerLeft}>
//             <Text>Contact: {data.billedBy?.phone || "N/A"}</Text>
//           </View>
//           <View style={styles.footerRight}>
//             <Text>{data.billedBy?.address || "N/A"}</Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// });

// export default GeneratePDF;

import React, { memo } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "Noto Sans",
  src: "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr6zRF.ttf",
});

// Keep all existing styles

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingTop: 80, // Increased to accommodate header
    paddingBottom: 60, // Increased to accommodate footer
    fontFamily: "Roboto",
    backgroundColor: "#fff",
    position: "relative",
  },
  container: {
    border: "1px solid #ccc",
    borderRadius: 2,
    padding: 15,
    paddingTop: 40, // Added space for header
    paddingBottom: 30, // Added space for footer
  },
  header: {
    position: "absolute",
    top: 30, // Reduced from 20 for better spacing
    left: 40,
    right: 40,
    height: 70, // Fixed height for header
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 14,
    color: "#003300",
  },
  gstSection: {
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30, // Reduced from 20 for better spacing
    left: 40,
    right: 40,
    height: 40, // Fixed height for footer
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    fontSize: 8,
    color: "#404040",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIcon: {
    marginRight: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003300",
    marginBottom: 15,
  },
  invoiceInfo: {
    fontSize: 10,
    color: "#404040",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftText: {
    textAlign: "left",
    flex: 1,
  },
  rightText: {
    textAlign: "right",
    flex: 1,
  },
  columns: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  column: {
    width: "46%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginBottom: 5,
    borderBottom: "1px solid #ccc",
  },
  sectionContent: {
    fontSize: 12,
    lineHeight: 1.8,
    paddingLeft: 5,
    color: "#404040",
  },
  table: {
    width: "100%",
    marginTop: 10,
    marginBottom: 15,
    border: "1px solid #ccc",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 8,
  },
  col1: {
    width: "10%",
    paddingLeft: 5,
    fontSize: 10,
  },
  col2: {
    width: "35%",
    fontSize: 10,
  },
  col3: {
    width: "10%",
    fontSize: 10,
    textAlign: "right",
    paddingRight: 5,
  },
  col4: {
    width: "15%",
    fontSize: 10,
    textAlign: "right",
    paddingRight: 5,
  },
  col5: {
    width: "15%",
    fontSize: 10,
    textAlign: "right",
    paddingRight: 5,
  },

  col6: {
    width: "15%",
    fontSize: 10,
    textAlign: "right",
    paddingRight: 5,
  },

  totalsTable: {
    width: "60%",
    marginLeft: "auto",
    marginTop: 10,
    border: "1px solid #ccc",
    fontSize: 10,
    lineHeight: 1.8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottom: "1px solid #ccc",
  },
  termsList: {
    marginTop: 10,
    paddingLeft: 10,
  },
  termItem: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.8,
  },
  paymentDetails: {
    marginTop: 15,
  },
  signature: {
    marginTop: 30,
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 12,
    textAlign: "right",
  },
  rupeeSymbol: {
    fontFamily: "Noto Sans",
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  secondaryLogo: {
    width: 80,
    height: 30,
  },
  fallbackCompanyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003300",
  },
});

const formatCurrency = (amount) => {
  return (
    <Text>
      <Text style={styles.rupeeSymbol}>₹</Text>
      {amount.toFixed(2)}
    </Text>
  );
};

const formatAddress = (address) => {
  if (!address) return "N/A";
  if (typeof address === "string") return address;
  return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
};

const GeneratePDF = memo(({ data }) => {
  // Extract all values with proper fallbacks to match InvoiceMain
  const {
    billedTo = {},
    billedBy = {},
    invoiceDetails = {},
    items = [],
    paymentDetails = {},
    totals = {},
    logo = "",
  } = data;

  const {
    companyName: billedToCompanyName = "",
    address: billedToAddress = {},
    gstNumber: billedToGstNumber = "",
    contactPerson: billedToContactPerson = "",
    phoneNumber: billedToPhoneNumber = "",
    domainName: billedToDomainName = "",
  } = billedTo;

  const {
    companyName: billedByCompanyName = "",
    address: billedByAddress = "",
    gstNumber: billedByGstNumber = "",
    panNumber: billedByPanNumber = "",
    directorName: billedByDirectorName = "",
    phoneNumber: billedByPhoneNumber = "",
  } = billedBy;

  const {
    type: invoiceType = "SW",
    number: invoiceNumber = "",
    date: invoiceDate = new Date().toISOString().split("T")[0],
    dueDate: invoiceDueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currentFY: invoiceCurrentFY = "",
    fullInvoiceNumber = "",
  } = invoiceDetails;

  const {
    accountName: paymentAccountName = "",
    accountNumber: paymentAccountNumber = "",
    bankName: paymentBankName = "",
    branch: paymentBranch = "",
    ifscCode: paymentIfscCode = "",
  } = paymentDetails;

  const {
    subtotal = 0,
    itemDiscounts = 0,
    amountAfterItemDiscounts = 0,
    discountPercentage = 0,
    discountAmount = 0,
    amountAfterAllDiscounts = 0,
    gstRate = 18,
    gstAmount = 0,
    totalAmount = 0,
  } = totals;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {logo ? (
              <Image style={styles.logo} src={logo} />
            ) : (
              <Text style={styles.fallbackCompanyName}>
                {billedByCompanyName}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <View style={styles.gstSection}>
              <Text>GSTIN: {billedByGstNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          {/* Invoice Info */}
          <Text style={styles.title}>TAX INVOICE</Text>
          <View style={styles.invoiceInfo}>
            <Text style={styles.leftText}>
              Invoice Number:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {fullInvoiceNumber ||
                  `ANO/${invoiceType}/${invoiceCurrentFY}/${invoiceNumber}`}
              </Text>
            </Text>
            <Text style={styles.rightText}>
              Date:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {new Date(invoiceDate).toLocaleDateString("en-GB")}
              </Text>{" "}
              | Due Date:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {new Date(invoiceDueDate).toLocaleDateString("en-GB")}
              </Text>
            </Text>
          </View>

          {/* Billed To / Billed By */}
          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Billed to:</Text>
              <View style={styles.sectionContent}>
                <Text style={{ fontWeight: "bold", color: "#003300" }}>
                  {billedToCompanyName}
                </Text>
                <Text>{formatAddress(billedToAddress)}</Text>
                <Text style={{ marginTop: "18px" }}>
                  GSTIN: {billedToGstNumber}
                </Text>
                <Text style={{ marginTop: "18px" }}>
                  Contact: {billedToContactPerson}
                </Text>
                <Text>Phone: {billedToPhoneNumber}</Text>
                <Text style={{ marginTop: "18px" }}>
                  Domain: {billedToDomainName}
                </Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Billed by:</Text>
              <View style={styles.sectionContent}>
                <Text style={{ fontWeight: "bold", color: "#003300" }}>
                  {billedByCompanyName}
                </Text>
                <Text>{billedByAddress}</Text>
                <Text style={{ marginTop: "18px" }}>
                  GSTIN: {billedByGstNumber}
                </Text>
                <Text>PAN: {billedByPanNumber}</Text>
                <Text style={{ marginTop: "18px" }}>
                  Contact: {billedByDirectorName}
                </Text>
                <Text>Phone: {billedByPhoneNumber}</Text>
              </View>
            </View>
          </View>

          {/* Product/Service Details */}
          <Text style={styles.sectionTitle}>PRODUCT/SERVICE DETAILS</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Sr.No</Text>
              <Text style={styles.col2}>Description of Product / Service</Text>
              <Text style={styles.col3}>Qty</Text>
              <Text style={styles.col4}>Unit Price</Text>
              <Text style={styles.col5}>Discount (%)</Text>
              <Text style={styles.col6}>Amount</Text>
            </View>

            {/* Table Rows */}
            {items.map((item, index) => {
              const {
                description = "",
                name = "",
                quantity = 0,
                unitPrice = 0,
                discountPercentage: itemDiscount = 0,
                amount = 0,
              } = item;

              return (
                <View style={styles.tableRow} key={item.id || index}>
                  <Text style={styles.col1}>{index + 1}</Text>
                  <Text style={styles.col2}>{description || name}</Text>
                  <Text style={styles.col3}>{quantity}</Text>
                  <Text style={styles.col4}>{formatCurrency(unitPrice)}</Text>
                  <Text style={styles.col5}>{itemDiscount.toFixed(2)}%</Text>
                  <Text style={styles.col6}>{formatCurrency(amount)}</Text>
                </View>
              );
            })}
          </View>

          {/* Totals */}
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>(-) Item Discounts:</Text>
              <Text>{formatCurrency(itemDiscounts)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Amount After Item Discounts:</Text>
              <Text>{formatCurrency(amountAfterItemDiscounts)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>(-) Additional Discount ({discountPercentage}%):</Text>
              <Text>{formatCurrency(discountAmount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Amount After All Discounts:</Text>
              <Text>{formatCurrency(amountAfterAllDiscounts)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>(+) GST (@{gstRate}%):</Text>
              <Text>{formatCurrency(gstAmount)}</Text>
            </View>
            <View style={[styles.totalRow, { backgroundColor: "#f5f5f5" }]}>
              <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={{ marginTop: 15 }}>
            <Text style={styles.sectionTitle}>TERMS AND CONDITIONS:</Text>
            <View style={styles.termsList}>
              <Text style={styles.termItem}>
                • Price will be valid for annual commit & annual payment only.
              </Text>
              <Text style={styles.termItem}>
                • No cancellation or partial upgradation is allowed.
              </Text>
              <Text style={styles.termItem}>
                • Transfer token is mandatory for processing the order.
              </Text>
              <Text style={styles.termItem}>
                • Purchase order should be in the name of {billedByCompanyName}.
              </Text>
              <Text style={styles.termItem}>
                • No of users and SKU should be same in Purchase order and
                customer's admin.
              </Text>
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetails}>
            <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
            <View style={styles.sectionContent}>
              <Text style={{ fontWeight: "bold" }}>
                Bank Transfer (NEFT/RTGS/IMPS):
              </Text>
              <Text style={{ marginTop: "16px" }}>
                Account Name:{" "}
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  {paymentAccountName}
                </Text>
              </Text>
              <Text>
                Account Number:{" "}
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  {paymentAccountNumber}
                </Text>
              </Text>
              <Text>
                Bank Name:{" "}
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  {paymentBankName}
                </Text>
              </Text>
              <Text>
                Branch:{" "}
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  {paymentBranch}
                </Text>
              </Text>
              <Text>
                IFSC Code:{" "}
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  {paymentIfscCode}
                </Text>
              </Text>
            </View>
          </View>

          {/* Additional Payment Options */}
          <View style={styles.paymentDetails}>
            <Text style={styles.sectionTitle}>Credit Card/Debit Card/UPI</Text>
            <Text style={styles.sectionContent}>
              <Text>Payment Gateway Link: </Text>
              <Text style={{ fontWeight: "bold" }}>
                Please ask to generate, if required
              </Text>
            </Text>
          </View>

          {/* INVOICE DETAILS Terms and Conditions */}
          <View style={{ marginTop: 15 }}>
            <Text style={styles.sectionTitle}>TERMS AND CONDITIONS:</Text>
            <View style={styles.termsList}>
              <Text style={styles.termItem}>
                • Payment Due Date: Payment is due strictly by the Due Date
                mentioned on this invoice. Timely payment is essential for the
                continuation of services.
              </Text>
              <Text style={styles.termItem}>
                • Late Payment Charges: We reserve the right to levy interest at
                1.5% per month (or 18% per annum), calculated on a daily basis,
                on any overdue amounts from the due date until the date payment
                is received in full by Anocloud.in.
              </Text>
              <Text style={styles.termItem}>
                • Payment Reference: Please ensure the Invoice Number is clearly
                mentioned in your payment transaction details (e.g.,
                NEFT/RTGS/IMPS remarks, cheque memo) for accurate reconciliation
              </Text>
              <Text style={styles.termItem}>
                • Scope of Invoice: This invoice pertains solely to the Google
                Workspace subscription licenses and service period(s) detailed
                herein. Any additional services will be invoiced separately.
              </Text>
              <Text style={styles.termItem}>
                • Governing Agreements: The provision and use of Google
                Workspace services are subject to the terms outlined in the
                signed Master Service Agreement / Accepted Quote between
                Anocloud.in and the Client, and the applicable, then-current
                Google Workspace Terms of Service, which the Client is deemed to
                have accepted upon using the service.
              </Text>
              <Text style={styles.termItem}>
                • Taxes: All prices listed are exclusive of applicable taxes
                unless explicitly stated otherwise. Goods and Services Tax (GST)
                has been charged based on the Place of Supply and prevailing
                Indian tax laws.
              </Text>
              <Text style={styles.termItem}>
                • Service Continuity: Provisioning of new licenses and continued
                access to existing Google Workspace services covered by this
                invoice are contingent upon the timely receipt of payment in
                full. Non-payment may lead to suspension or termination of
                services as per the governing agreement.
              </Text>
              <Text style={styles.termItem}>
                • Cancellations & Refunds: Unless otherwise specifed in the
                Master Service Agreement, subscription fees are non-refundable
                once the service period has commenced or licenses have been
                provisioned by Google/Redington.
              </Text>
              <Text style={styles.termItem}>
                • Invoice Discrepancies: Any disputes or discrepancies regarding
                this invoice must be communicated to Anocloud.in in writing
                within 7 (seven) days of the invoice date. Otherwise, the
                invoice shall be deemed accepted by the Client.
              </Text>
              <Text style={styles.termItem}>
                • GGoverning Law & Jurisdiction: This invoice, and any disputes
                arising from it, shall be governed by the laws of India. All
                disputes shall be subject to the exclusive jurisdiction of the
                competent courts in Jamshedpur, Jharkhand, India.
              </Text>
            </View>
          </View>

          {/* Signature */}
          <View style={styles.signature}>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "right",
                color: "#003300",
              }}
            >
              Authorized Signature
            </Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>
              {billedByDirectorName}
            </Text>
            <Text>Director</Text>
            <Text>{billedByCompanyName}</Text>
          </View>

          {/* Declaration */}
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              Declaration:
            </Text>
            <Text style={{ fontSize: 10 }}>
              We declare that this invoice shows the actual price of the
              goods/services described and that all particulars are true and
              correct
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Text>Contact: {billedByPhoneNumber}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text>{billedByAddress}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
});

export default GeneratePDF;
