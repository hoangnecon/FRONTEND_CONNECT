// src/components/order/QRCodeDialog.js
import React, { useMemo } from 'react';
import { X } from 'lucide-react';

const QRCodeDialog = ({
  bankSettings,
  amount,
  description,
  onClose,
  banks, // Nhận danh sách ngân hàng
}) => {
  const qrCodeUrl = useMemo(() => {
    if (!bankSettings.bin || !bankSettings.accountNumber) return null;
    const { bin, accountNumber, accountName } = bankSettings;
    const template = 'compact2'; // Mẫu compact của VietQR
    const url = `https://img.vietqr.io/image/${bin}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName || '')}`;
    return url;
  }, [bankSettings, amount, description]);

  const bankName = useMemo(() => {
    const bank = banks.find(b => b.bin === bankSettings.bin);
    return bank ? bank.shortName : bankSettings.bin; // Hiển thị shortName, nếu không có thì hiển thị BIN
  }, [banks, bankSettings.bin]);


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-sm shadow-2xl text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-primary-paragraph hover:text-primary-headline">
            <X size={24} />
          </button>
        </div>
        <h3 className="text-xl font-bold text-primary-headline mb-4">
          Quét mã để thanh toán
        </h3>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="VietQR Code" className="w-full h-auto rounded-lg mx-auto" />
        ) : (
          <p className="text-red-500">Vui lòng cấu hình thông tin ngân hàng trong trang cài đặt của Admin.</p>
        )}
        <div className="mt-4 text-left bg-primary-secondary p-4 rounded-lg">
            <p><span className="font-semibold">Số tiền:</span> {amount.toLocaleString('vi-VN')}đ</p>
            <p><span className="font-semibold">Ngân hàng:</span> {bankName}</p>
            <p><span className="font-semibold">Số tài khoản:</span> {bankSettings.accountNumber}</p>
            <p><span className="font-semibold">Chủ tài khoản:</span> {bankSettings.accountName}</p>
            <p><span className="font-semibold">Nội dung:</span> {description}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDialog;