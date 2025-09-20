import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Product.css";

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
  dimensions: Dimensions;
  meta: Meta;
  reviews: Review[];
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product details");

        // ✅ backend returns an array → take first element
        const data: ProductType[] = await res.json();
        setProduct(data[0] || null);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details">
      <Link to="/" className="back-link">⬅ Back to Products</Link>

      <div className="details-left">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="details-img"
        />
        <div className="thumbnail-list">
          {product.images.map((img, i) => (
            <img key={i} src={img} alt={`img-${i}`} />
          ))}
        </div>
      </div>

      <div className="details-right">
        <h2>{product.title}</h2>
        <p className="details-desc">{product.description}</p>
        <p>
          <b className="details-price">${product.price}</b>{" "}
          <span className="discount">-{product.discountPercentage}%</span>
        </p>
        <p>⭐ {product.rating} | Stock: {product.stock}</p>
        <p><b>Brand:</b> {product.brand}</p>
        <p><b>SKU:</b> {product.sku}</p>
        <p><b>Warranty:</b> {product.warrantyInformation}</p>
        <p><b>Return Policy:</b> {product.returnPolicy}</p>
        <p><b>Shipping:</b> {product.shippingInformation}</p>
        <p><b>Status:</b> {product.availabilityStatus}</p>

        <button className="buy-btn">Buy Now</button>
        <button className="cart-btn">Add to Cart</button>

        {/* Reviews Section */}
        <div className="reviews">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r) => (
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
    </div>
  );
};

export default ProductPage;
