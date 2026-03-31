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
import { getExtendedSettings } from "@/data/liveData";
import logoImg from "@assets/whitelogo_1774978057429.png";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function StorefrontEffects() {
  useEffect(() => {
    const ext = getExtendedSettings();

    if (ext.seoTitle) document.title = ext.seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    if (ext.seoDescription) metaDesc.content = ext.seoDescription;

    if (ext.seoOgImage) {
      let ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (!ogImg) {
        ogImg = document.createElement("meta");
        ogImg.setAttribute("property", "og:image");
        document.head.appendChild(ogImg);
      }
      ogImg.content = ext.seoOgImage;
    }

    if (ext.ga4Id && !document.getElementById("ga4-script")) {
      const s1 = document.createElement("script");
      s1.id = "ga4-script";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${ext.ga4Id}`;
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.id = "ga4-init";
      s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ext.ga4Id}');`;
      document.head.appendChild(s2);
    }

    if (ext.fbPixelId && !document.getElementById("fbpixel-script")) {
      const s = document.createElement("script");
      s.id = "fbpixel-script";
      s.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${ext.fbPixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, []);
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

function StorefrontRouter() {
  const [location] = useLocation();
  return (
    <CartProvider>
      <ScrollToTop />
      <StorefrontEffects />
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
  const ext = getExtendedSettings();
  if (ext.maintenanceMode) {
    return <MaintenancePage message={ext.maintenanceMessage} />;
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
