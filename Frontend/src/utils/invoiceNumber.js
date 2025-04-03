export function generateInvoiceNumber() {
    const prefix = "ANO/GW";
    const year = new Date().getFullYear();
    const nextYear = year + 1;
    const fiscalYear = `${year}-${nextYear.toString().slice(2)}`;
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `${prefix}/${fiscalYear}/${randomNum}`;
}