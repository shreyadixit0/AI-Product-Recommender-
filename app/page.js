"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, XCircle, Moon, Sun } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAiFiltered, setIsAiFiltered] = useState(false);
  const [theme, setTheme] = useState("light");

  // Sync theme to body tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setDisplayedProducts(data.recommendations);
      setIsAiFiltered(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setDisplayedProducts([]);
    setIsAiFiltered(false);
    setError("");
  };

  return (
    <>
      {/* Animated Tech Background */}
      <div className="tech-background"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <main className="container">
        <header className="header">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          
          <h1>AI Recommender</h1>
          <p>Find exactly what you need with the power of AI.</p>
          
          <div style={{ marginTop: '1.5rem' }}>
            <button 
              className="btn" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: currency === 'USD' ? 'var(--primary)' : 'transparent', color: currency === 'USD' ? '#fff' : 'var(--text-main)', border: '1px solid var(--primary)', boxShadow: 'none' }}
              onClick={() => setCurrency('USD')}
            >
              USD ($)
            </button>
            <button 
              className="btn" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginLeft: '0.5rem', background: currency === 'INR' ? 'var(--primary)' : 'transparent', color: currency === 'INR' ? '#fff' : 'var(--text-main)', border: '1px solid var(--primary)', boxShadow: 'none' }}
              onClick={() => setCurrency('INR')}
            >
              INR (₹)
            </button>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form className="search-section" onSubmit={handleSearch}>
          <input
            type="text"
            className="input-field"
            placeholder="E.g., I want a phone under 15000..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn" disabled={loading || !query}>
            <Sparkles size={18} />
            {loading ? "Analyzing..." : "Recommend"}
          </button>
          {isAiFiltered && (
            <button type="button" className="btn reset-btn" onClick={handleReset} disabled={loading}>
              <XCircle size={18} />
              Reset
            </button>
          )}
        </form>

        {loading ? (
          <div className="loading-indicator">Processing Request through Neural Network...</div>
        ) : (
          <div className="products-grid">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image || `https://tse1.mm.bing.net/th?q=${encodeURIComponent(product.name + ' product photography')}&w=500&h=500&c=7`} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1rem', backgroundColor: '#fff' }} />
                  <div className="product-category">{product.category}</div>
                  <h2 className="product-title">{product.name}</h2>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <div className="product-price">
                      {currency === 'INR' ? `₹${Math.round(product.price * 83).toLocaleString('en-IN')}` : `$${product.price}`}
                    </div>
                    <button 
                      className="btn btn-view" 
                      style={{ padding: "0.5rem 1.5rem", fontSize: "0.95rem" }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)", fontSize: "1.2rem" }}>
                {isAiFiltered ? "No products found matching your criteria. Try adjusting your request." : "Ask the AI for any real-world product, and it will search and generate the results for you!"}
              </div>
            )}
          </div>
        )}

        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>
                <XCircle size={28} />
              </button>
              
              <div className="modal-image-placeholder" style={{ background: 'none', padding: 0 }}>
                <img src={selectedProduct.image || `https://tse1.mm.bing.net/th?q=${encodeURIComponent(selectedProduct.name + ' product photography')}&w=800&h=500&c=7`} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px', backgroundColor: '#fff' }} />
              </div>

              <div className="modal-header">
                <div className="modal-category">{selectedProduct.category}</div>
                <h2 className="modal-title">{selectedProduct.name}</h2>
              </div>
              
              <p className="modal-desc">{selectedProduct.description}</p>
              
              <div className="modal-footer">
                <div className="modal-price">
                  {currency === 'INR' ? `₹${Math.round(selectedProduct.price * 83).toLocaleString('en-IN')}` : `$${selectedProduct.price}`}
                </div>
                <button className="btn btn-buy">
                  <Sparkles size={18} />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
