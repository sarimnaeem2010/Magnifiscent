import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { AdminProvider, useAdmin } from "./AdminContext";
import { AdminLayout } from "./AdminLayout";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminCustomers } from "./pages/AdminCustomers";
import { AdminInventory } from "./pages/AdminInventory";
import { AdminDeals } from "./pages/AdminDeals";
import { AdminSettings } from "./pages/AdminSettings";
import { AdminMedia } from "./pages/AdminMedia";
import { AdminInstagram } from "./pages/AdminInstagram";
import { AdminPages } from "./pages/AdminPages";
import { AdminEmail } from "./pages/AdminEmail";

function AdminRoutes() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/customers" component={AdminCustomers} />
        <Route path="/admin/inventory" component={AdminInventory} />
        <Route path="/admin/deals" component={AdminDeals} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/media" component={AdminMedia} />
        <Route path="/admin/instagram" component={AdminInstagram} />
        <Route path="/admin/pages" component={AdminPages} />
        <Route path="/admin/email" component={AdminEmail} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
  );
}

export function AdminApp() {
  return (
    <AdminProvider>
      <AdminRoutes />
    </AdminProvider>
  );
}
