import styles from "../Styles/landing.module.css";

function Footer() {
  return (
    <>
      <footer
        style={{
          padding: "20px 0",
          backgroundColor: "#222222",
          color: "white",
        }}
        className="app-footer"
      >
        <div className="container">
          {/* Top Footer Section */}
          <div className="row">
            {/* Logo and Description */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div>
                <h3>
                  <span style={{ color: "#5266FA" }}>Smart</span>Shuttle
                </h3>
                <p className="mb-30 footer-desc">
                  Providing seamless and reliable transportation solutions
                  tailored to your needs.
                </p>
              </div>
            </div>

            {/* Booking Links */}
            <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6">
              <div>
                <h4>Book</h4>
                <ul className="list-unstyled">
                  <li>
                    <p className="text-decoration-none">Bus Ticket</p>
                  </li>                  
                </ul>
              </div>
            </div>

            {/* About Links */}
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div>
                <h4>About</h4>
                <ul className="list-unstyled">
                  <li>
                    <p className="text-decoration-none">About Us</p>
                  </li>
                  <li>
                    <p className="text-decoration-none">Contact Us</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Information Links */}
            <div className="col-xl-3 col-lg-3 col-md-6">
             
                  <li>
                    <p className="text-decoration-none">FAQ</p>
                  </li>
               
              
            </div>
          </div>

          {/* Bottom Footer Section */}
          <div className="d-flex justify-content-center mt-4">
            <div className="copyright">
              <p className={styles.companyinfo}>
                ©2024 SmartShuttle. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
