import React from 'react';
import './WhatWeDo.css';

const WhatWeDo = () => {
  const features = [
    "WE HELP YOU IN MAKING THE RIGHT CHOICE",
    "WE GIVE YOU INFORMATION YOU CAN'T EASILY ACCESS",
    "WE SCAN THE WHOLE MARKET FOR SIMILAR CARS",
    "WE CALCULATE REPAIR COSTS AND POTENTIAL ISSUES",
    "WE GIVE YOU ADVICE ON WHAT TO LOOK FOR"
  ];

  return (
    <section className="what-we-do-section">
      <div className="content-container">
        <h2 className="section-title">WHAT WE DO?</h2>
        <div className="features-list">
          {features.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-bullet">-</div>
              <p className="feature-text">{feature}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="image-background"></div>
    </section>
  );
};

export default WhatWeDo;