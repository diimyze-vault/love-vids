import { useState } from 'react';

export function Testimonials() {
  const reviews = [
    { name: "Tyler F.", comment: "My gf literally cried. Best gift I ever gave.", rating: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/seed/tyler/50/50" },
    { name: "Jessica K.", comment: "The 'Love Roast' mode used our inside jokes perfectly. 10/10.", rating: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/seed/jessic/50/50" },
    { name: "Marcus", comment: "So fast and actually looks high effort. Saved my anniversary.", rating: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/seed/marcus/50/50" }
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2 className="section-title">Wall of Love 💖</h2>
        <p className="section-subtitle">Real stories, real vibes.</p>
      </div>
      <div className="reviews-grid">
        {reviews.map((review, i) => (
          <div className="review-card-modern" key={i}>
            <div className="review-quote-icon">“</div>
            <p className="review-text-modern">{review.comment}</p>
            <div className="review-footer-modern">
               <img src={review.img} alt={review.name} className="reviewer-img-large" />
               <div className="reviewer-info">
                 <span className="reviewer-name">{review.name}</span>
                 <span className="reviewer-rating">{review.rating}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Pricing({ onCreateClick }: { onCreateClick: () => void }) {
  const [currency, setCurrency] = useState('INR');

  const prices = {
    INR: { symbol: '₹', rates: [249, 499, 999] },
    USD: { symbol: '$', rates: [2.99, 5.99, 11.99] },
    EUR: { symbol: '€', rates: [2.99, 5.49, 10.99] },
    GBP: { symbol: '£', rates: [2.49, 4.99, 9.99] }
  };

  const current = prices[currency as keyof typeof prices];

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-header">
         <h2 className="section-title">Transparent Pricing</h2>
         <p className="section-subtitle">
            Pay only for the resolution & duration you need. Persistent storage included. <br />
            <span className="referral-hint">✨ Invite friends to earn free videos!</span>
         </p>
      </div>
      
      <div className="currency-selector-wrapper">
        <div className="currency-selector">
          <span>Displaying in: </span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR">🇮🇳 INR (₹)</option>
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="EUR">🇪🇺 EUR (€)</option>
            <option value="GBP">🇬🇧 GBP (£)</option>
          </select>
        </div>
      </div>

      <div className="pricing-grid">
        <div className="price-card-glass">
          <div className="price-header">
            <h3>Quick Clip</h3>
            <div className="price">{current.symbol}{current.rates[0]}</div>
          </div>
          <div className="price-specs">
            <div className="spec-item">
              <span className="spec-label">Quality</span>
              <span className="spec-value">720p HD</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Duration</span>
              <span className="spec-value">15 Seconds</span>
            </div>
          </div>
          <button className="price-btn outline" onClick={onCreateClick}>Create Snippet</button>
        </div>

        <div className="price-card-glass popular">
          <div className="popular-badge">BEST VALUE</div>
          <div className="price-header">
            <h3>Full Story</h3>
            <div className="price">{current.symbol}{current.rates[1]}</div>
          </div>
          <div className="price-specs">
            <div className="spec-item">
              <span className="spec-label">Quality</span>
              <span className="spec-value highlight">1080p FHD</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Duration</span>
              <span className="spec-value highlight">60 Seconds</span>
            </div>
          </div>
          <button className="price-btn primary" onClick={onCreateClick}>Create Story</button>
        </div>

        <div className="price-card-glass">
           <div className="price-header">
            <h3>Cinematic</h3>
            <div className="price">{current.symbol}{current.rates[2]}</div>
          </div>
          <div className="price-specs">
            <div className="spec-item">
              <span className="spec-label">Quality</span>
              <span className="spec-value gradient-text-sm">4K UHD</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Duration</span>
              <span className="spec-value gradient-text-sm">120 Seconds</span>
            </div>
          </div>
          <button className="price-btn outline" onClick={onCreateClick}>Create Epic</button>
        </div>
      </div>
    </section>
  );
}
