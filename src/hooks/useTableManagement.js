// src/hooks/useTableManagement.js
import { useState } from 'react';
import { ShoppingBag, GalleryVertical } from 'lucide-react';
import { INITIAL_TABLES_DATA } from '../data/mockData'; // Import initial data

const useTableManagement = () => {
  const [tables, setTables] = useState(INITIAL_TABLES_DATA);

  const addTable = (id, name, isSpecial) => {
    if (tables.some(table => table.id === id)) {
      alert("ID bàn đã tồn tại!");
      return false;
    }
    const newTable = {
      id,
      name,
      isSpecial,
      icon: isSpecial ? ShoppingBag : GalleryVertical,
    };
    setTables(prevTables => {
      // Add special tables to the beginning, regular tables to the end
      if (newTable.isSpecial) {
        return [newTable, ...prevTables];
      } else {
        return [...prevTables, newTable];
      }
    });
    return true;
  };

  const updateTable = (id, newName, newIsSpecial) => {
    setTables(prevTables => prevTables.map(table =>
      table.id === id
        ? { ...table, name: newName, isSpecial: newIsSpecial, icon: newIsSpecial ? ShoppingBag : GalleryVertical }
        : table
    ).sort((a, b) => { // Re-sort after update to maintain special tables at top
      if (a.isSpecial && !b.isSpecial) return -1;
      if (!a.isSpecial && b.isSpecial) return 1;
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    }));
  };

  const deleteTable = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bàn "${id}" không?`)) {
      setTables(prevTables => prevTables.filter(table => table.id !== id));
    }
  };

  return {
    tables,
    setTables,
    addTable,
    updateTable,
    deleteTable,
  };
};

export default useTableManagement;