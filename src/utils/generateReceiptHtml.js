// src/utils/generateReceiptHtml.js
import { initialPrintSettings } from '../data/initialPrintSettings';

export const generateReceiptHtml = (orderData, allPrintSettings, bankSettings, banks, type) => {
    // Determine which set of settings to use based on the type
    const printSettings = allPrintSettings || initialPrintSettings;
    const isProvisional = type === 'provisional';
    const currentSettings = isProvisional ? printSettings : printSettings; // Use same top-level settings, specific ones are inside

    const { items, total, table, cashier } = orderData;
    const tableName = table || 'Không xác định';
    const currentCashier = cashier || 'N/A';

    const getStyleString = (styleObj = {}) => `font-size: ${styleObj.fontSize || 9}pt; font-weight: ${styleObj.fontWeight || 'normal'}; font-style: ${styleObj.fontStyle || 'normal'};`;
    const currentDateFormatted = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    let qrCodeHtml = '';
    // Only generate QR code if it's a provisional receipt and settings allow
    if (isProvisional && currentSettings.showQrCode && bankSettings?.bin && bankSettings?.accountNumber && banks?.length > 0) {
        const description = `TT don hang ban ${tableName}`;
        const selectedBank = banks.find(b => b.bin === bankSettings.bin);
        const bankCode = selectedBank ? selectedBank.code : bankSettings.bin;

        const qrCodeUrl = `https://img.vietqr.io/image/${bankCode}-${bankSettings.accountNumber}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankSettings.accountName || '')}`;
        
        qrCodeHtml = `<div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                        <img src="${qrCodeUrl}" alt="Mã QR Thanh Toán" style="width: 50mm; height: 50mm;"/>
                        <p style="${getStyleString(currentSettings.footerStyle)}; margin-top: 5px; font-weight: bold;">Quét mã QR để thanh toán</p>
                      </div>`;
    } else if (isProvisional && currentSettings.showQrCode) {
        const missingInfo = [];
        if (!bankSettings?.bin || !bankSettings?.accountNumber) {
            missingInfo.push("Số tài khoản");
        }
        if (!bankSettings?.accountName) {
            missingInfo.push("Tên chủ tài khoản");
        }
        if (!banks || banks.length === 0) {
            missingInfo.push("Danh sách ngân hàng");
        }

        qrCodeHtml = `<div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                            <img src="https://via.placeholder.com/100x100?text=QR+Code+Loi" alt="QR Code Error" style="width: 50mm; height: 50mm; border: 1px dashed red;"/>
                            <p style="font-size: 8pt; color: red; margin-top: 5px;">QR lỗi: ${missingInfo.join(", ")}</p>
                            <p style="font-size: 8pt; color: red;">Vui lòng cài đặt tại Admin > Cài đặt > Cài đặt Ngân hàng</p>
                          </div>`;
    }

    // Header section content based on receipt type
    let headerSectionHtml = '';
    if (isProvisional && currentSettings.showStoreName) {
        headerSectionHtml = `
            <div class="print-header">
                <h1>${currentSettings.restaurantName}</h1>
                <p>${currentSettings.address}</p>
                <p>ĐT: ${currentSettings.phone}</p>
            </div>
        `;
    } else if (!isProvisional && currentSettings.showKitchenStoreName) {
        headerSectionHtml = `
            <div class="print-header">
                <h1>${currentSettings.kitchenRestaurantName}</h1>
                <p>${currentSettings.kitchenAddress}</p>
                <p>ĐT: ${currentSettings.kitchenPhone}</p>
            </div>
        `;
    }

    // Order info line styles
    const orderInfoStyle = isProvisional ? getStyleString(currentSettings.orderInfoStyle) : getStyleString(currentSettings.kitchenOrderInfoStyle);

    // Items header and body styles
    const itemsHeaderStyle = isProvisional ? getStyleString(currentSettings.itemsHeaderStyle) : getStyleString(currentSettings.kitchenItemsHeaderStyle);
    const itemsBodyStyle = isProvisional ? getStyleString(currentSettings.itemsBodyStyle) : getStyleString(currentSettings.kitchenItemsBodyStyle);


    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${isProvisional ? 'Phiếu tạm tính' : 'Phiếu bếp'}</title>
            <style>
                body { margin: 0; padding: 0; }
                .print-content {
                    font-family: '${currentSettings.fontFamily}', monospace;
                    line-height: ${currentSettings.lineSpacing}mm;
                    color: #000;
                    width: 57mm; /* Khổ giấy K57 */
                    margin: 0 auto; /* Căn giữa */
                    padding: 3mm;
                    box-sizing: border-box;
                    background: white; /* Đảm bảo nền trắng */
                }
                .print-header { text-align: center; margin-bottom: 5px; }
                .print-header h1 { margin: 0; ${isProvisional ? getStyleString(currentSettings.headerStyle) : getStyleString(currentSettings.kitchenHeaderStyle)} }
                .print-header p { margin: 1px 0; ${isProvisional ? getStyleString(currentSettings.subHeaderStyle) : getStyleString(currentSettings.kitchenHeaderStyle)} }
                .print-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
                .print-table th, .print-table td { text-align: left; padding: 2px 0; vertical-align: top; word-break: break-word; }
                .col-sl { text-align: center; width: 30px; }
                .col-thanh-tien { text-align: right; }
                .line { border-top: 1px dashed #000; margin: 5px 0; }
                .total-section { text-align: right; ${getStyleString(currentSettings.totalStyle)} margin-top: 5px; }
                .footer { text-align: center; margin-top: 10px; ${getStyleString(currentSettings.footerStyle)} }
                
                /* Print specific styles */
                @media print {
                    body {
                        background: none !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .print-content {
                        box-shadow: none !important;
                        border: none !important;
                        font-size: ${isProvisional ? currentSettings.itemsBodyStyle.fontSize : currentSettings.kitchenItemsBodyStyle.fontSize}pt;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-content">
                ${headerSectionHtml}
                ${currentSettings.useSeparatorLine?'<div class="line"></div>':''}
                <div style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: ${isProvisional ? currentSettings.headerStyle.fontSize : currentSettings.kitchenHeaderStyle.fontSize}pt;">
                    ${isProvisional ? 'PHIẾU TẠM TÍNH' : currentSettings.kitchenOrderHeader}
                </div>
                <div style="${orderInfoStyle}">
                    <p>Bàn: ${tableName} | ${currentSettings.showDateTime?`Ngày: ${currentDateFormatted}`:''}</p>
                    ${isProvisional && currentSettings.showCashier ? `<p>Thu ngân: ${currentCashier}</p>` : ''}
                    ${!isProvisional && currentSettings.showKitchenCashier ? `<p>Thu ngân: ${currentCashier}</p>` : ''}
                </div>
                ${currentSettings.useSeparatorLine?'<div class="line"></div>':''}
                <table class="print-table">
                    <thead style="${itemsHeaderStyle}">
                        <tr>
                            <th>Tên món</th>
                            <th class="col-sl">SL</th>
                            ${isProvisional ? '<th class="col-thanh-tien">T.Tiền</th>' : ''}
                        </tr>
                    </thead>
                    <tbody style="${itemsBodyStyle}">
                        ${items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td class="col-sl">${item.quantity}</td>
                            ${isProvisional ? `<td class="col-thanh-tien">${(item.price * item.quantity).toLocaleString('vi-VN')}</td>` : ''}
                        </tr>`).join('')}
                    </tbody>
                </table>
                ${currentSettings.useSeparatorLine?'<div class="line"></div>':''}
                ${isProvisional ? `
                <div class="total-section">
                    ${currentSettings.totalLabel} ${total.toLocaleString('vi-VN')}đ
                </div>` : ''}
                ${isProvisional && currentSettings.showWifi && currentSettings.wifiPassword?`
                <div style="text-align: center; margin-top: 10px; ${getStyleString(currentSettings.wifiStyle)}">Pass Wi-Fi: ${currentSettings.wifiPassword}</div>`:''}
                <div class="footer">
                    ${isProvisional ? currentSettings.thankYouMessage : currentSettings.kitchenFooterMessage}
                </div>
                ${qrCodeHtml}
            </div>
        </body>
        </html>
    `;
};