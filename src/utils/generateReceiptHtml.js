// src/utils/generateReceiptHtml.js
import { initialPrintSettings } from '../data/initialPrintSettings';

export const generateReceiptHtml = (orderData, printSettings, bankSettings, banks, type) => {
    // Đảm bảo orderData và printSettings hợp lệ
    const currentPrintSettings = printSettings || initialPrintSettings;
    const { items, total, table, cashier } = orderData; // orderData sẽ có các thông tin này
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
    // Chỉ tạo QR code nếu là hóa đơn tạm tính (provisional) và showQrCode được bật
    // Đồng thời phải có bankSettings hợp lệ và danh sách banks đã tải
    if (currentPrintSettings.showQrCode && type === 'provisional' && bankSettings?.bin && bankSettings?.accountNumber && banks?.length > 0) {
        const description = `TT don hang ban ${tableName}`;
        const selectedBank = banks.find(b => b.bin === bankSettings.bin);
        const bankCode = selectedBank ? selectedBank.code : bankSettings.bin;

        const qrCodeUrl = `https://img.vietqr.io/image/${bankCode}-${bankSettings.accountNumber}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankSettings.accountName || '')}`;
        
        qrCodeHtml = `<div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                        <img src="${qrCodeUrl}" alt="Mã QR Thanh Toán" style="width: 50mm; height: 50mm;"/>
                        <p style="${getStyleString(currentPrintSettings.footerStyle)}; margin-top: 5px; font-weight: bold;">Quét mã QR để thanh toán</p>
                      </div>`;
    } else if (currentPrintSettings.showQrCode && type === 'provisional') {
        // Nếu showQrCode bật nhưng thiếu thông tin ngân hàng cho preview hoặc print
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

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${type === 'provisional' ? 'Phiếu tạm tính' : 'Phiếu bếp'}</title>
            <style>
                body { margin: 0; padding: 0; }
                .print-content {
                    font-family: '${currentPrintSettings.fontFamily}', monospace;
                    line-height: ${currentPrintSettings.lineSpacing}mm;
                    color: #000;
                    width: 57mm; /* Khổ giấy K57 */
                    margin: 0 auto; /* Căn giữa */
                    padding: 3mm;
                    box-sizing: border-box;
                    background: white; /* Đảm bảo nền trắng */
                }
                .print-header { text-align: center; margin-bottom: 5px; }
                .print-header h1 { margin: 0; ${getStyleString(currentPrintSettings.headerStyle)} }
                .print-header p { margin: 1px 0; ${getStyleString(currentPrintSettings.subHeaderStyle)} }
                .print-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
                .print-table th, .print-table td { text-align: left; padding: 2px 0; vertical-align: top; word-break: break-word; }
                .col-sl { text-align: center; width: 30px; }
                .col-thanh-tien { text-align: right; }
                .line { border-top: 1px dashed #000; margin: 5px 0; }
                .total-section { text-align: right; ${getStyleString(currentPrintSettings.totalStyle)} margin-top: 5px; }
                .footer { text-align: center; margin-top: 10px; ${getStyleString(currentPrintSettings.footerStyle)} }
                
                /* Print specific styles */
                @media print {
                    body {
                        background: none !important;
                        -webkit-print-color-adjust: exact !important; /* Đảm bảo màu nền được in */
                        color-adjust: exact !important;
                    }
                    .print-content {
                        box-shadow: none !important;
                        border: none !important;
                        font-size: ${currentPrintSettings.itemsBodyStyle.fontSize || 9}pt;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-content">
                ${currentPrintSettings.showStoreName?`
                <div class="print-header">
                    <h1>${currentPrintSettings.restaurantName}</h1>
                    <p>${currentPrintSettings.address}</p>
                    <p>ĐT: ${currentPrintSettings.phone}</p>
                </div>`:''}
                ${currentPrintSettings.useSeparatorLine?'<div class="line"></div>':''}
                <div style="${getStyleString(currentPrintSettings.orderInfoStyle)}">
                    <p>Bàn: ${tableName} | ${currentPrintSettings.showDateTime?`Ngày: ${currentDateFormatted}`:''}</p>
                    ${currentPrintSettings.showCashier?`<p>Thu ngân: ${currentCashier}</p>`:''}
                </div>
                ${currentPrintSettings.useSeparatorLine?'<div class="line"></div>':''}
                <table class="print-table">
                    <thead style="${getStyleString(currentPrintSettings.itemsHeaderStyle)}">
                        <tr>
                            <th>Tên món</th>
                            <th class="col-sl">SL</th>
                            ${type === 'provisional' ? '<th class="col-thanh-tien">T.Tiền</th>' : ''}
                        </tr>
                    </thead>
                    <tbody style="${getStyleString(currentPrintSettings.itemsBodyStyle)}">
                        ${items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td class="col-sl">${item.quantity}</td>
                            ${type === 'provisional' ? `<td class="col-thanh-tien">${(item.price * item.quantity).toLocaleString('vi-VN')}</td>` : ''}
                        </tr>`).join('')}
                    </tbody>
                </table>
                ${currentPrintSettings.useSeparatorLine?'<div class="line"></div>':''}
                ${type === 'provisional' ? `
                <div class="total-section">
                    ${currentPrintSettings.totalLabel} ${total.toLocaleString('vi-VN')}đ
                </div>` : ''}
                ${currentPrintSettings.showWifi && currentPrintSettings.wifiPassword?`
                <div style="text-align: center; margin-top: 10px; ${getStyleString(currentPrintSettings.wifiStyle)}">Pass Wi-Fi: ${currentPrintSettings.wifiPassword}</div>`:''}
                <div class="footer">
                    ${type === 'provisional' ? currentPrintSettings.thankYouMessage : '--- YÊU CẦU BẾP CHUẨN BỊ ---'}
                </div>
                ${qrCodeHtml}
            </div>
        </body>
        </html>
    `;
};