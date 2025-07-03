// src/components/order/PrintReceipt.js

import React from 'react';

const PrintReceipt = React.forwardRef(({ receiptData }, ref) => {
  // Component này sẽ không hiển thị gì trong giao diện chính
  // Nó chỉ dùng để cung cấp nội dung cho chức năng in
  if (!receiptData || !receiptData.html) { // Kiểm tra nếu không có dữ liệu hoặc không có HTML
    return null;
  }

  // Sử dụng dangerouslySetInnerHTML để render chuỗi HTML đã được tạo sẵn
  // Các style `@media print` đã được nhúng trực tiếp vào chuỗi HTML từ usePrinting.js
  return (
    <div ref={ref} className="print-container">
      {/* dangerouslySetInnerHTML được sử dụng để chèn chuỗi HTML đã được tạo sẵn từ usePrinting.js */}
      <div dangerouslySetInnerHTML={{ __html: receiptData.html }} />
    </div>
  );
});

export default PrintReceipt;