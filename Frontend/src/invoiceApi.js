import axios from "./axiosInstence"

// Fetch all invoice data
export const fetchInvoiceData = async (invoiceId = null) => {
    try {
        const endpoint = invoiceId
            ? `/api/invoices/${invoiceId}`
            : `/api/invoices`;
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching invoice data:', error);
        throw error;
    }
};

// Fetch company details
export const fetchCompanyDetails = async () => {
    try {
        const response = await axios.get(`/api/company/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching company details:', error);
        throw error;
    }
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
    try {
        const response = await axios.post(`/api/invoices/`, invoiceData);
        return response.data;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }
};

// Add/update invoice item
export const saveInvoiceItem = async (itemData) => {
    try {
        const endpoint = itemData.id
            ? `/api/items/${itemData.id}`
            : `/api/items/`;
        const method = itemData.id ? 'put' : 'post';
        const response = await axios[method](endpoint, itemData);
        return response.data;
    } catch (error) {
        console.error('Error saving invoice item:', error);
        throw error;
    }
};

// Delete invoice item
export const deleteInvoiceItem = async (itemId) => {
    try {
        await axios.delete(`/api/items/${itemId}`);
        return true;
    } catch (error) {
        console.error('Error deleting invoice item:', error);
        throw error;
    }
};

// Generate PDF
export const generateInvoicePdf = async (invoiceId) => {
    try {
        const response = await axios.get(`/api/invoices/`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};