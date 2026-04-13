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
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiExtendedSettings } from "@/lib/api";
import logoImg from "@assets/whitelogo_1774978057429.png";
import { syncGlobalSeo, applyDocumentMeta } from "@/hooks/useSeoMeta";

const queryClient = new QueryClient();

const DEFAULT_EXT: ApiExtendedSettings = {
  seoTitle: "",
  seoDescription: "",
  seoOgImage: "",
  shippingRate: 200,
  shippingCarrier: "",
  taxRate: 0,
  showTaxInCart: false,
  ga4Id: "",
  fbPixelId: "",
  maintenanceMode: false,
  maintenanceMessage: "",
};

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function StorefrontEffects({ ext }: { ext: ApiExtendedSettings }) {
  useEffect(() => {
    const defaultTitle = "Buy Perfumes Online in Pakistan | MagnifiScent";
    const defaultDesc =
      "Shop premium long-lasting Eau de Parfum for men and women in Pakistan. Cash on Delivery available. Authentic fragrances — MagnifiScent.";

    const title = ext.seoTitle || defaultTitle;
    const desc = ext.seoDescription || defaultDesc;
    const ogImage = ext.seoOgImage || "";

    syncGlobalSeo(title, desc, ogImage);
    applyDocumentMeta(title, desc, ogImage, "website");

    const existingGa4 = document.getElementById("ga4-script");
    if (ext.ga4Id && !existingGa4) {
      const s1 = document.createElement("script");
      s1.id = "ga4-script";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${ext.ga4Id}`;
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.id = "ga4-init";
      s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ext.ga4Id}');`;
      document.head.appendChild(s2);
    } else if (!ext.ga4Id && existingGa4) {
      existingGa4.remove();
      document.getElementById("ga4-init")?.remove();
    }

    const existingPixel = document.getElementById("fbpixel-script");
    if (ext.fbPixelId && !existingPixel) {
      const s = document.createElement("script");
      s.id = "fbpixel-script";
      s.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${ext.fbPixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);
    } else if (!ext.fbPixelId && existingPixel) {
      existingPixel.remove();
    }
  }, [ext]);

  return null;
}

function MaintenancePage({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 text-center px-6">
      <img
        src={logoImg}
        alt="MagnifiScent"
        style={{ height: 56, width: "auto", objectFit: "contain", filter: "invert(1)" }}
        className="mb-8"
      />
      <h1
        className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-gray-900 mb-4"
        style={{ fontFamily: "Georgia, serif" }}
      >
        We'll Be Back Soon
      </h1>
      <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-6">{message}</p>
      <p className="text-xs text-gray-300 uppercase tracking-widest">— MagnifiScent</p>
    </div>
  );
}

function AdminWrapper() {
  return <AdminApp />;
}

function StorefrontRouter({ ext }: { ext: ApiExtendedSettings }) {
  const [location] = useLocation();
  return (
    <CartProvider>
      <ScrollToTop />
      <StorefrontEffects ext={ext} />
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
  const [ext, setExt] = useState<ApiExtendedSettings>(DEFAULT_EXT);
  const [extLoaded, setExtLoaded] = useState(false);

  useEffect(() => {
    api.settings.get().then((res) => {
      if (res.success && res.settings.extended) {
        setExt({ ...DEFAULT_EXT, ...res.settings.extended });
      }
    }).catch(() => {}).finally(() => setExtLoaded(true));
  }, []);

  if (location === "/admin" || location.startsWith("/admin/")) {
    return <AdminWrapper />;
  }

  if (extLoaded && ext.maintenanceMode) {
    return <MaintenancePage message={ext.maintenanceMessage} />;
  }

  return <StorefrontRouter ext={ext} />;
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
