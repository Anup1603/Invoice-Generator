import React from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfileCompletePage from "./pages/ProfileCompletePage";
import InvoiceMain from "./screens/Invoicemain";
import Profile from "./screens/Profile";
import InvoiceBoard from "./screens/InvoiceBoard";
import InvoiceList from "./screens/InvoiceList";
import CreateProduct from "./screens/CreateProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:authMode" element={<AuthPage />} />

        {/* Profile Complete Route */}
        <Route path="/profile-complete" element={<ProfileCompletePage />} />

        {/* Invoice Route */}
        <Route path="/invoice-board" element={<InvoiceBoard />}>
          <Route path="create-invoice" element={<InvoiceMain />} />
          <Route path="profile" element={<Profile />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
