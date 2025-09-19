import React, { useState, useEffect } from "react";
import "./App.css";

interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string | null;
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
  dimensions: { id: number; width: number; height: number; depth: number };
  meta: { id: number; createdAt: string; updatedAt: string; barcode: string; qrCode: string };
  reviews: Review[];
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Your backend URL with 100 JSON objects
  const API_URL = "http://localhost:8080/home";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
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
    <div className="app">
      <header>
        <h1>🛒 Shopping App</h1>
        <p>Total Products: {products.length}</p>
      </header>

      <main>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products">
            {products.map((p) => (
              <div key={p.id} className="card">
                <img src={p.thumbnail} alt={p.title} />
                <h3>{p.title}</h3>
                <p className="desc">{p.description}</p>
                <p>
                  <b>${p.price}</b>{" "}
                  <span className="discount">-{p.discountPercentage}%</span>
                </p>
                <p>⭐ {p.rating} | Stock: {p.stock}</p>

                {/* Reviews */}
                <div className="reviews">
                  <h4>Reviews:</h4>
                  {p.reviews && p.reviews.length > 0 ? (
                    p.reviews.map((r) => (
                      <div key={r.id} className="review">
                        <p><b>{r.reviewerName}</b> ({r.rating}⭐)</p>
                        <p>{r.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
