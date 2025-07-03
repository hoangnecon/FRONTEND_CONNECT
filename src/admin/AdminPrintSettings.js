// src/admin/AdminPrintSettings.js
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { initialPrintSettings } from '../data/initialPrintSettings';
import { generateReceiptHtml } from '../utils/generateReceiptHtml';

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

    const [provisionalPreview, setProvisionalPreview] = useState('');
    const [kitchenPreview, setKitchenPreview] = useState('');

    useEffect(() => {
        localStorage.setItem('printSettings', JSON.stringify(settings));
        console.log("AdminPrintSettings - Settings updated:", settings);
        generateAllPreviewContent();
    }, [settings, bankSettings, banks, bankListLoading]);

    const handleSettingChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => {
            if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
                    }
                };
            }
            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
            };
        });
    };
    
    const handleStyleChange = (section, styleKey, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [styleKey]: {
                    ...prev[section][styleKey],
                    [key]: value,
                }
            }
        }));
    };

    const handleRestoreDefaults = () => {
        setSettings(initialPrintSettings);
    };
    
    const generateAllPreviewContent = () => {
        const sampleOrderData = {
            items: [{ name: 'Phở Bò Đặc Biệt', quantity: 1, price: 89000 }, { name: 'Cà Phê Đen Đá', quantity: 2, price: 25000 }],
            total: 139000,
            table: '1',
            cashier: 'Nguyễn Văn A',
        };
        const provisionalHtml = generateReceiptHtml(sampleOrderData, settings, bankSettings, banks, 'provisional');
        const kitchenHtml = generateReceiptHtml(sampleOrderData, settings, bankSettings, banks, 'kitchen');
        setProvisionalPreview(provisionalHtml);
        setKitchenPreview(kitchenHtml);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2 h-full overflow-y-auto pr-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary-headline">Tùy chỉnh Hóa đơn</h2>
                    <button onClick={handleRestoreDefaults} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors">
                        <RotateCcw size={18} /> Khôi phục
                    </button>
                </div>

                {/* General Settings */}
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
                         <div className="col-span-2 flex items-center gap-2">
                            <label htmlFor="useSeparatorLine" className="font-medium text-primary-paragraph">Dùng đường kẻ phân cách</label>
                            <button onClick={() => handleSettingChange({target: {name: 'useSeparatorLine', type: 'checkbox', checked: !settings.useSeparatorLine}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.useSeparatorLine ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.useSeparatorLine ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Provisional Receipt Settings */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Phiếu tạm tính (Provisional)</h3>
                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="showStoreName" className="font-medium text-primary-paragraph">Hiển thị thông tin cửa hàng</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showStoreName', type: 'checkbox', checked: !settings.showStoreName}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showStoreName ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showStoreName ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    {settings?.showStoreName && (<div className="mt-4"><div className="space-y-4"><input type="text" name="restaurantName" placeholder="Tên quán" value={settings?.restaurantName || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /><input type="text" name="address" placeholder="Địa chỉ" value={settings?.address || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /><input type="text" name="phone" placeholder="Số điện thoại" value={settings?.phone || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /></div><StyleControl title="Style Tên quán" style={settings?.headerStyle} onStyleChange={(key, value) => handleStyleChange('headerStyle', key, value)} /><StyleControl title="Style Địa chỉ & SĐT" style={settings?.subHeaderStyle} onStyleChange={(key, value) => handleStyleChange('subHeaderStyle', key, value)} /></div>)}
                    
                    <div className="flex items-center justify-between mt-4">
                        <label htmlFor="showDateTime" className="font-medium text-primary-paragraph">Hiển thị Ngày/Giờ</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showDateTime', type: 'checkbox', checked: !settings.showDateTime}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showDateTime ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showDateTime ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <label htmlFor="showCashier" className="font-medium text-primary-paragraph">Hiển thị Thu ngân</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showCashier', type: 'checkbox', checked: !settings.showCashier}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showCashier ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showCashier ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    <StyleControl title="Style Thông tin đơn hàng" style={settings?.orderInfoStyle} onStyleChange={(key, value) => handleStyleChange('orderInfoStyle', key, value)} />
                    
                    <div className="mt-4">
                        <h4 className="font-semibold text-primary-headline mb-2">Danh sách sản phẩm</h4>
                        <StyleControl title="Style tiêu đề" style={settings?.itemsHeaderStyle} onStyleChange={(key, value) => handleStyleChange('itemsHeaderStyle', key, value)} />
                        <StyleControl title="Style nội dung" style={settings?.itemsBodyStyle} onStyleChange={(key, value) => handleStyleChange('itemsBodyStyle', key, value)} />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <label htmlFor="showQrCode" className="font-medium text-primary-paragraph">Hiển thị Mã QR Thanh toán</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showQrCode', type: 'checkbox', checked: !settings.showQrCode}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showQrCode ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showQrCode ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    {settings?.showQrCode && (
                        <p className="text-primary-paragraph text-sm mt-2">
                            Mã QR sẽ được tạo dựa trên cài đặt Ngân hàng và tổng số tiền hóa đơn.
                            Để hiển thị đúng, vui lòng cấu hình đầy đủ thông tin ngân hàng trong mục "Cài đặt Ngân hàng".
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <label htmlFor="showWifi" className="font-medium text-primary-paragraph">Hiển thị thông tin Wi-Fi</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showWifi', type: 'checkbox', checked: !settings.showWifi}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showWifi ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showWifi ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    {settings?.showWifi && (<div className="mt-2"><input type="text" name="wifiPassword" placeholder="Nhập mật khẩu Wi-Fi" value={settings?.wifiPassword || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" /><StyleControl title="Style Wi-Fi" style={settings?.wifiStyle} onStyleChange={(key, value) => handleStyleChange('wifiStyle', key, value)} /></div>)}
                    
                    <div className="mt-4">
                        <h4 className="font-semibold text-primary-headline mb-2">Phần cuối hóa đơn</h4>
                        <input type="text" name="totalLabel" placeholder="Nhãn tổng cộng" value={settings?.totalLabel || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl mb-4" />
                        <input type="text" name="thankYouMessage" placeholder="Lời cảm ơn" value={settings?.thankYouMessage || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                        <StyleControl title="Style Tổng cộng" style={settings?.totalStyle} onStyleChange={(key, value) => handleStyleChange('totalStyle', key, value)} />
                        <StyleControl title="Style Lời cảm ơn" style={settings?.footerStyle} onStyleChange={(key, value) => handleStyleChange('footerStyle', key, value)} />
                    </div>
                </div>

                {/* Kitchen Order Settings */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Phiếu bếp (Kitchen Order)</h3>
                    <input type="text" name="kitchenOrderHeader" placeholder="Tiêu đề phiếu bếp" value={settings?.kitchenOrderHeader || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl mb-4" />

                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="showKitchenStoreName" className="font-medium text-primary-paragraph">Hiển thị thông tin cửa hàng</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showKitchenStoreName', type: 'checkbox', checked: !settings.showKitchenStoreName}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showKitchenStoreName ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showKitchenStoreName ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                     {settings?.showKitchenStoreName && (<div className="mt-4"><div className="space-y-4"><input type="text" name="kitchenRestaurantName" placeholder="Tên quán" value={settings?.kitchenRestaurantName || ''} onChange={(e) => handleSettingChange(e, 'kitchenPrintSettings')} className="w-full p-3 bg-primary-secondary rounded-xl" /><input type="text" name="kitchenAddress" placeholder="Địa chỉ" value={settings?.kitchenAddress || ''} onChange={(e) => handleSettingChange(e, 'kitchenPrintSettings')} className="w-full p-3 bg-primary-secondary rounded-xl" /><input type="text" name="kitchenPhone" placeholder="Số điện thoại" value={settings?.kitchenPhone || ''} onChange={(e) => handleSettingChange(e, 'kitchenPrintSettings')} className="w-full p-3 bg-primary-secondary rounded-xl" /></div><StyleControl title="Style Tên quán" style={settings?.kitchenHeaderStyle} onStyleChange={(key, value) => handleStyleChange('kitchenHeaderStyle', key, value)} /></div>)}

                    <div className="flex items-center justify-between mt-4">
                        <label htmlFor="showKitchenCashier" className="font-medium text-primary-paragraph">Hiển thị Thu ngân</label>
                        <button onClick={() => handleSettingChange({target: {name: 'showKitchenCashier', type: 'checkbox', checked: !settings.showKitchenCashier}})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings?.showKitchenCashier ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings?.showKitchenCashier ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    <StyleControl title="Style Thông tin đơn hàng" style={settings?.kitchenOrderInfoStyle} onStyleChange={(key, value) => handleStyleChange('kitchenOrderInfoStyle', key, value)} />

                    <div className="mt-4">
                        <h4 className="font-semibold text-primary-headline mb-2">Danh sách sản phẩm</h4>
                        <StyleControl title="Style tiêu đề" style={settings?.kitchenItemsHeaderStyle} onStyleChange={(key, value) => handleStyleChange('kitchenItemsHeaderStyle', key, value)} />
                        <StyleControl title="Style nội dung" style={settings?.kitchenItemsBodyStyle} onStyleChange={(key, value) => handleStyleChange('kitchenItemsBodyStyle', key, value)} />
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold text-primary-headline mb-2">Phần cuối phiếu</h4>
                        <input type="text" name="kitchenFooterMessage" placeholder="Lời nhắn cuối phiếu" value={settings?.kitchenFooterMessage || ''} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                        <StyleControl title="Style Lời nhắn" style={settings?.kitchenFooterStyle} onStyleChange={(key, value) => handleStyleChange('kitchenFooterStyle', key, value)} />
                    </div>
                </div>
            </div>

            {/* Previews Section */}
            <div className="w-full lg:w-1/2 h-full">
                <h3 className="text-2xl font-bold text-primary-headline mb-4">Xem trước</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xl font-semibold text-primary-headline mb-2">Phiếu tạm tính</h4>
                        <div className="bg-gray-100 p-4 rounded-xl overflow-x-auto">
                            <div className="w-[57mm] scale-100" dangerouslySetInnerHTML={{ __html: provisionalPreview }} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-primary-headline mb-2">Phiếu bếp</h4>
                        <div className="bg-gray-100 p-4 rounded-xl overflow-x-auto">
                            <div className="w-[57mm] scale-100" dangerouslySetInnerHTML={{ __html: kitchenPreview }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPrintSettings;