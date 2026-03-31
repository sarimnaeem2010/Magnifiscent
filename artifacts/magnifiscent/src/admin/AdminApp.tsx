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
