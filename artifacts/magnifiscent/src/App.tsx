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
import { AdminApp } from "@/admin/AdminApp";

const queryClient = new QueryClient();

function AdminWrapper() {
  return <AdminApp />;
}

function StorefrontRouter() {
  return (
    <CartProvider>
      <CartDrawer />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:slug" component={ProductDetail} />
        <Route path="/deals" component={Deals} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
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
