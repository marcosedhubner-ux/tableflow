export type StaffRole = "SERVER" | "KITCHEN" | "MANAGER";
export type TableType = "STANDARD" | "BOOTH" | "OUTDOOR" | "BAR";
export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";
export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED" | "PAID" | "CANCELLED";

export interface AuthenticatedStaff {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  unitPrice: string;
  isAvailable: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  isReady: boolean;
}

export interface Order {
  id: string;
  tableId: string;
  table: { id: string; tableNumber: number };
  serverId: string;
  server: { id: string; fullName: string };
  status: OrderStatus;
  totalValue: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface RestaurantTable {
  id: string;
  tableNumber: number;
  tableType: TableType;
  seatCount: number;
  status: TableStatus;
  orders: Order[];
}

export interface DailySummary {
  revenueToday: number;
  ordersServedToday: number;
  topMenuItems: { name: string; quantity: number }[];
  averageTurnoverMinutes: number;
}
