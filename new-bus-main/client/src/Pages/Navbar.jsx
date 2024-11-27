import { useNavigate } from "react-router-dom";
import { success } from "../Utils/notification";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutAPI } from "../Redux/authentication/auth.action";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../Components/context/LanguageContext"; // Assuming you have this context for language management
import '../App.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.data.token);
  const { language, changeLanguage } = useLanguage(); // Access language from context
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Welcome Message
  const userName = useSelector((state) => state.auth.data.userName); // Assuming username is stored in the auth state

  // Random Quotes
  const quotes = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "You are never too old to set another goal or to dream a new dream.",
    "Believe you can and you're halfway there.",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleLogout = () => {
    Cookies.remove("jwttoken");
    Cookies.remove("userid");
    dispatch(logoutAPI());
    navigate("/");
    success("Logout Successfully");
  };

  const toggleLanguage = (lang) => {
    changeLanguage(lang);
    setShowLanguageDropdown(false); // Close the dropdown after selecting a language
  };

  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-body-tertiary text-bg-primary">
      <div className="container-fluid">
        <a
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
        SmartShuttle 
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0">
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                {language === 'English' ? "Home" :
                 language === 'हिंदी' ? "घर" :
                 language === 'বাংলা' ? "বাড়ি" :
                 language === 'اردو' ? "گھر" :
                 language === 'मराठी' ? "घर" :
                 language === 'العربية' ? "الرئيسية" : ""}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/selectbus")}
              >
                {language === 'English' ? "Ride" :
                 language === 'हिंदी' ? "सवारी" :
                 language === 'বাংলা' ? "চরুন" :
                 language === 'اردو' ? "سفر" :
                 language === 'मराठी' ? "सवारी" :
                 language === 'العربية' ? "ركوب" : ""}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="btn btn-outline-success"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/myticket`)}
              >
                {language === 'English' ? "My Tickets" :
                 language === 'हिंदी' ? "मेरी टिकट" :
                 language === 'বাংলা' ? "আমার টিকিট" :
                 language === 'اردو' ? "میری ٹکٹ" :
                 language === 'मराठी' ? "माझे तिकिट" :
                 language === 'العربية' ? "تذاكيري" : ""}
              </a>
            </li>
          </ul>

          {/* Welcome Message */}
          <div className="navbar-text text-white">
            {token ? (
              <span>
                {language === 'English' ? `Welcome, ${userName}!` : 
                 language === 'हिंदी' ? `स्वागत है, ${userName}!` : 
                 language === 'বাংলা' ? `স্বাগতম, ${userName}!` : 
                 language === 'اردو' ? `خوش آمدید, ${userName}!` : 
                 language === 'मराठी' ? `स्वागत आहे, ${userName}!` : 
                 language === 'العربية' ? `مرحبًا, ${userName}!` : ""}
              </span>
            ) : (
              <span>{language === 'English' ? "Welcome, Guest!" : "स्वागत है, अतिथि!"}</span>
            )}
          </div>

          {/* Random Quote */}
          <div className="navbar-text text-white ml-3">
            <i>{randomQuote}</i>
          </div>

          {/* Language selector */}
          <div>
            <span
              className="nav-link language-selector"
              style={{ cursor: "pointer" }}
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <FontAwesomeIcon icon={faGlobe} className="icon" />
              {language} {/* Show current language */}
            </span>

            {/* Language dropdown */}
            {showLanguageDropdown && (
              <div className="language-dropdown">
                <div className="language-options">
                  <div className="language-buttons">
                    {['English', 'हिंदी', 'বাংলা', 'اردو', 'मराठी', 'العربية'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className="language-button"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {token ? (
              <button
                className="btn btn-outline-success"
                style={{
                  borderRadius: "10px",
                  border: "2px solid",
                  marginRight: "8px",
                  color: "white",
                }}
                onClick={() => handleLogout()}
              >
                {language === 'English' ? "Logout" :
                 language === 'हिंदी' ? "लॉग आउट" :
                 language === 'বাংলা' ? "লগ আউট" :
                 language === 'اردو' ? "لاگ آؤٹ" :
                 language === 'मराठी' ? "लॉगआउट" :
                 language === 'العربية' ? "تسجيل الخروج" : ""}
              </button>
            ) : (
              <div>
                <button
                  className="btn btn-outline-success"
                  onClick={() => navigate("/signin")}
                  style={{
                    borderRadius: "10px",
                    border: "2px solid",
                    marginRight: "8px",
                    color: "white",
                  }}
                >
                  {language === 'English' ? "Sign In" :
                   language === 'हिंदी' ? "लॉग इन करें" :
                   language === 'বাংলা' ? "লগ ইন করুন" :
                   language === 'اردو' ? "لاگ ان کریں" :
                   language === 'मराठी' ? "लॉग इन करा" :
                   language === 'العربية' ? "تسجيل الدخول" : ""}
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => navigate("/signup")}
                  style={{
                    borderRadius: "10px",
                    border: "2px solid",
                    marginRight: "8px",
                    color: "white",
                  }}
                >
                  {language === 'English' ? "Sign Up" :
                   language === 'हिंदी' ? "साइन अप करें" :
                   language === 'বাংলা' ? "সাইন আপ করুন" :
                   language === 'اردو' ? "سائن اپ کریں" :
                   language === 'मराठी' ? "साइन अप करा" :
                   language === 'العربية' ? "اشترك" : ""}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
