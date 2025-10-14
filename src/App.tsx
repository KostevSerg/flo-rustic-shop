
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
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
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/city/:citySlug" element={<City />} />
                <Route path="/about" element={<About />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/guarantees" element={<Guarantees />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/cities" element={<Admin />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;