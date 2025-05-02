import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ProfileCompletePage from "./pages/ProfileCompletePage";
import InvoiceMain from "./screens/InvoiceMain";
import Profile from "./screens/Profile";
import InvoiceBoard from "./screens/InvoiceBoard";
import InvoiceList from "./screens/InvoiceList";
import CreateProduct from "./screens/CreateProduct";
import { fetchCompanyDetails } from "./invoiceApi";
import { CircularProgress, Box } from "@mui/material";
import Overview from "./screens/Overview";

function App() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        if (token) {
          const response = await fetchCompanyDetails();
          setCompanyData({
            ...response.data,
            logo: response.data?.logo || "",
            name: response.data?.companyName || "Invoice System",
          });
        }
      } catch (error) {
        console.error("Failed to fetch company data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:authMode" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route path="/profile-complete" element={<ProfileCompletePage />} />

        <Route
          path="/invoice-board"
          element={<InvoiceBoard companyData={companyData} />}
        >
          <Route path="create-invoice" element={<InvoiceMain />} />
          <Route
            path="profile"
            element={<Profile companyData={companyData} />}
          />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="overview" element={<Overview />} />
        </Route>

        {/* Redirect invalid routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Auth wrapper component
// function RequireAuth({ children }) {
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!token) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   if (user && !user.profileComplete) {
//     return (
//       <Navigate to="/profile-complete" state={{ from: location }} replace />
//     );
//   }

//   return children;
// }

export default App;
