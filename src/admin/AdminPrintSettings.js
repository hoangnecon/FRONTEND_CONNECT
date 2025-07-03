// src/admin/AdminPrintSettings.js
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { initialPrintSettings } from '../data/initialPrintSettings';
import { generateReceiptHtml } from '../utils/generateReceiptHtml'; // Import để tạo preview

const StyleControl = ({ title, style, onStyleChange }) => {
    const handleComplexStyleChange = (value) => {
        let fontWeight = 'normal';
        let fontStyle = 'normal';

        if (value === 'bold') {
            fontWeight = 'bold';
        } else if (value === 'italic') {
            fontStyle = 'italic';
        } else if (value === 'bold-italic') {
            fontWeight = 'bold';
            fontStyle = 'italic';
        }
        onStyleChange('fontWeight', fontWeight);
        onStyleChange('fontStyle', fontStyle);
    };

    let currentValue = 'normal';
    if (style?.fontWeight === 'bold' && style?.fontStyle === 'italic') {
        currentValue = 'bold-italic';
    } else if (style?.fontWeight === 'bold') {
        currentValue = 'bold';
    } else if (style?.fontStyle === 'italic') {
        currentValue = 'italic';
    }

    return (
        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
            <p className="col-span-2 font-semibold text-primary-headline">{title}</p>
            <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-1">Cỡ chữ (pt)</label>
                <input
                    type="number"
                    value={style?.fontSize || 0}
                    onChange={(e) => onStyleChange('fontSize', parseFloat(e.target.value))}
                    className="w-full p-2 bg-primary-secondary rounded-lg"
                    min="8"
                    max="24"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-1">Kiểu chữ</label>
                <select
                    value={currentValue}
                    onChange={(e) => handleComplexStyleChange(e.target.value)}
                    className="w-full p-2 bg-primary-secondary rounded-lg"
                >
                    <option value="normal">Bình thường</option>
                    <option value="bold">In đậm</option>
                    <option value="italic">In nghiêng</option>
                    <option value="bold-italic">Đậm & Nghiêng</option>
                </select>
            </div>
        </div>
    );
};

// Cập nhật props để nhận bankSettings, banks, và bankListLoading
const AdminPrintSettings = ({ bankSettings, banks, bankListLoading }) => { 
    const [settings, setSettings] = useState(() => {
        let savedSettings = null;
        try {
            const stored = localStorage.getItem('printSettings');
            if (stored) {
                savedSettings = JSON.parse(stored);
            }
        } catch (e) {
            console.error("Failed to parse printSettings from localStorage", e);
        }
        return { ...initialPrintSettings, ...(savedSettings || {}) };
    });

    const [preview, setPreview] = useState('');

    useEffect(() => {
        localStorage.setItem('printSettings', JSON.stringify(settings));
        console.log("AdminPrintSettings - Settings updated:", settings);
        generatePreviewContent(); // Gọi hàm tạo preview
    }, [settings, bankSettings, banks, bankListLoading]); // Thêm bankListLoading vào dependency array

    const handleSettingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }));
    };
    
    const handleStyleChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            }
        }));
    };

    const handleRestoreDefaults = () => {
        setSettings(initialPrintSettings);
    };
    
    // Hàm tạo nội dung preview đã được đơn giản hóa và gọi generateReceiptHtml
    const generatePreviewContent = () => {
        const sampleOrderData = {
            items: [{ name: 'Phở Bò Đặc Biệt', quantity: 1, price: 89000 }, { name: 'Cà Phê Đen Đá', quantity: 2, price: 25000 }],
            total: 139000,
            table: '1',
            cashier: 'Nguyễn Văn A',
        };
        const html = generateReceiptHtml(sampleOrderData, settings, bankSettings, banks, 'provisional');
        setPreview(html);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 h-full overflow-y-auto pr-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary-headline">Tùy chỉnh Hóa đơn</h2>
                    <button onClick={handleRestoreDefaults} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors">
                        <RotateCcw size={18} /> Khôi phục
                    </button>
                </div>
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Cài đặt chung</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Font chữ chung</label>
                            <select name="fontFamily" value={settings?.fontFamily || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl">
                                <option value="Courier New">Courier New</option>
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Khoảng cách dòng (mm)</label>
                            <input type="number" name="lineSpacing" value={settings?.lineSpacing || 0} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" min="1" max="10" step="0.5"/>
                        </div>
                    </div>
                </div>
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary-headline">Phần đầu hóa đơn (Header)</h3>
                        <div className="flex items-center gap-2">
                            <label htmlFor="showStoreName" className="font-medium text-primary-paragraph">Hiển thị</label>
                            <button onClick={() => setSettings(prev => ({...prev, showStoreName: !prev.showStoreName}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showStoreName ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showStoreName ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                    {settings?.showStoreName && (<div className="mt-4"><div className="space-y-4"><input type="text" name="restaurantName" placeholder="Tên quán" value={settings?.restaurantName || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /><input type="text" name="address" placeholder="Địa chỉ" value={settings?.address || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /><input type="text" name="phone" placeholder="Số điện thoại" value={settings?.phone || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /></div><StyleControl title="Style Tên quán" style={settings?.headerStyle} onStyleChange={(key, value) => handleStyleChange('headerStyle', key, value)} /><StyleControl title="Style Địa chỉ & SĐT" style={settings?.subHeaderStyle} onStyleChange={(key, value) => handleStyleChange('subHeaderStyle', key, value)} /></div>)}
                </div>
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Thông tin đơn hàng</h3>
                    <StyleControl title="Style chung" style={settings?.orderInfoStyle} onStyleChange={(key, value) => handleStyleChange('orderInfoStyle', key, value)} />
                </div>
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Danh sách sản phẩm</h3>
                    <StyleControl title="Style tiêu đề" style={settings?.itemsHeaderStyle} onStyleChange={(key, value) => handleStyleChange('itemsHeaderStyle', key, value)} />
                    <StyleControl title="Style nội dung" style={settings?.itemsBodyStyle} onStyleChange={(key, value) => handleStyleChange('itemsBodyStyle', key, value)} />
                </div>
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary-headline">Thông tin Wi-Fi</h3>
                        <div className="flex items-center gap-2">
                            <label htmlFor="showWifi" className="font-medium text-primary-paragraph">Hiển thị</label>
                            <button onClick={() => setSettings(prev => ({...prev, showWifi: !prev.showWifi}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showWifi ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showWifi ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                    {settings?.showWifi && (<div className="mt-4"><input type="text" name="wifiPassword" placeholder="Nhập mật khẩu Wi-Fi" value={settings?.wifiPassword || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /><StyleControl title="Style Wi-Fi" style={settings?.wifiStyle} onStyleChange={(key, value) => handleStyleChange('wifiStyle', key, value)} /></div>)}
                </div>
                
                {/* QR Code Toggle */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary-headline">Mã QR Thanh toán</h3>
                        <div className="flex items-center gap-2">
                            <label htmlFor="showQrCode" className="font-medium text-primary-paragraph">Hiển thị</label>
                            <button onClick={() => setSettings(prev => ({...prev, showQrCode: !prev.showQrCode}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showQrCode ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showQrCode ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                    {settings?.showQrCode && (
                        <p className="text-primary-paragraph text-sm mt-4">
                            Mã QR sẽ được tạo dựa trên cài đặt Ngân hàng và tổng số tiền hóa đơn.
                            Để hiển thị đúng, vui lòng cấu hình đầy đủ thông tin ngân hàng trong mục "Cài đặt Ngân hàng".
                        </p>
                    )}
                </div>

                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Phần cuối hóa đơn (Footer)</h3>
                    <input type="text" name="totalLabel" placeholder="Nhãn tổng cộng" value={settings?.totalLabel || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl mb-4" />
                    <input type="text" name="thankYouMessage" placeholder="Lời cảm ơn" value={settings?.thankYouMessage || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                    <StyleControl title="Style Tổng cộng" style={settings?.totalStyle} onStyleChange={(key, value) => handleStyleChange('totalStyle', key, value)} />
                    <StyleControl title="Style Lời cảm ơn" style={settings?.footerStyle} onStyleChange={(key, value) => handleStyleChange('footerStyle', key, value)} />
                </div>
                
                {/* Cài đặt máy in đã được loại bỏ ở đây vì agent mới không cần */}
            </div>
            <div className="w-full lg:w-1/3 h-full">
                <h3 className="text-2xl font-bold text-primary-headline mb-4">Xem trước</h3>
                <div className="bg-gray-100 p-4 rounded-xl overflow-x-auto">
                    <div className="w-[57mm] scale-100" dangerouslySetInnerHTML={{ __html: preview }} />
                </div>
            </div>
        </div>
    );
};

export default AdminPrintSettings;