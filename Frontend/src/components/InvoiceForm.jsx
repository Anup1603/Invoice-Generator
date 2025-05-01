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
  Collapse,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Save, Cancel, Remove, Add } from "@mui/icons-material";

function InvoiceForm({
  activeSection,
  data,
  onSave,
  onCancel,
  availableItems,
}) {
  const [formData, setFormData] = useState(data[activeSection]);
  const [addingItem, setAddingItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [newItem, setNewItem] = useState({
    id: Date.now(),
    _id: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    discountPercentage: 0,
    amount: 0,
  });

  useEffect(() => {
    setFormData(data[activeSection]);
  }, [activeSection, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData];
    const updatedItem = {
      ...updatedItems[index],
      [name]:
        name === "quantity" ||
        name === "unitPrice" ||
        name === "discountPercentage"
          ? Number(value)
          : value,
    };

    if (
      name === "quantity" ||
      name === "unitPrice" ||
      name === "discountPercentage"
    ) {
      const itemAmount = updatedItem.quantity * updatedItem.unitPrice;
      updatedItem.amount =
        itemAmount - (itemAmount * (updatedItem.discountPercentage || 0)) / 100;
    }

    updatedItems[index] = updatedItem;
    setFormData(updatedItems);
  };

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    const selected = availableItems.find((item) => item._id === itemId);
    if (selected) {
      setSelectedItem(itemId);
      setNewItem({
        id: Date.now(),
        _id: selected._id,
        description: selected.description,
        quantity: 1,
        unitPrice: selected.unitPrice,
        discountPercentage: 0,
        amount: selected.unitPrice,
      });
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = {
      ...newItem,
      [name]:
        name === "quantity" ||
        name === "unitPrice" ||
        name === "discountPercentage"
          ? Number(value)
          : value,
    };

    if (
      name === "quantity" ||
      name === "unitPrice" ||
      name === "discountPercentage"
    ) {
      const itemAmount = updatedItem.quantity * updatedItem.unitPrice;
      updatedItem.amount =
        itemAmount - (itemAmount * (updatedItem.discountPercentage || 0)) / 100;
    }

    setNewItem(updatedItem);
  };

  const startAddingItem = () => {
    setSelectedItem("");
    setNewItem({
      id: Date.now(),
      _id: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discountPercentage: 0,
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

  const getAddressValue = (field) => {
    return formData.address?.[field] || "";
  };

  return (
    <Paper elevation={3} sx={{ p: 3, minHeight: "100%" }}>
      <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
        Edit {activeSection.replace(/([A-Z])/g, " $1").trim()}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {activeSection === "billedTo" && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
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

          {/* Address Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Street Address"
              name="street"
              value={getAddressValue("street")}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={getAddressValue("city")}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={getAddressValue("state")}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={getAddressValue("postalCode")}
              onChange={(e) =>
                handleAddressChange("postalCode", e.target.value)
              }
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={getAddressValue("country")}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GSTIN"
              name="gstNumber"
              value={getCurrentValue("gstNumber")}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={getCurrentValue("contactPerson")}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phoneNumber"
              value={getCurrentValue("phoneNumber")}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Domain"
              name="domainName"
              value={getCurrentValue("domainName")}
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Item {index + 1}
              </Typography>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={getCurrentValue("description", index)}
                onChange={(e) => handleItemChange(index, e)}
                required
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    name="discountPercentage"
                    type="number"
                    value={getCurrentValue("discountPercentage", index)}
                    onChange={(e) => handleItemChange(index, e)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ step: "0.01", min: "0", max: "100" }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
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

          <Collapse in={addingItem}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Item</InputLabel>
                <Select
                  value={selectedItem}
                  onChange={handleItemSelect}
                  label="Select Item"
                >
                  <MenuItem value="">
                    <em>Select an item</em>
                  </MenuItem>
                  {availableItems.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name} (₹{item.unitPrice})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedItem && (
                <>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newItem.description}
                    onChange={handleNewItemChange}
                    required
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Discount (%)"
                        name="discountPercentage"
                        type="number"
                        value={newItem.discountPercentage}
                        onChange={handleNewItemChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        inputProps={{ step: "0.01", min: "0", max: "100" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
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
                </>
              )}

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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Invoice Type</InputLabel>
              <Select
                label="Invoice Type"
                name="type"
                value={getCurrentValue("type") || "GW"}
                onChange={handleChange}
                required
              >
                <MenuItem value="SW">SW</MenuItem>
                <MenuItem value="GC">GC</MenuItem>
                <MenuItem value="GW">GW</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Invoice Date"
              name="date"
              type="date"
              value={getCurrentValue("date") || ""}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "date",
                    value: e.target.value,
                  },
                })
              }
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={getCurrentValue("dueDate") || ""}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "dueDate",
                    value: e.target.value,
                  },
                })
              }
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min:
                  getCurrentValue("date") ||
                  new Date().toISOString().split("T")[0],
              }}
            />
          </Grid>
        </Grid>
      )}

      {activeSection === "totals" && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Subtotal"
              name="subtotal"
              value={(formData.subtotal || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Discounts"
              name="itemDiscounts"
              value={(formData.itemDiscounts || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount After Item Discounts"
              name="amountAfterItemDiscounts"
              value={(formData.amountAfterItemDiscounts || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Additional Discount (%)"
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage || 0}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ step: "0.01", min: "0", max: "100" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount Amount"
              name="discountAmount"
              value={(formData.discountAmount || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount After All Discounts"
              name="amountAfterAllDiscounts"
              value={(formData.amountAfterAllDiscounts || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Rate (%)"
              name="gstRate"
              type="number"
              value={formData.gstRate || 18}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Amount"
              name="gstAmount"
              value={(formData.gstAmount || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Amount"
              name="totalAmount"
              value={(formData.totalAmount || 0).toFixed(2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                readOnly: true,
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
