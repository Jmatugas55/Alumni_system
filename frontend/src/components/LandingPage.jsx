import { Link } from "react-router-dom";
import '../css/OverallStyle.css'

function LandingPage () {
  return (
    <div className="landing-container">
      <header className="hero">
        <h1>Welcome to the Alumni System</h1>
        <p>Stay connected with your alma mater and fellow alumni.</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-outline">Register</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      </header>

      <section className="about">
        <h2>About Our Alumni Community</h2>
        <p>We provide a platform for alumni to connect, network, and explore career opportunities.</p>
      </section>

      <footer className="footer">
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', }}>
            <Link
              to="/contactus"
              className="alumni_dashboard_sidebar_link"
              style={{
                textDecoration: 'none',
                backgroundColor: '#ffc0cb',
                width: '120px',
                padding: '10px',
                borderRadius: '5px',
                color: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px'
              }}
            >
              Contact Us
                </Link>
                <Link
              to="/aboutus"
              className="alumni_dashboard_sidebar_link"
              style={{
                textDecoration: 'none',
                backgroundColor: '#ffc0cb',
                width: '120px',
                padding: '10px',
                borderRadius: '5px',
                color: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              About us
                </Link>
          </div>

        <p>&copy; {new Date().getFullYear()} Alumni Network. All rights reserved.</p>
        </footer>
       </div>
  );
};

export default LandingPage;
