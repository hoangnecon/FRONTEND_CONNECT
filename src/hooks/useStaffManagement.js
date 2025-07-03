// src/hooks/useStaffManagement.js
import { useState, useEffect } from 'react';

const initialStaff = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nhanvien_a@email.com', pin: '1234' },
  { id: 2, name: 'Trần Thị B', email: 'nhanvien_b@email.com', pin: '5678' },
];

const useStaffManagement = () => {
  const [staffList, setStaffList] = useState(() => {
    try {
      const savedStaff = localStorage.getItem('staffList');
      return savedStaff ? JSON.parse(savedStaff) : initialStaff;
    } catch {
      return initialStaff;
    }
  });

  useEffect(() => {
    localStorage.setItem('staffList', JSON.stringify(staffList));
  }, [staffList]);

  const addStaff = (staff) => {
    const newStaff = { ...staff, id: Date.now() };
    setStaffList([...staffList, newStaff]);
  };

  const updateStaff = (id, updatedStaff) => {
    setStaffList(staffList.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)));
  };

  const deleteStaff = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setStaffList(staffList.filter((s) => s.id !== id));
    }
  };

  return { staffList, addStaff, updateStaff, deleteStaff };
};

export default useStaffManagement;