import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Navigate,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './backend';

// Pages
import Home from './pages/Home';
import AccessDenied from './pages/AccessDenied';
import ProductBrowse from './pages/customer/ProductBrowse';
import ProductDetail from './pages/customer/ProductDetail';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerOrders from './pages/customer/OrderTracking';
import CustomerWallet from './pages/customer/Wallet';
import CustomerHistory from './pages/customer/RentalHistory';
import CustomerDisputes from './pages/customer/DisputeForm';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorUpload from './pages/vendor/ProductUpload';
import VendorInventory from './pages/vendor/InventoryManagement';
import VendorOrders from './pages/vendor/OrdersList';
import VendorEarnings from './pages/vendor/EarningsSummary';
import VendorPayouts from './pages/vendor/PayoutHistory';
import CenterDashboard from './pages/center/Dashboard';
import CenterInventory from './pages/center/InventoryReceipt';
import CenterQC from './pages/center/QCVerification';
import CenterTrials from './pages/center/TrialSlotManagement';
import CenterPOS from './pages/center/POSBooking';
import CenterSanitization from './pages/center/SanitizationWorkflow';
import CenterHandover from './pages/center/HandoverConfirmation';
import CenterReturnQC from './pages/center/ReturnQC';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendors from './pages/admin/VendorApproval';
import AdminCenters from './pages/admin/CenterApproval';
import AdminProducts from './pages/admin/ProductApproval';
import AdminCommission from './pages/admin/CommissionSettings';
import AdminRevenue from './pages/admin/PlatformRevenue';
import AdminAnalytics from './pages/admin/Analytics';
import AdminDisputes from './pages/admin/DisputeManagement';
import AdminPayouts from './pages/admin/PayoutRelease';
import AdminGST from './pages/admin/GSTReport';

// Root layout with header/footer
function RootLayout() {
  const { showProfileSetup } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ProfileSetupModal open={showProfileSetup} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

// Dashboard layout (no header/footer — uses sidebar)
function DashboardOutlet() {
  return <Outlet />;
}

// Route definitions
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const accessDeniedRoute = createRoute({ getParentRoute: () => rootRoute, path: '/access-denied', component: AccessDenied });
const productsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/products', component: ProductBrowse });
const productDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/products/$productId', component: ProductDetail });

// Customer routes
const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer',
  component: () => (
    <ProtectedRoute requiredRole={UserRole.customer}>
      <DashboardOutlet />
    </ProtectedRoute>
  ),
});
const customerIndexRoute = createRoute({ getParentRoute: () => customerRoute, path: '/', component: CustomerDashboard });
const customerOrdersRoute = createRoute({ getParentRoute: () => customerRoute, path: '/orders', component: CustomerOrders });
const customerWalletRoute = createRoute({ getParentRoute: () => customerRoute, path: '/wallet', component: CustomerWallet });
const customerHistoryRoute = createRoute({ getParentRoute: () => customerRoute, path: '/history', component: CustomerHistory });
const customerDisputesRoute = createRoute({ getParentRoute: () => customerRoute, path: '/disputes', component: CustomerDisputes });

// Vendor routes
const vendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor',
  component: () => (
    <ProtectedRoute requiredRole={UserRole.vendor}>
      <DashboardOutlet />
    </ProtectedRoute>
  ),
});
const vendorIndexRoute = createRoute({ getParentRoute: () => vendorRoute, path: '/', component: VendorDashboard });
const vendorUploadRoute = createRoute({ getParentRoute: () => vendorRoute, path: '/upload', component: VendorUpload });
const vendorInventoryRoute = createRoute({ getParentRoute: () => vendorRoute, path: '/inventory', component: VendorInventory });
const vendorOrdersRoute = createRoute({ getParentRoute: () => vendorRoute, path: '/orders', component: VendorOrders });
const vendorEarningsRoute = createRoute({ getParentRoute: () => vendorRoute, path: '/earnings', component: VendorEarnings });
const vendorPayoutsRoute = createRoute({ getParentRoute: () => vendorRoute, path: '/payouts', component: VendorPayouts });

// Center routes
const centerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/center',
  component: () => (
    <ProtectedRoute requiredRole={UserRole.center}>
      <DashboardOutlet />
    </ProtectedRoute>
  ),
});
const centerIndexRoute = createRoute({ getParentRoute: () => centerRoute, path: '/', component: CenterDashboard });
const centerInventoryRoute = createRoute({ getParentRoute: () => centerRoute, path: '/inventory', component: CenterInventory });
const centerQCRoute = createRoute({ getParentRoute: () => centerRoute, path: '/qc', component: CenterQC });
const centerTrialsRoute = createRoute({ getParentRoute: () => centerRoute, path: '/trials', component: CenterTrials });
const centerPOSRoute = createRoute({ getParentRoute: () => centerRoute, path: '/pos', component: CenterPOS });
const centerSanitizationRoute = createRoute({ getParentRoute: () => centerRoute, path: '/sanitization', component: CenterSanitization });
const centerHandoverRoute = createRoute({ getParentRoute: () => centerRoute, path: '/handover', component: CenterHandover });
const centerReturnQCRoute = createRoute({ getParentRoute: () => centerRoute, path: '/return-qc', component: CenterReturnQC });

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute requiredRole={UserRole.admin}>
      <DashboardOutlet />
    </ProtectedRoute>
  ),
});
const adminIndexRoute = createRoute({ getParentRoute: () => adminRoute, path: '/', component: AdminDashboard });
const adminVendorsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/vendors', component: AdminVendors });
const adminCentersRoute = createRoute({ getParentRoute: () => adminRoute, path: '/centers', component: AdminCenters });
const adminProductsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/products', component: AdminProducts });
const adminCommissionRoute = createRoute({ getParentRoute: () => adminRoute, path: '/commission', component: AdminCommission });
const adminRevenueRoute = createRoute({ getParentRoute: () => adminRoute, path: '/revenue', component: AdminRevenue });
const adminAnalyticsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/analytics', component: AdminAnalytics });
const adminDisputesRoute = createRoute({ getParentRoute: () => adminRoute, path: '/disputes', component: AdminDisputes });
const adminPayoutsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/payouts', component: AdminPayouts });
const adminGSTRoute = createRoute({ getParentRoute: () => adminRoute, path: '/gst', component: AdminGST });

const routeTree = rootRoute.addChildren([
  indexRoute,
  accessDeniedRoute,
  productsRoute,
  productDetailRoute,
  customerRoute.addChildren([
    customerIndexRoute,
    customerOrdersRoute,
    customerWalletRoute,
    customerHistoryRoute,
    customerDisputesRoute,
  ]),
  vendorRoute.addChildren([
    vendorIndexRoute,
    vendorUploadRoute,
    vendorInventoryRoute,
    vendorOrdersRoute,
    vendorEarningsRoute,
    vendorPayoutsRoute,
  ]),
  centerRoute.addChildren([
    centerIndexRoute,
    centerInventoryRoute,
    centerQCRoute,
    centerTrialsRoute,
    centerPOSRoute,
    centerSanitizationRoute,
    centerHandoverRoute,
    centerReturnQCRoute,
  ]),
  adminRoute.addChildren([
    adminIndexRoute,
    adminVendorsRoute,
    adminCentersRoute,
    adminProductsRoute,
    adminCommissionRoute,
    adminRevenueRoute,
    adminAnalyticsRoute,
    adminDisputesRoute,
    adminPayoutsRoute,
    adminGSTRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
