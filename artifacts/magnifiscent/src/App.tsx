import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import Deals from "@/pages/Deals";
import PolicyPage from "@/pages/PolicyPage";
import { AdminApp } from "@/admin/AdminApp";
import { useEffect } from "react";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function AdminWrapper() {
  return <AdminApp />;
}

function StorefrontRouter() {
  const [location] = useLocation();
  return (
    <CartProvider>
      <ScrollToTop />
      <CartDrawer />
      <div key={location} className="page-transition">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/deals" component={Deals} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/returns" component={() => <PolicyPage pageKey="returns" />} />
          <Route path="/shipping" component={() => <PolicyPage pageKey="shipping" />} />
          <Route path="/privacy" component={() => <PolicyPage pageKey="privacy" />} />
          <Route path="/terms" component={() => <PolicyPage pageKey="terms" />} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </CartProvider>
  );
}

function RootRouter() {
  const [location] = useLocation();
  if (location === "/admin" || location.startsWith("/admin/")) {
    return <AdminWrapper />;
  }
  return <StorefrontRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <RootRouter />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
