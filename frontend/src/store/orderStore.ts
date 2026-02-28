import { create } from 'zustand';

export type OrderStatus =
  | 'trialBooked'
  | 'trialCompleted'
  | 'paymentDone'
  | 'sanitizing'
  | 'readyForHandover'
  | 'rented'
  | 'returned'
  | 'closed';

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  productImage?: string;
  centerId: string;
  centerName: string;
  rentalPrice: number;
  depositAmount: number;
  rentalStart?: Date;
  rentalEnd?: Date;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  damageCharge?: number;
  notes?: string;
}

export interface TrialBooking {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  centerId: string;
  centerName: string;
  trialDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface SanitizationRecord {
  id: string;
  orderId: string;
  productId: string;
  cleaningType: string;
  chemicalUsed: string;
  staffName: string;
  dateTime: Date;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  status: 'approved' | 'recleanRequired';
  tagId?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  reason: string;
  description: string;
  status: 'open' | 'resolved' | 'escalated';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  role: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface OrderStore {
  orders: Order[];
  trialBookings: TrialBooking[];
  sanitizationRecords: SanitizationRecord[];
  disputes: Dispute[];
  notifications: Notification[];
  walletBalance: number;
  depositHeld: number;

  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  addTrialBooking: (booking: TrialBooking) => void;
  updateTrialStatus: (bookingId: string, status: TrialBooking['status']) => void;
  addSanitizationRecord: (record: SanitizationRecord) => void;
  addDispute: (dispute: Dispute) => void;
  updateDisputeStatus: (disputeId: string, status: Dispute['status']) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  setWalletBalance: (balance: number) => void;
  setDepositHeld: (amount: number) => void;
}

// Seed data for demo
const seedOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'cust-1',
    productId: 'prod-1',
    productName: 'Royal Kundan Necklace Set',
    centerId: 'center-1',
    centerName: 'Elegance Center - Mumbai',
    rentalPrice: 2500,
    depositAmount: 5000,
    rentalStart: new Date('2026-02-20'),
    rentalEnd: new Date('2026-02-25'),
    status: 'rented',
    createdAt: new Date('2026-02-18'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: 'ORD-002',
    customerId: 'cust-1',
    productId: 'prod-2',
    productName: 'Bridal Lehenga - Crimson Gold',
    centerId: 'center-1',
    centerName: 'Elegance Center - Mumbai',
    rentalPrice: 8000,
    depositAmount: 15000,
    status: 'trialBooked',
    createdAt: new Date('2026-02-25'),
    updatedAt: new Date('2026-02-25'),
  },
  {
    id: 'ORD-003',
    customerId: 'cust-1',
    productId: 'prod-3',
    productName: 'Diamond Choker Set',
    centerId: 'center-2',
    centerName: 'Luxe Rentals - Delhi',
    rentalPrice: 3500,
    depositAmount: 8000,
    rentalStart: new Date('2026-01-10'),
    rentalEnd: new Date('2026-01-15'),
    status: 'closed',
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-16'),
  },
];

const seedTrialBookings: TrialBooking[] = [
  {
    id: 'TRIAL-001',
    customerId: 'cust-1',
    productId: 'prod-2',
    productName: 'Bridal Lehenga - Crimson Gold',
    centerId: 'center-1',
    centerName: 'Elegance Center - Mumbai',
    trialDate: new Date('2026-03-05T11:00:00'),
    status: 'confirmed',
    createdAt: new Date('2026-02-25'),
  },
];

const seedNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'cust-1',
    role: 'customer',
    message: 'Your rental ORD-001 is active. Return by Feb 25.',
    type: 'info',
    read: false,
    createdAt: new Date('2026-02-20'),
  },
  {
    id: 'notif-2',
    userId: 'cust-1',
    role: 'customer',
    message: 'Trial booking TRIAL-001 confirmed for Mar 5.',
    type: 'success',
    read: false,
    createdAt: new Date('2026-02-25'),
  },
  {
    id: 'notif-3',
    userId: 'vendor-1',
    role: 'vendor',
    message: 'Product "Royal Kundan Necklace Set" is currently rented.',
    type: 'info',
    read: true,
    createdAt: new Date('2026-02-20'),
  },
  {
    id: 'notif-4',
    userId: 'admin-1',
    role: 'admin',
    message: 'New vendor registration pending approval.',
    type: 'warning',
    read: false,
    createdAt: new Date('2026-02-26'),
  },
];

export const useOrderStore = create<OrderStore>((set) => ({
  orders: seedOrders,
  trialBookings: seedTrialBookings,
  sanitizationRecords: [],
  disputes: [],
  notifications: seedNotifications,
  walletBalance: 5000,
  depositHeld: 5000,

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
      notifications: [
        ...state.notifications,
        {
          id: `notif-${Date.now()}`,
          userId: order.customerId,
          role: 'customer',
          message: `New order ${order.id} created for ${order.productName}.`,
          type: 'success',
          read: false,
          createdAt: new Date(),
        },
      ],
    })),

  updateOrderStatus: (orderId, status, notes) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status, notes: notes ?? o.notes, updatedAt: new Date() } : o
      ),
    })),

  addTrialBooking: (booking) =>
    set((state) => ({
      trialBookings: [...state.trialBookings, booking],
    })),

  updateTrialStatus: (bookingId, status) =>
    set((state) => ({
      trialBookings: state.trialBookings.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      ),
    })),

  addSanitizationRecord: (record) =>
    set((state) => ({
      sanitizationRecords: [...state.sanitizationRecords, record],
    })),

  addDispute: (dispute) =>
    set((state) => ({
      disputes: [...state.disputes, dispute],
    })),

  updateDisputeStatus: (disputeId, status) =>
    set((state) => ({
      disputes: state.disputes.map((d) =>
        d.id === disputeId ? { ...d, status } : d
      ),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    })),

  setWalletBalance: (balance) => set({ walletBalance: balance }),
  setDepositHeld: (amount) => set({ depositHeld: amount }),
}));
