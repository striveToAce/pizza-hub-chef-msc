export const OrderStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
  } as const;
  
  export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
  
  
  export const MenuItemSize = {
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    LARGE: 'LARGE'
  } as const;
  
  export type MenuItemSize = (typeof MenuItemSize)[keyof typeof MenuItemSize]
  
  
  export const MenuItemType = {
    PIZZA: 'PIZZA',
    SODA: 'SODA'
  } as const;
  
  export type MenuItemType = (typeof MenuItemType)[keyof typeof MenuItemType]
  