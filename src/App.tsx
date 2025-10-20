
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { CityProvider } from "@/contexts/CityContext";
import { SiteTextsProvider } from "@/contexts/SiteTextsContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import JivoChat from "@/components/JivoChat";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import City from "./pages/City";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Guarantees from "./pages/Guarantees";
import Contacts from "./pages/Contacts";
import Reviews from "./pages/Reviews";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminTexts from "./pages/AdminTexts";
import AdminCities from "./pages/AdminCities";

import AdminCityContacts from "./pages/AdminCityContacts";
import AdminCitySettlements from "./pages/AdminCitySettlements";
import AdminReviews from "./pages/AdminReviews";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPromoCodes from "./pages/AdminPromoCodes";
import AdminPageContents from "./pages/AdminPageContents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
                <JivoChat />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/city/:citySlug" element={<City />} />
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
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
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