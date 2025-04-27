import axios from "./axiosInstence"


// TODO: company details part
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


// TODO: Invoice parts
// Fetch all invoice data
export const fetchInvoiceData = async (invoiceId = null) => {
    try {
        const endpoint = invoiceId ? `/api/invoices/${invoiceId}` : `/api/invoices/`;
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching invoice data:', error);
        throw error;
    }
};

export const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
        const response = await axios.put(`/api/invoices/${invoiceId}/status`, { status: newStatus });
        return response.data;
    } catch (error) {
        console.error('Error updating invoice status:', error);
        throw error;
    }
}

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

export const fetchLastInvoiceNumber = async () => {
    try {
        const response = await axios.get(`/api/invoices/`);
        const invoices = response.data;

        if (invoices.length > 0) {
            const lastInvoice = invoices[invoices.length - 1];
            const invoiceNumber = lastInvoice.invoiceNumber;

            // Extract the last part after the last slash '/'
            const parts = invoiceNumber.split('/');
            const numberPart = parts[parts.length - 1]; // "0007"

            console.log(numberPart)
            return numberPart;
        } else {
            return null; // No invoices found
        }
    } catch (error) {
        console.error('Error fetching last invoice number:', error);
        throw error;
    }
};


// TODO: Invoice item parts
// Add invoice item
export const createInvoiceItem = async (itemData) => {
    try {
        const response = await axios.post(`/api/items`, itemData);
        return response.data;
    } catch (error) {
        console.error('Error saving invoice item:', error);
        throw error;
    }
};

// Get all invoice items
export const fetchInvoiceItems = async () => {
    try {
        const response = await axios.get(`/api/items/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching invoice items:', error);
        throw error;
    }
};


// update invoice item
export const updateInvoiceItem = async (itemId, itemData) => {
    try {
        const response = await axios.put(`/api/items/${itemId}`, itemData);
        return response.data;
    } catch (error) {
        console.error('Error updating invoice item:', error);
        throw error;
    }
}

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


// TODO: User parts
// Generate PDF
export const generateInvoicePdf = async (invoiceId) => {
    try {
        const response = await axios.get(`/api/invoices/ `, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};