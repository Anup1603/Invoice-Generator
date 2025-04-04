import React, { useRef, useEffect, useState } from "react";
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
  Collapse,
} from "@mui/material";
import { Save, Cancel, Remove, Add } from "@mui/icons-material";

function InvoiceForm({ activeSection, data, onSave, onCancel }) {
  const [formData, setFormData] = useState(data[activeSection]);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    id: Date.now(),
    description: "",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  });

  useEffect(() => {
    setFormData(data[activeSection]);
  }, [activeSection, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData];
    const updatedItem = {
      ...updatedItems[index],
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    };

    if (name === "quantity" || name === "unitPrice") {
      updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
    }

    updatedItems[index] = updatedItem;
    setFormData(updatedItems);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = {
      ...newItem,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    };

    if (name === "quantity" || name === "unitPrice") {
      updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
    }

    setNewItem(updatedItem);
  };

  const startAddingItem = () => {
    setNewItem({
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
    setAddingItem(true);
  };

  const cancelAddingItem = () => {
    setAddingItem(false);
  };

  const confirmAddItem = () => {
    if (!newItem.description) {
      alert("Please enter a description for the item");
      return;
    }

    const updatedItems = [...formData, newItem];
    setFormData(updatedItems);
    setAddingItem(false);
  };

  const removeItem = (id) => {
    if (formData.length <= 1) {
      alert("At least one item is required in the invoice");
      return;
    }
    const updatedItems = formData.filter((item) => item.id !== id);
    setFormData(updatedItems);
  };

  const handleDateChange = (name, value) => {
    if (!value) {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const date = new Date(value);
    setFormData((prev) => ({
      ...prev,
      [name]: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));
  };

  const handleSaveClick = () => {
    const updatedData = {
      ...data,
      [activeSection]: formData,
    };
    onSave(updatedData);
  };

  const getCurrentValue = (name, index) => {
    if (index !== undefined) {
      return formData[index]?.[name] || "";
    }
    return formData[name] || "";
  };

  return (
    <Paper elevation={3} sx={{ p: 3, minHeight: "100%" }}>
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
              value={getCurrentValue("companyName")}
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
              value={getCurrentValue("address")}
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
              value={getCurrentValue("gstin")}
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
              value={getCurrentValue("contact")}
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
              value={getCurrentValue("phone")}
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
              value={getCurrentValue("domain")}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>
      )}

      {activeSection === "items" && Array.isArray(formData) && (
        <Box>
          {/* Existing items */}
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
                value={getCurrentValue("description", index)}
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
                    value={getCurrentValue("quantity", index)}
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
                    value={getCurrentValue("unitPrice", index)}
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
                    value={(getCurrentValue("amount", index) || 0).toFixed(2)}
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

          {/* Add New Item Form */}
          <Collapse in={addingItem}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newItem.description}
                onChange={handleNewItemChange}
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
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
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
                    value={newItem.unitPrice}
                    onChange={handleNewItemChange}
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
                    value={newItem.amount.toFixed(2)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={cancelAddingItem}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={confirmAddItem}
                  size="small"
                  disabled={!newItem.description}
                >
                  Add Item
                </Button>
              </Box>
            </Paper>
          </Collapse>

          {/* Add Item Button */}
          {!addingItem && (
            <Button
              variant="outlined"
              onClick={startAddingItem}
              sx={{ mt: 1 }}
              startIcon={<Add />}
            >
              Add Item
            </Button>
          )}
        </Box>
      )}

      {activeSection === "invoiceDetails" && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Invoice Number"
              name="number"
              value={getCurrentValue("number")}
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
                getCurrentValue("date")
                  ? new Date(getCurrentValue("date"))
                      .toISOString()
                      .substr(0, 10)
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
                getCurrentValue("dueDate")
                  ? new Date(getCurrentValue("dueDate"))
                      .toISOString()
                      .substr(0, 10)
                  : ""
              }
              onChange={(e) => handleDateChange("dueDate", e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: getCurrentValue("date")
                  ? new Date(getCurrentValue("date"))
                      .toISOString()
                      .substr(0, 10)
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
          onClick={handleSaveClick}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}

export default InvoiceForm;
