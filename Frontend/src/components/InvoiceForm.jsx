import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Save, Cancel, Remove } from "@mui/icons-material";

function InvoiceForm({ activeSection, data, onUpdate, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => {
    const sectionData = data[activeSection] || {};
    return Array.isArray(sectionData) ? [...sectionData] : { ...sectionData };
  });

  useEffect(() => {
    if (activeSection) {
      const sectionData = data[activeSection];
      setFormData(
        Array.isArray(sectionData) ? [...sectionData] : { ...sectionData }
      );
    }
  }, [activeSection, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    onUpdate(activeSection, newFormData);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newItems = [...prev];
      const updatedItem = {
        ...newItems[index],
        [name]:
          name === "quantity" || name === "unitPrice" ? Number(value) : value,
      };

      if (name === "quantity" || name === "unitPrice") {
        updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
      }

      newItems[index] = updatedItem;
      onUpdate(activeSection, newItems);
      return newItems;
    });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    const newItems = [...formData, newItem];
    setFormData(newItems);
    onUpdate(activeSection, newItems);
  };

  const removeItem = (id) => {
    if (formData.length <= 1) {
      alert("At least one item is required in the invoice");
      return;
    }
    const newItems = formData.filter((item) => item.id !== id);
    setFormData(newItems);
    onUpdate(activeSection, newItems);
  };

  const handleDateChange = (name, value) => {
    if (!value) {
      const newFormData = { ...formData, [name]: "" };
      setFormData(newFormData);
      onUpdate(activeSection, newFormData);
      return;
    }

    const date = new Date(value);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newFormData = { ...formData, [name]: formattedDate };
    setFormData(newFormData);
    onUpdate(activeSection, newFormData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
        Edit {activeSection.replace(/([A-Z])/g, " $1").trim()}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {activeSection === "billedTo" && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="GSTIN"
              name="gstin"
              value={formData.gstin || ""}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contact"
              value={formData.contact || ""}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Domain"
              name="domain"
              value={formData.domain || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>
      )}

      {activeSection === "items" && Array.isArray(formData) && (
        <Box>
          {formData.map((item, index) => (
            <Paper
              key={item.id}
              elevation={2}
              sx={{ p: 2, mb: 2, position: "relative" }}
            >
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => removeItem(item.id)}
                color="error"
              >
                <Remove />
              </IconButton>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                required
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    inputProps={{ min: 1 }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Unit Price (₹)"
                    name="unitPrice"
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    inputProps={{ step: "0.01", min: "0" }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    fullWidth
                    label="Amount (₹)"
                    name="amount"
                    value={item.amount.toFixed(2)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button variant="outlined" onClick={addItem} sx={{ mt: 1 }}>
            Add Item
          </Button>
        </Box>
      )}

      {activeSection === "invoiceDetails" && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Invoice Number"
              name="number"
              value={formData.number || ""}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Invoice Date"
              name="date"
              type="date"
              value={
                formData.date
                  ? new Date(formData.date).toISOString().substr(0, 10)
                  : ""
              }
              onChange={(e) => handleDateChange("date", e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={
                formData.dueDate
                  ? new Date(formData.dueDate).toISOString().substr(0, 10)
                  : ""
              }
              onChange={(e) => handleDateChange("dueDate", e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: formData.date
                  ? new Date(formData.date).toISOString().substr(0, 10)
                  : new Date().toISOString().substr(0, 10),
              }}
            />
          </Grid>
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button variant="outlined" startIcon={<Cancel />} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={onSave}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}

export default InvoiceForm;
