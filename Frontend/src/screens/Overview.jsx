import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchInvoiceData } from "../invoiceApi";
import {
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  MoneyOff as MoneyOffIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const Overview = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInvoiceData();
        setInvoiceData(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate summary data
  const totalTurnover = invoiceData
    .filter((invoice) => invoice.status !== "cancelled")
    .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

  const totalAmountReceived = invoiceData
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

  const totalDueAmount = invoiceData
    .filter((invoice) => ["sent", "overdue", "draft"].includes(invoice.status))
    .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

  // Get today's due invoices (non-cancelled)
  const today = new Date();
  const todaysPayments = invoiceData.filter((invoice) => {
    if (invoice.status === "cancelled") return false;
    if (!invoice.dueDate) return false;
    const dueDate = new Date(invoice.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });

  // Get overdue invoices
  const overduePayments = invoiceData.filter(
    (invoice) => invoice.status === "overdue"
  );

  // Prepare monthly invoice data for chart
  const getMonthlyInvoiceData = () => {
    const months = Array(12)
      .fill(0)
      .map((_, i) => i + 1);
    const monthlyCounts = months.map((month) => {
      const monthInvoices = invoiceData.filter((invoice) => {
        if (!invoice.createdAt) return false;
        const invoiceDate = new Date(invoice.createdAt);
        return (
          invoiceDate.getFullYear() === selectedYear &&
          invoiceDate.getMonth() + 1 === month
        );
      });
      return monthInvoices.length;
    });

    return months.map((month, index) => ({
      name: new Date(selectedYear, month - 1, 1).toLocaleString("default", {
        month: "short",
      }),
      invoices: monthlyCounts[index],
    }));
  };

  const availableYears = [
    ...new Set(
      invoiceData
        .map((invoice) =>
          invoice.createdAt ? new Date(invoice.createdAt).getFullYear() : null
        )
        .filter((year) => year !== null)
    ),
  ].sort((a, b) => b - a);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
          Loading Overview ...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="error">
          Error loading invoice data: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: isMobile ? 1 : isTablet ? 3 : 3,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        height: "84vh",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="text.secondary"
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        Invoice Dashboard
      </Typography>

      {/* Summary Cards Section - Full width with equal height cards */}
      <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
        {[
          {
            title: "Total Turnover",
            value: totalTurnover,
            description: "All non-cancelled invoices",
            icon: <TrendingUpIcon />,
            bgColor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            iconColor: theme.palette.primary.main,
          },
          {
            title: "Amount Received",
            value: totalAmountReceived,
            description: "Paid invoices only",
            icon: <CheckCircleIcon />,
            bgColor: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
            iconColor: theme.palette.success.main,
          },
          {
            title: "Total Due Amount",
            value: totalDueAmount,
            description: "Pending payment",
            icon: <ScheduleIcon />,
            bgColor: "linear-gradient(135deg, #fff8e1 0%, #ffe082 100%)",
            iconColor: theme.palette.warning.main,
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={4} key={index} sx={{ display: "flex" }}>
            <Card
              elevation={0}
              sx={{
                width: "40vh",
                borderRadius: 3,
                background: card.bgColor,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease-in-out",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: card.iconColor,
                      borderRadius: "50%",
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      color: "white",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ₹
                  {card.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Second Section - Payments and Chart */}
      <Grid container spacing={3} sx={{ width: "100%", mb: 3 }}>
        {/* Payments Section - 40% width */}
        <Grid item xs={12} md={4.5}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 2,
              height: "100%",
              minHeight: 450,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              width: isMobile ? "40vh" : "50vh",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                },
              }}
            >
              <Tab
                label={`Today (${todaysPayments.length})`}
                icon={<EventIcon />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab
                label={`Overdue (${overduePayments.length})`}
                icon={<WarningIcon />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            </Tabs>

            <Box
              sx={{
                pt: 2,
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {activeTab === 0 ? (
                todaysPayments.length > 0 ? (
                  <List
                    sx={{
                      flex: 1,
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: theme.palette.grey[100],
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: theme.palette.grey[400],
                        borderRadius: "3px",
                      },
                    }}
                  >
                    {todaysPayments.map((invoice, index) => (
                      <React.Fragment key={invoice._id}>
                        <ListItem
                          sx={{
                            px: 2,
                            py: 1.5,
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                              >
                                {invoice.customer?.companyName ||
                                  "Unknown Client"}
                              </Typography>
                            }
                            secondary={`Due: ₹${(
                              invoice.totalAmount || 0
                            ).toFixed(2)}`}
                            secondaryTypographyProps={{
                              variant: "body2",
                              color:
                                invoice.status === "overdue"
                                  ? "error.main"
                                  : "text.secondary",
                            }}
                          />
                          <Box
                            sx={{
                              backgroundColor:
                                invoice.status === "paid"
                                  ? theme.palette.success.light
                                  : invoice.status === "overdue"
                                  ? theme.palette.error.light
                                  : theme.palette.warning.light,
                              color:
                                invoice.status === "paid"
                                  ? theme.palette.success.dark
                                  : invoice.status === "overdue"
                                  ? theme.palette.error.dark
                                  : theme.palette.warning.dark,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              ml: isMobile ? 2 : 4,
                            }}
                          >
                            {invoice.status?.toUpperCase() || "UNKNOWN"}
                          </Box>
                        </ListItem>
                        {index < todaysPayments.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <EventIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="body1">
                      No payments due today
                    </Typography>
                  </Box>
                )
              ) : overduePayments.length > 0 ? (
                <List
                  sx={{
                    flex: 1,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: theme.palette.grey[100],
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: theme.palette.grey[400],
                      borderRadius: "3px",
                    },
                  }}
                >
                  {overduePayments.map((invoice, index) => (
                    <React.Fragment key={invoice._id}>
                      <ListItem
                        sx={{
                          px: 2,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {invoice.customer?.companyName ||
                                "Unknown Client"}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Box component="span" display="block">
                                Due: ₹{(invoice.totalAmount || 0).toFixed(2)}
                              </Box>
                              <Box component="span" display="block">
                                Due Date:{" "}
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </Box>
                            </>
                          }
                          secondaryTypographyProps={{
                            variant: "body2",
                            color: "error.main",
                          }}
                        />
                        <Box
                          sx={{
                            backgroundColor: theme.palette.error.light,
                            color: theme.palette.error.dark,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            ml: isMobile ? 2 : 4,
                          }}
                        >
                          OVERDUE
                        </Box>
                      </ListItem>
                      {index < overduePayments.length - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <WarningIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">No overdue payments</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Invoices Chart Section - 60% width */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: isMobile ? 2 : 6,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              width: isMobile ? "40vh" : "auto",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              flexDirection={isMobile ? "column" : "row"}
              gap={isMobile ? 2 : 30}
            >
              <Box display="flex" alignItems="center">
                <ReceiptIcon color="primary" sx={{ mr: 1.5, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Monthly Invoices (
                  {getMonthlyInvoiceData().reduce(
                    (sum, month) => sum + month.invoices,
                    0
                  )}
                  )
                </Typography>
              </Box>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                size="small"
                sx={{
                  minWidth: 120,
                  backgroundColor: theme.palette.background.paper,
                  "& .MuiSelect-select": {
                    py: 1.25,
                  },
                  ml: isMobile ? 0 : 4,
                }}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ flex: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getMonthlyInvoiceData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                      border: "none",
                    }}
                    formatter={(value) => [`${value} invoices`, "Count"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="invoices"
                    name="Invoices"
                    fill={theme.palette.primary.main}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
