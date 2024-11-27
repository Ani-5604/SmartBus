import { useEffect, useState } from "react";
import styles from "../../Styles/landing.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { error } from "../../Utils/notification";
import { useLanguage } from "../context/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../App.css';
import { faMapMarkerAlt, faArrowRight, faGlobe } from '@fortawesome/free-solid-svg-icons';
function Slider() {

  const [hover, sethover] = useState(false);
  const [source, setsource] = useState("");
  const [destination, setdestination] = useState("");
  const [date, setdate] = useState("");
  const [showName, setShowNames] = useState(false);
  const [showNamedes, setShowNamesdes] = useState(false);
  const [output, setOutput] = useState([]);
  const [outputdes, setOutputdes] = useState([]);
  const [dateinfo, setdateinfo] = useState({});
  const [cityClicked, setCityclicked] = useState(false);
  const [CityDesclicked, setCityDesclicked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage(); // Use language context
  const toggleSignupOptions = () => {
    setShowSignupOptions((prev) => !prev);
  };

  const toggleLanguage = (lang) => {
    changeLanguage(lang);
    setShowLanguageDropdown(false); // Close the dropdown after selecting a language
  };
 

  // Quotes relevant to the Smart Bus App in different languages
  const quotes = {
    English: [
      "The bus is a vehicle of change.",
      "Innovation is the key to the future of public transport.",
      "Sustainable transport is the future of our cities.",
      "Every journey begins with a single step; let that step be smarter.",
      "Technology is best when it brings people together."
    ],
    हिंदी: [
      "बस परिवर्तन का एक साधन है।",
      "नवाचार सार्वजनिक परिवहन के भविष्य की कुंजी है।",
      "सतत परिवहन हमारे शहरों का भविष्य है।",
      "हर यात्रा एक छोटे से कदम से शुरू होती है; उस कदम को स्मार्ट बनाएं।",
      "तकनीक सबसे अच्छी होती है जब यह लोगों को एक साथ लाती है।"
    ],
    বাংলা: [
      "বাস পরিবর্তনের একটি বাহন।",
      "নবায়ন হল জনপরিবহণের ভবিষ্যতের চাবিকাঠি।",
      "স্থায়ী পরিবহন আমাদের শহরের ভবিষ্যৎ।",
      "প্রত্যেকটি যাত্রা একটি ছোট পদক্ষেপ দিয়ে শুরু হয়; সেই পদক্ষেপটি স্মার্ট হোক।",
      "প্রযুক্তি সবচেয়ে ভাল যখন এটি মানুষের মধ্যে সংযোগ স্থাপন করে।"
    ],
    اردو: [
      "بس تبدیلی کا ایک ذریعہ ہے۔",
      "جدت عوامی نقل و حمل کے مستقبل کی چابی ہے۔",
      "پائیدار نقل و حمل ہمارے شہروں کا مستقبل ہے۔",
      "ہر سفر ایک چھوٹے قدم سے شروع ہوتا ہے؛ اس قدم کو ذہین بنائیں۔",
      "ٹیکنالوجی بہترین ہوتی ہے جب یہ لوگوں کو اکٹھا لاتی ہے۔"
    ],
    मराठी: [
      "बस बदलाची एक गाडी आहे.",
      "नवीनता सार्वजनिक परिवहनाच्या भविष्याची चावी आहे.",
      "सतत परिवहन आपल्या शहरांचे भविष्य आहे.",
      "प्रत्येक यात्रा एका छोट्या पायऱ्यापासून सुरू होते; ती पायरी स्मार्ट बनवा.",
      "तंत्रज्ञान तेव्हा सर्वात चांगले असते जेव्हा ते लोकांना एकत्र आणते."
    ],
    العربية: [
      "الحافلة وسيلة للتغيير.",
      "الابتكار هو مفتاح مستقبل النقل العام.",
      "النقل المستدام هو مستقبل مدننا.",
      "تبدأ كل رحلة بخطوة واحدة؛ اجعل تلك الخطوة أكثر ذكاءً.",
      "التكنولوجيا هي الأفضل عندما تجمع الناس معًا."
    ]
  };

  const randomQuote = quotes[language][Math.floor(Math.random() * quotes[language].length)];

  useEffect(() => {
    let mindate = new Date().toISOString().split("T")[0];
    let maxdate = new Date().toISOString().split("T")[0];
    setdate(mindate);
    setdateinfo({
      ...dateinfo,
      mindate: mindate,
      maxdate: maxdate,
    });
  }, []);

  useEffect(() => {
    if (source === "") {
      setShowNames(false);
      return;
    }
    if (cityClicked === true) {
      setCityclicked(false);
      return;
    }
    let timerID = setTimeout(() => {
      handleGetRequest();
    }, 1000);

    return () => {
      clearTimeout(timerID);
    };
  }, [source]);

  useEffect(() => {
    if (destination === "") {
      setShowNamesdes(false);
      return;
    }
    if (CityDesclicked === true) {
      setCityDesclicked(false);
      return;
    }
    let timerID = setTimeout(() => {
      handleGetRequestdes();
    }, 1000);

    return () => {
      clearTimeout(timerID);
    };
  }, [destination]);

  const handleGetRequest = async () => {
    try {
      let res = await axios.post("http://localhost:8070/city", {
        source,
      });
      res = res.data;
      setOutput(res);
      setShowNames(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetRequestdes = async () => {
    try {
      let res = await axios.post("http://localhost:8070/city", {
        destination,
      });
      res = res.data;
      setOutputdes(res);
      setShowNamesdes(true);
    } catch (err) {
      console.log(err);
    }
  };

  function handelhover() {
    sethover(true);
  }

  function handelhoverout() {
    sethover(false);
  }

  function handleclicked() {
    if (date === "" || destination === "" || source === "") {
      error("Please Fill All The Details");
      return;
    }
    if (source === destination) {
      error("Source And Destination Can't Be Same");
      return;
    }
    setsource("");
    getcityinfo(source, destination, date);
  }

  async function getcityinfo(source, destination, date) {
    try {
      let res = await axios.post("http://localhost:8070/city/showcity", {
        source,
        destination,
        date,
      });
      if (res.data.status === "success") {
        navigate({
          pathname: "/selectbus",
          search: `?from=${source}&to=${destination}&date=${date}`,
        });
      } else {
        setsource("");
        setdestination("");
        error("City Not Found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handlecityclicked(name) {
    setCityclicked(true);
    setsource(name);
    setShowNames(false);
  }

  function handlecityclicked1(name) {
    setCityDesclicked(true);
    setdestination(name);
    setShowNamesdes(false);
  }

  function handledateclicked() {
    setShowNamesdes(false);
    setShowNames(false);
  }

  return (
    <>
      <div className={styles.Carousel}>
        {/* Header with dynamic quote */}
        <Header quote={randomQuote} />
        <nav className="nav-container">
   

          <Link to="/help" className="nav-link">{language === 'English' ? "Help" :
            language === 'हिंदी' ? "मदद" :
            language === 'বাংলা' ? "সাহায্য" :
            language === 'اردو' ? "مدد" :
            language === 'मराठी' ? "साहाय्य" :
            language === 'العربية' ? "مساعدة" :
            ""}</Link>

          <Link to="/selectbus" className="nav-link">{language === 'English' ? "Ride" :
            language === 'हिंदी' ? "सवारी" :
            language === 'বাংলা' ? "চরুন" :
            language === 'اردو' ? "سفر" :
            language === 'मराठी' ? "सवारी" :
            language === 'العربية' ? "ركوب" :
            ""}</Link>

        
          <Link to="/Signin" className="nav-link">{language === 'English' ? "Log in" :
            language === 'हिंदी' ? "लॉग इन करें" :
            language === 'বাংলা' ? "লগ ইন করুন" :
            language === 'اردو' ? "لاگ ان کریں" :
            language === 'मराठी' ? "लॉग इन करा" :
            language === 'العربية' ? "تسجيل الدخول" :
            ""}</Link>

          <span className="nav-link" onClick={toggleSignupOptions}>{language === 'English' ? "Sign up" :
            language === 'हिंदी' ? "साइन अप करें" :
            language === 'বাংলা' ? "সাইন আপ করুন" :
            language === 'اردو' ? "سائن اپ کریں" :
            language === 'मराठी' ? "साइन अप करा" :
            language === 'العربية' ? "اشترك" :
            ""}</span>
        </nav>
 

        {/* Signup Options Dropdown */}
        {showSignupOptions && (
          <div className="signup-options-container">
            <Link to="/register" className="signup-card">
              <div className="card-content">
                <h3>{language === 'English' ? "Sign up to drive & deliver" :
                  language === 'हिंदी' ? "ड्राइव और डिलीवर करने के लिए साइन अप करें" :
                  language === 'বাংলা' ? "ড্রাইভ এবং ডেলিভারির জন্য সাইন আপ করুন" :
                  language === 'اردو' ? "چلانے اور ڈیلیور کرنے کے لیے سائن اپ کریں" :
                  language === 'मराठी' ? "ड्राईव्ह आणि डिलीव्हर करण्यासाठी साइन अप करा" :
                  language === 'العربية' ? "قم بالتسجيل للقيادة والتوصيل" :
                  ""}</h3>
                <span className="arrow">→</span>
              </div>
            </Link>
            <Link to="/Signup" className="signup-card">
              <div className="card-content">
                <h3>{language === 'English' ? "Create a rider account" :
                  language === 'हिंदी' ? "राइडर खाता बनाएं" :
                  language === 'বাংলা' ? "রাইডার অ্যাকাউন্ট তৈরি করুন" :
                  language === 'اردو' ? "ایک راڈر اکاؤنٹ بنائیں" :
                  language === 'मराठी' ? "राइडर खाता तयार करा" :
                  language === 'العربية' ? "أنشئ حساب راكب" :
                  ""}</h3>
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>
        )}
        {/* Carousel component */}
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="3000">
              <img
                src={require("../../Images/photo-1590523277543-a94d2e4eb00b.avif")}
                className="object-fit-cover"
                style={{ height: "75vh", width: "100%" }}
                alt="..."
                onMouseOver={handelhover}
                onMouseLeave={handelhoverout}
              />
            </div>
            <div className="carousel-item" data-bs-interval="3000">
              <img
                src={require("../../Images/photo-1686823868715-cd44da513b9b.avif")}
                className="object-fit-cover"
                style={{ height: "75vh", width: "100%" }}
                alt="..."
                onMouseOver={handelhover}
                onMouseLeave={handelhoverout}
              />
            </div>
            <div className="carousel-item" data-bs-interval="3000">
              <img
                src={require("../../Images/pexels-spencphoto-19518922.avif")}
                className="object-fit-cover"
                style={{ height: "75vh", width: "100%" }}
                alt="..."
                onMouseOver={handelhover}
                onMouseLeave={handelhoverout}
              />
            </div>
          </div>
          {/* Carousel navigation controls */}
          {hover && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="prev"
                onMouseOver={handelhover}
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="next"
                onMouseOver={handelhover}
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>

        <div className={styles.data}>
          <input
            type="text"
            placeholder={language === 'English' ? "From" :
              language === 'हिंदी' ? "से" :
              language === 'বাংলা' ? "থেকে" :
              language === 'اردو' ? "سے" :
              language === 'मराठी' ? "पासून" :
              language === 'العربية' ? "من" :
              ""}
             
            value={source}
            onChange={(e) => {
              setsource(e.target.value);
              setShowNamesdes(false);
            }}
            className={styles.inputsource}
          />
          {showName && output.length !== 0 && (
            <div className={styles.names}>
              {output?.map((item, i) => (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handlecityclicked(item.name)}
                  key={i}
                >
                  <h6 style={{ paddingTop: "5px", paddingLeft: "5px" }}>
                    {item.name},{item.state}
                  </h6>
                  <hr />
                </div>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder={language === 'English' ? "To" :
              language === 'हिंदी' ? "तक" :
              language === 'বাংলা' ? "এখন" :
              language === 'اردو' ? "تک" :
              language === 'मराठी' ? "पर्यंत" :
              language === 'العربية' ? "إلى" :
              ""}
            value={destination}
            onChange={(e) => {
              setdestination(e.target.value);
              setShowNames(false);
            }}
            className={styles.inputsource1}
          />
          {showNamedes && outputdes.length !== 0 && (
            <div className={styles.names1}>
              {outputdes?.map((item, i) => (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handlecityclicked1(item.name)}
                  key={i}
                >
                  <h6 style={{ paddingTop: "5px", paddingLeft: "5px" }}>
                    {item.name},{item.state}
                  </h6>
                  <hr />
                </div>
              ))}
            </div>
          )}
          <input
            type="date"
            value={date}
            min={dateinfo.mindate}
            onChange={(e) => setdate(e.target.value)}
            onClick={() => handledateclicked()}
          />
          <button onClick={handleclicked}>Search</button>
        </div>
      </div>
    </>
  );
}

function Header({ quote }) {
  const { language } = useLanguage(); // Access language from context
  return (
    <header className="app-header">
      <h1>{language === 'English' ? "WELCOME to the SmartShuttle App" :
        language === 'हिंदी' ? "स्मार्ट शटल ऐप में आपका स्वागत है" :
        language === 'বাংলা' ? "স্মার্টশাটল অ্যাপে স্বাগতম" :
        language === 'اردو' ? "اسمارٹ شٹل ایپ میں خوش آمدید" :
        language === 'मराठी' ? "स्मार्ट शटल अॅपमध्ये तुमचे स्वागत आहे" :
        language === 'العربية' ? "مرحبًا بكم في تطبيق SmartShuttle" :
        ""}</h1>
      <blockquote className="quote">
        <p>&quot;{quote}&quot;</p> {/* Escape quotes */}
      </blockquote>
    </header>
  );
}

export default Slider; 