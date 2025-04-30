const calculateInvoice = (items = [], overAllDiscount = 0, gstRate = 18) => {
    // Calculate item-level discounts and subtotal
    let subtotal = 0;
    let totalItemDiscounts = 0;

    const itemsWithDiscounts = items.map(item => {
        const itemTotal = item.priceAtTime * item.quantity;
        const itemDiscountAmount = (itemTotal * (item.itemDiscount || 0)) / 100;
        const itemTotalAfterDiscount = itemTotal - itemDiscountAmount;

        subtotal += itemTotal;
        totalItemDiscounts += itemDiscountAmount;

        return {
            ...item,
            itemTotal,
            itemDiscountAmount,
            itemTotalAfterDiscount
        };
    });

    const amountAfterItemDiscounts = subtotal - totalItemDiscounts;

    // Calculate invoice-level discount
    const invoiceDiscountAmount = (amountAfterItemDiscounts * overAllDiscount) / 100;
    const amountAfterAllDiscounts = amountAfterItemDiscounts - invoiceDiscountAmount;

    // Calculate GST and total
    const gstAmount = (amountAfterAllDiscounts * gstRate) / 100;
    const totalAmount = amountAfterAllDiscounts + gstAmount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        totalItemDiscounts: Number(totalItemDiscounts.toFixed(2)),
        amountAfterItemDiscounts: Number(amountAfterItemDiscounts.toFixed(2)),
        invoiceDiscountAmount: Number(invoiceDiscountAmount.toFixed(2)),
        totalDiscount: Number((totalItemDiscounts + invoiceDiscountAmount).toFixed(2)),
        amountAfterAllDiscounts: Number(amountAfterAllDiscounts.toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        items: itemsWithDiscounts
    };
};

module.exports = calculateInvoice;