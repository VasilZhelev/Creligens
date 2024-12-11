import { useState } from 'react';
import './App.css';

function App() {
  const [link, setLink] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckVehicle = () => {
    setIsLoading(true);

    // Simulating the result fetching process
    setTimeout(() => {
      setResult({
        authenticity: 'Authentic',
        description: 'Matches',
        damage: 'No major damages',
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>SmartCarCheck</h1>
        <nav>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>SmartCarCheck</h2>
          <p>
            Your go-to solution for verifying car authenticity, matching descriptions, and detecting damages.
          </p>
          <div className="url-input">
            <input
              type="text"
              placeholder="Enter mobile.bg car link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <button onClick={handleCheckVehicle} disabled={!link || isLoading}>
              {isLoading ? 'Checking...' : 'Check Vehicle'}
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://imgs.search.brave.com/RTQftDcW6gtNTXe5r0BR-itQ9vZLhFcz9oSmGgrTuEM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dHV2LmNvbS9jb250/ZW50LW1lZGlhLWZp/bGVzL21hc3Rlci1j/b250ZW50L3NlcnZp/Y2VzL21vYmlsaXR5/L20wNC1lbmdpbmVl/cmluZy1hbmQtdHlw/ZS1hcHByb3ZhbC8x/ODQ5LXR1di1yaGVp/bmxhbmQtYWRvbWVh/LW1pa28vZ2FsbGVy/eS9hZG9tZWEtdjA2/LTAwLjAxLjE1LjA4/LWVuX2NvcmVfOF8z/LmpwZw" alt="Hero Car" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About SmartCarCheck</h2>
        <p>
          SmartCarCheck is a web app designed to help users verify the authenticity of cars, match descriptions with reality, and detect any external damages, all powered by advanced image recognition.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Our Features</h2>
        <div className="cards">
          <div className="card">
            <h3>Authenticity Check</h3>
            <p>Verify the legitimacy of car listings instantly.</p>
          </div>
          <div className="card">
            <h3>Description Match</h3>
            <p>Ensure the car matches the seller’s description.</p>
          </div>
          <div className="card">
            <h3>Damage Detection</h3>
            <p>Identify any major damages using image recognition.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Enter a mobile.bg car link into the input field above.</li>
          <li>Our system analyzes the car's details and images.</li>
          <li>Receive an instant report on authenticity, description accuracy, and damages.</li>
        </ol>
      </section>

      {/* Results Section */}
      {result && (
        <section className="results">
          <h2>Results:</h2>
          <p><strong>Authenticity:</strong> {result.authenticity}</p>
          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Damage:</strong> {result.damage}</p>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>SmartCarCheck © 2024 | Designed with care</p>
        <p>
          <a href="#contact">Contact Us</a> | <a href="#privacy">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
