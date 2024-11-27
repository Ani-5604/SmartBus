import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { error, success } from "../Utils/notification";  // Assuming you have these notification utility functions

function Signup() {
  const initialData = {
    email: "",
    password: "",
    gender: "",
  };
  
  const [signUpcreds, setsignUpcreds] = useState(initialData);
  const [showpassword, setshowpassword] = useState(false);
  const navigate = useNavigate();

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    setsignUpcreds({
      ...signUpcreds,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      signUpcreds.email === "" ||
      signUpcreds.password === "" ||
      signUpcreds.gender === ""
    ) {
      error("Please fill all the details");
    } else {
      try {
        let response = await axios.post(
          "http://localhost:8070/user/signup",  // Ensure this matches your backend URL
          signUpcreds
        );
        console.log(response);
        if (response.data.status === "Failed") {
          error(response.data.message);
        } else {
          navigate("/signin");
          success(response.data.message);
        }
      } catch (error) {
        console.log(error);
        error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h1 className="h3 mb-3 fw-bold">Sign Up</h1>
      <div>
        <p style={{ textAlign: "left", marginBottom: "0px" }}>Email</p>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email address"
          name="email"
          onChange={hanldeChange}
        />
      </div>
      
      <p style={{ textAlign: "left", marginBottom: "0px" }}>Password</p>
      <div className="input-group mb-3">
        <input
          type={showpassword ? "text" : "password"}
          className="form-control"
          placeholder="Enter Your Password"
          name="password"
          onChange={hanldeChange}
        />
        <span
          className="input-group-text"
          style={{ cursor: "pointer" }}
          onClick={() => setshowpassword(!showpassword)}
        >
          {showpassword ? <AiFillEye /> : <AiFillEyeInvisible />}
        </span>
      </div>

      <select
        name="gender"
        onChange={hanldeChange}
        className="form-select"
      >
        <option value="">Select Your Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <button
        className="w-100 mt-3 btn btn-lg btn-primary"
        onClick={handleSubmit}
      >
        Sign up
      </button>

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <p>
          Already a user?{" "}
          <Link to="/signin" style={{ paddingLeft: 8, textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
