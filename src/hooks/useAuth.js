// src/hooks/useAuth.js
import { useState } from 'react';

const useAuth = (staffList, onLoginSuccess, onLogout) => {
  // 'logged_out' -> 'business_auth' (chờ nhập pin) -> 'staff_auth'
  // 'logged_out' -> 'admin_auth'
  const [authLevel, setAuthLevel] = useState('logged_out'); 
  const [loggedInStaff, setLoggedInStaff] = useState(null);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Dành cho nút "Login" (cho nhân viên)
  const handleLogin = () => {
    // Giả sử đăng nhập doanh nghiệp thành công
    // Trong thực tế, bạn sẽ xác thực email/pass này với backend
    if (loginEmail && loginPassword) {
      setAuthLevel('business_auth'); // Chuyển sang trạng thái chờ nhập PIN
    } else {
      alert('Vui lòng nhập email và mật khẩu.');
    }
  };
  
  // Dành cho nút "Login as Admin"
  const handleAdminLogin = () => {
    if (loginEmail.toLowerCase() === 'admin' && loginPassword === 'admin') {
      const adminUser = { id: 'admin', name: 'Admin', email: loginEmail };
      setLoggedInStaff(adminUser);
      setAuthLevel('admin_auth'); // Vào thẳng trang admin
      onLoginSuccess(true);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Thông tin đăng nhập Admin không chính xác.');
    }
  };

  // Dành cho màn hình PIN
  const handleStaffLogin = (staffId, pin) => {
    const staffMember = staffList.find(s => s.id.toString() === staffId.toString());
    if (staffMember && staffMember.pin === pin) {
      setLoggedInStaff(staffMember);
      setAuthLevel('staff_auth'); // Đăng nhập nhân viên thành công
      onLoginSuccess(false);
    } else {
      alert('Mã PIN không chính xác.');
    }
  };

  // Đăng xuất nhân viên (từ sidebar) -> quay lại màn hình PIN
  const handleStaffLogout = () => {
    setLoggedInStaff(null);
    setAuthLevel('business_auth'); // Quay lại trạng thái chờ nhập PIN
  };
  
  // Thoát hoàn toàn (từ sidebar) -> quay lại màn hình đăng nhập đầu tiên
  const handleBusinessLogout = () => {
    setLoggedInStaff(null);
    setAuthLevel('logged_out');
    setLoginEmail('');
    setLoginPassword('');
    onLogout();
  };

  return {
    authLevel,
    loggedInStaff,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLogin,
    handleAdminLogin,
    handleStaffLogin,
    handleStaffLogout,
    handleBusinessLogout,
  };
};

export default useAuth;