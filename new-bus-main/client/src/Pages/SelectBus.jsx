import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../Styles/selectbus.module.css";
import axios from "axios";
import { AiTwotoneStar } from "react-icons/ai";
import { BiArrowFromLeft } from "react-icons/bi";
import { saveDatafilter } from "../Redux/filter/filter.action";
import { removeall } from "../Redux/ticket/ticket.action";
import Filters from "../Components/Seats/Filters";
import { useDispatch, useSelector } from "react-redux";
import { error } from "../Utils/notification";
function SelectBus() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [wentwrong, setwentwrong] = useState(false);
  const [formData, setFormData] = useState({ from: "", to: "", date: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dataredux = useSelector((state) => state.filter.data);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(removeall());
  }, []);

  useEffect(() => {
    let from = searchParams.get("from");
    let to = searchParams.get("to");
    let date = searchParams.get("date");

    if (from && to && date) {
      getdata(from, to, date);
    }
  }, [searchParams]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const { from, to, date } = formData;
    if (from && to && date) {
      setSearchParams({ from, to, date });
    } else {
      error("Please fill all fields.");
    }
  }

  async function getdata(from, to, date) {
    try {
       let res = await axios.post("http://localhost:8070/bus/getall", {
        from,
        to,
        date,
      });
      if (res.data.length === 0) {
        error("Cities Not Found. Try Mumbai To Bengaluru");
        return navigate("/");
      }
      dispatch(saveDatafilter(res.data));
      setwentwrong(false);
    } catch (error) {
      console.log(error.message);
      setwentwrong(true);
    }
  }

  async function handlebook(ele) {
  
    navigate({
      pathname: `/bookticket/${ele._id}`,
      search: `?&date=${searchParams.get("date")}`,
    });
  }

  return (
    <>
      {!searchParams.get("from") || !searchParams.get("to") || !searchParams.get("date") ? (
        <div className={styles.searchForm}>
          <h3>Search for Buses</h3>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="from"
              placeholder="From"
              value={formData.from}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="to"
              placeholder="To"
              value={formData.to}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Search</button>
          </form>
        </div>
      ) : wentwrong ? (
        <div className={styles.wrong}>
          <img src={require("../Images/404-error-page-templates.png")} alt="Error" />
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.filter}>
            <h5 style={{ textAlign: "left", marginLeft: "25px" }}>
              FILTERS
            </h5>
            <hr />
            <Filters />
            <hr />
          </div>
          <div className={styles.busdata}>
            {dataredux?.map((ele, i) => (
              <div key={i}>
                <h5>
                  {ele.companyname.charAt(0).toUpperCase() +
                    ele.companyname.slice(1)}{" "}
                  Travels
                </h5>
                <div>
                  <p>{ele.from}</p>
                  <p><BiArrowFromLeft /></p>
                  <p>{ele.to}</p>
                </div>
                <div>
                  {ele.aminites.map((e, i) => (
                    <div key={i}>
                      <p>{e}</p>
                    </div>
                  ))}
                </div>
                <hr />
                <h6>Arrival Time : {ele.arrival}</h6>
                <h6>Departure Time : {ele.departure}</h6>
                <hr />
                <h6>Email : {ele.email}</h6>
                <h6>Phone : {ele.phone}</h6>
                <hr />
                <div>
                  <h5>Price : ₹ {ele.price}</h5>
                  <h5>
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <AiTwotoneStar
                          key={i}
                          color={i < ele.rating ? "#FFED00" : "gray"}
                        />
                      ))}
                  </h5>
                </div>
                <button onClick={() => handlebook(ele)}>View Seats</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SelectBus;
