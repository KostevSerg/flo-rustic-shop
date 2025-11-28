import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { CartNotificationProvider } from "@/contexts/CartNotificationContext";
import { CityProvider } from "@/contexts/CityContext";
import { SiteTextsProvider } from "@/contexts/SiteTextsContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CityConfirmModal } from "@/components/CityConfirmModal";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import City from "./pages/City";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const CityDelivery = lazy(() => import("./pages/CityDelivery"));
const About = lazy(() => import("./pages/About"));
const Delivery = lazy(() => import("./pages/Delivery"));
const Guarantees = lazy(() => import("./pages/Guarantees"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Reviews = lazy(() => import("./pages/Reviews"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCities = lazy(() => import("./pages/AdminCities"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminTexts = lazy(() => import("./pages/AdminTexts"));
const AdminCityContacts = lazy(() => import("./pages/AdminCityContacts"));
const AdminCitySettlements = lazy(() => import("./pages/AdminCitySettlements"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const AdminPromoCodes = lazy(() => import("./pages/AdminPromoCodes"));
const AdminPageContents = lazy(() => import("./pages/AdminPageContents"));
const AdminSubcategories = lazy(() => import("./pages/AdminSubcategories"));
const UpdateSitemapPage = lazy(() => import("./pages/UpdateSitemapPage"));
const SitemapDownloader = lazy(() => import("./pages/SitemapDownloader"));
const AdminSEO = lazy(() => import("./pages/AdminSEO"));

const queryClient = new QueryClient();

declare global {
  interface Window {
    ym?: (counterId: number, method: string, url?: string) => void;
  }
}

const YandexMetrikaTracker = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (typeof window.ym !== 'undefined') {
      window.ym(104746725, 'hit', window.location.href);
    }
  }, [location]);

  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <SiteTextsProvider>
          <CityProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                  }}
                >
                  <CartNotificationProvider>
                    <CityConfirmModal />
                    <YandexMetrikaTracker />
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/catalog" element={<Catalog />} />
                      <Route path="/product/:id" element={<Product />} />
                      <Route path="/city/:citySlug" element={<City />} />
                      <Route path="/city/:citySlug/delivery" element={<CityDelivery />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/delivery" element={<Delivery />} />
                      <Route path="/guarantees" element={<Guarantees />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/admin" element={<AdminDashboard />} />

                      <Route path="/admin/cities" element={<AdminCities />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/texts" element={<AdminTexts />} />
                      <Route path="/admin/city-contacts" element={<AdminCityContacts />} />
                      <Route path="/admin/city-settlements" element={<AdminCitySettlements />} />
                      <Route path="/admin/reviews" element={<AdminReviews />} />
                      <Route path="/admin/promo-codes" element={<AdminPromoCodes />} />
                      <Route path="/admin/page-contents" element={<AdminPageContents />} />
                      <Route path="/admin/subcategories" element={<AdminSubcategories />} />
                      <Route path="/admin/seo-generator" element={<AdminSEO />} />
                      <Route path="/update-sitemap" element={<UpdateSitemapPage />} />
                      <Route path="/sitemap-downloader" element={<SitemapDownloader />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  </CartNotificationProvider>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </CityProvider>
        </SiteTextsProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;