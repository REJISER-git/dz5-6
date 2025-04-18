import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./components/Layout/AppLayout";
import Products from "./components/Product";
import CartPage from "./pages/Cart/CartPage";
import FavoritesPage from "./pages/Favorites/Favorites";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>
                </AppLayout>
            </Router>
        </QueryClientProvider>
    );
}

export default App;