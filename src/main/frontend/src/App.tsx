import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ProductPage from "./components/ProductPage.tsx";
import Navbar from "./components/NavBar.tsx";

interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = "http://localhost:8080/home";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ProductType[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Router>
      {/* Navbar at the very top */}
      <Navbar />

      <div className="app">
        <main className="main-content">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                loading ? (
                  <p className="loading">Loading products...</p>
                ) : (
                  <div className="products-grid">
                    {products.map((p) => (
                      <Link
                        to={`/product/${p.id}`}
                        key={p.id}
                        className="card-link"
                      >
                        <div className="card">
                          <img src={p.thumbnail} alt={p.title} />
                          <div className="card-body">
                            <h3>{p.title}</h3>
                            <p className="desc">{p.description}</p>
                            <p className="price">
                              <b>${p.price}</b>{" "}
                              <span className="discount">
                                -{p.discountPercentage}%
                              </span>
                            </p>
                            <p className="rating-stock">
                              ⭐ {p.rating} | Stock: {p.stock}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              }
            />

            {/* Product Details Page */}
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2025 Shopping App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
