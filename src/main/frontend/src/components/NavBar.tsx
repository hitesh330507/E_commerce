import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

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

interface NavbarProps {
  onSearchResults?: (results: ProductType[], query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ProductType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const SEARCH_API_BASE = "http://localhost:8080/search";

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(`${SEARCH_API_BASE}/${query}`);
      if (res.ok) {
        const results: ProductType[] = await res.json();
        setSuggestions(results.slice(0, 6)); // Show max 6 suggestions in navbar
        setShowSuggestions(results.length > 0);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      onSearchResults?.([], "");
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);

    try {
      const res = await fetch(`${SEARCH_API_BASE}/${query}`);
      if (res.ok) {
        const results: ProductType[] = await res.json();
        onSearchResults?.(results, query);
      } else {
        throw new Error("Search failed");
      }
    } catch (error) {
      console.error("Error searching products:", error);
      onSearchResults?.([], query);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        const selectedProduct = suggestions[selectedSuggestion];
        setSearchQuery(selectedProduct.title);
        handleSearch(selectedProduct.title);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion: ProductType) => {
    setSearchQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    onSearchResults?.([], "");
    inputRef.current?.focus();
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src="./logo.png" alt="Logo" />
        <span className="brand-name">Brand</span>
      </Link>

      {/* Location (Amazon-style) */}
      <div className="location">
        <div className="location-icon">📍</div>
        <div className="location-text">
          <span className="deliver-to">Deliver to</span>
          <span className="location-name">India</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-container" ref={searchRef}>
        <div className="search-bar">
          <select className="category-select">
            <option value="all">All</option>
            <option value="mens-shoes">Men's Shoes</option>
            <option value="womens-shoes">Women's Shoes</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
          
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="search-input"
            />
            
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>
          
          <button 
            className="search-button"
            onClick={() => handleSearch()}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="search-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="navbar-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className={`navbar-suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <img 
                  src={suggestion.thumbnail} 
                  alt={suggestion.title}
                  className="navbar-suggestion-image"
                />
                <div className="navbar-suggestion-content">
                  <div className="navbar-suggestion-title">{suggestion.title}</div>
                  <div className="navbar-suggestion-price">${suggestion.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language */}
      <div className="language">
        <div className="flag">🇺🇸</div>
        <span>EN</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {/* Account */}
      <div className="account">
        <span className="greeting">Hello, Sign in</span>
        <span className="account-lists">Account & Lists</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {/* Orders */}
      <div className="orders">
        <span className="returns">Returns</span>
        <span className="orders-text">& Orders</span>
      </div>

      {/* Cart */}
      <Link to="/cart" className="cart">
        <div className="cart-icon">
          🛒
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
        <span className="cart-text">Cart</span>
      </Link>
    </nav>
  );
};

export default Navbar;