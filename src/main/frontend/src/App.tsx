import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ProductPage from "./components/ProductPage.tsx";
import Navbar from "./components/NavBar.tsx";
import Login from "./components/Login.tsx";
import Cart from "./components/Cart.tsx";
import Register from "./components/Register.tsx";

interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Dimensions {
  id: number;
  width: number;
  height: number;
  depth: number;
}

interface Meta {
  id: number;
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface ProductType {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  thumbnail: string;
  tags: string[];
  images: string[];
  dimensions: Dimensions;
  meta: Meta;
  reviews: Review[];
}

const App: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const API_URL = "http://localhost:8080/home";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ProductType[] = await res.json();
        setProducts(data);
        setDisplayedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle search results from Navbar
  const handleSearchResults = (searchResults: ProductType[], query: string = "") => {
    setSearchQuery(query);
    if (searchResults.length === 0 && query === "") {
      setDisplayedProducts(products);
      setIsSearchMode(false);
    } else {
      setDisplayedProducts(searchResults);
      setIsSearchMode(true);
    }
  };

  // Helper functions
  const calculateOriginalPrice = (price: number, discountPercentage: number) => {
    return (price / (1 - discountPercentage / 100));
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStockStatus = (stock: number, availabilityStatus: string) => {
    if (availabilityStatus === "Out of Stock" || stock === 0) return "out-of-stock";
    if (stock <= 5) return "low-stock";
    return "in-stock";
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </div>
    );
  };

  return (
    <Router>
      <Navbar onSearchResults={handleSearchResults} />

      <div className="app">
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {/* Products Display */}
                  {loading ? (
                    <p className="loading">Loading products...</p>
                  ) : (
                    <div>
                      {isSearchMode && (
                        <div className="search-info">
                          <p className="search-results-count">
                            1-{displayedProducts.length} of {displayedProducts.length} results for "{searchQuery}"
                          </p>
                        </div>
                      )}
                      
                      <div className="products-grid">
                        {displayedProducts.map((product) => (
                          <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="product-card-link"
                          >
                            <div className="product-card">
                              <div className="product-image-container">
                                <img src={product.thumbnail} alt={product.title} />
                                {product.discountPercentage > 0 && (
                                  <div className="product-discount-badge">
                                    -{Math.round(product.discountPercentage)}% off
                                  </div>
                                )}
                              </div>
                              
                              <div className="product-card-body">
                                <div className="product-category">
                                  {formatCategoryName(product.category)}
                                </div>
                                
                                <h3 className="product-title">{product.title}</h3>
                                
                                <div className="product-rating">
                                  {renderStars(product.rating)}
                                  <span className="rating-number">({product.rating})</span>
                                  <span className="review-count">
                                    {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                                  </span>
                                </div>

                                <div className="product-brand">
                                  by <span className="brand-name">{product.brand}</span>
                                </div>
                                
                                <div className="product-price-section">
                                  <div className="current-price">${product.price.toFixed(2)}</div>
                                  {product.discountPercentage > 0 && (
                                    <div className="original-price">
                                      ${calculateOriginalPrice(product.price, product.discountPercentage).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="product-delivery">
                                  {product.shippingInformation}
                                </div>
                                
                                <div className={`product-stock ${getStockStatus(product.stock, product.availabilityStatus)}`}>
                                  {product.availabilityStatus === "In Stock" 
                                    ? `${product.stock} in stock` 
                                    : product.availabilityStatus
                                  }
                                </div>
                                
                                {product.minimumOrderQuantity > 1 && (
                                  <div className="product-min-order">
                                    Min order: {product.minimumOrderQuantity}
                                  </div>
                                )}
                                
                                <div className="product-tags">
                                  {product.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="product-tag">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {displayedProducts.length === 0 && isSearchMode && (
                        <div className="no-results">
                          <h3>No results found</h3>
                          <p>Try different keywords or remove search filters</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              }
            />

            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
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