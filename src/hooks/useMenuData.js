// src/hooks/useMenuData.js
import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, MENU_TYPES } from '../data/mockData';

const useMenuData = () => {
  const [menuItems, setMenuItems] = useState(() =>
    MENU_ITEMS.map(item => ({
      ...item,
      inventoryEnabled: false,
      inventoryCount: 0,
      costPrice: 0, // Add costPrice
    }))
  );
  const [menuTypes, setMenuTypes] = useState(MENU_TYPES);
  const [categories, setCategories] = useState(CATEGORIES);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMenuType, setSelectedMenuType] = useState('regular');

  const addMenuType = (id, name) => {
    const newMenu = { id, name };
    setMenuTypes([...menuTypes, newMenu]);
  };

  const deleteMenuType = (menuTypeId) => {
    setMenuTypes(menuTypes.filter((menu) => menu.id !== menuTypeId));
    setMenuItems(menuItems.filter((item) => item.menuType !== menuTypeId));
  };

  const addMenuItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: Math.max(0, ...menuItems.map((item) => item.id)) + 1,
      inventoryEnabled: false,
      inventoryCount: 0,
      costPrice: 0, // Ensure new items have a default costPrice
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (itemId, itemData) => {
    setMenuItems(menuItems.map((item) => (item.id === itemId ? { ...item, ...itemData } : item)));
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };
  
  const updateItemInventory = (itemId, inventoryData) => {
    setMenuItems(prevItems =>
      prevItems.map(item => (item.id === itemId ? { ...item, ...inventoryData } : item))
    );
  };

  const addCategory = (name) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    if (categories.some(cat => cat.id === newId)) { alert("ID loại món đã tồn tại hoặc tên không hợp lệ!"); return; }
    const newCategory = { id: newId, name, icon: UtensilsCrossed };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (categoryId, newName) => {
    setCategories(categories.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
  };

  const deleteCategory = (categoryId) => {
    if (['all', 'popular'].includes(categoryId)) { alert("Không thể xóa loại món cơ bản này!"); return; }
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;
    setCategories(categories.filter(cat => cat.id !== categoryId));
    setMenuItems(menuItems.map(item => item.category === categoryToDelete.name ? { ...item, category: 'Khác' } : item));
  };

  return {
    menuItems,
    setMenuItems,
    menuTypes,
    setMenuTypes,
    categories,
    setCategories,
    addMenuType,
    deleteMenuType,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateItemInventory,
    addCategory,
    updateCategory,
    deleteCategory,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedMenuType,
    setSelectedMenuType,
  };
};

export default useMenuData;