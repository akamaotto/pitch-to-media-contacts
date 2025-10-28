import { ContactTab } from '../../types';

/**
 * Interface for a menu item configuration
 */
export interface MenuItemConfig {
  id: ContactTab;
  name: string;
}

/**
 * Configuration for all menu tabs
 */
export interface MenuConfig {
  /**
   * All available menu items
   */
  items: MenuItemConfig[];
  
  /**
   * Function to get filtered menu items based on conditions
   */
  getFilteredItems: (showPitchedTab?: boolean) => MenuItemConfig[];
}

/**
 * Default menu items configuration
 */
const DEFAULT_MENU_ITEMS: MenuItemConfig[] = [
  { id: 'all', name: 'All Contacts' },
  { id: 'pitched', name: 'Pitched' },
  { id: 'recommended', name: 'Recommended' },
  { id: 'myContacts', name: 'My Contacts' }
];

/**
 * Creates a filtered list of menu items based on visibility conditions
 * @param showPitchedTab - Whether to include the pitched tab
 * @returns Filtered menu items
 */
const createFilteredMenuItems = (showPitchedTab?: boolean): MenuItemConfig[] => {
  const items: MenuItemConfig[] = [];
  
  // Add all tabs in the new order
  items.push(
    DEFAULT_MENU_ITEMS.find(item => item.id === 'all')!
  );
  
  // Add pitched tab only if it should be shown
  if (showPitchedTab) {
    items.push(DEFAULT_MENU_ITEMS.find(item => item.id === 'pitched')!);
  }
  
  // Add the remaining tabs
  items.push(
    DEFAULT_MENU_ITEMS.find(item => item.id === 'recommended')!,
    DEFAULT_MENU_ITEMS.find(item => item.id === 'myContacts')!
  );
  
  return items;
};

/**
 * Centralized menu configuration
 */
export const menuConfig: MenuConfig = {
  items: DEFAULT_MENU_ITEMS,
  getFilteredItems: createFilteredMenuItems
};

/**
 * Helper function to get menu items with conditional visibility
 * @param showPitchedTab - Whether to include the pitched tab
 * @returns Filtered menu items
 */
export const getMenuItems = (showPitchedTab?: boolean): MenuItemConfig[] => {
  console.log('menuConfig: getMenuItems called with showPitchedTab:', showPitchedTab);
  const items = menuConfig.getFilteredItems(showPitchedTab);
  console.log('menuConfig: returning menu items:', items);
  return items;
};

/**
 * Get a specific menu item by ID
 * @param id - The menu item ID
 * @returns The menu item configuration or undefined if not found
 */
export const getMenuItem = (id: ContactTab): MenuItemConfig | undefined => {
  return menuConfig.items.find(item => item.id === id);
};

// Export types for external use
export type { ContactTab };