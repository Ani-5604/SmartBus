import React, { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";
import axios from "axios";
import { logoutAPI } from "../Redux/authentication/auth.action";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { error, success } from "../Utils/notification";
import { BiArrowFromLeft } from "react-icons/bi";
import styles from "../Styles/myticket.module.css";

function Myticket() {
  const [ticketsData, setTicketsData] = useState({
    allTickets: [],
    today: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userid = Cookies.get("userid");
    if (!userid) {
      navigate("/");
      return;
    }
    fetchTicketsData(userid);
    success("IMP NOTE: You Can Cancel Ticket One Day Before Journey");
  }, []);

  const fetchTicketsData = useCallback(async (userId) => {
    setLoading(true);
    try {
      const [allTicketsRes, todayRes, upcomingRes, pastRes] = await Promise.all([
        axios.post("http://localhost:8070/order/myticket", { id: userId }),
        axios.post("http://localhost:8070/order/myticket/today", { id: userId }),
        axios.post("http://localhost:8070/order/myticket/upcoming", { id: userId }),
        axios.post("http://localhost:8070/order/myticket/past", { id: userId })
      ]);

      setTicketsData({
        allTickets: allTicketsRes.data,
        today: todayRes.data,
        upcoming: upcomingRes.data,
        past: pastRes.data
      });
    } catch (error) {
      handleSessionError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSessionError = (error) => {
    console.log(error);
    error("Session Expired. Please Sign In Again.");
    dispatch(logoutAPI());
    navigate("/");
    Cookies.remove("jwttoken");
    Cookies.remove("userid");
    Cookies.remove("usergender");
  };

  const handleCancelTicket = (ticketId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (confirmCancel) {
      setTicketsData((prevData) => ({
        ...prevData,
        today: prevData.today.map((ticket) =>
          ticket.ticketSummary.id === ticketId
            ? { ...ticket, canceled: true }
            : ticket
        ),
        upcoming: prevData.upcoming.map((ticket) =>
          ticket.ticketSummary.id === ticketId
            ? { ...ticket, canceled: true }
            : ticket
        )
      }));
      success("Ticket Cancelled Successfully");
    } else {
      error("Ticket cancellation was aborted.");
    }
  };

  const handleRemoveTicket = (ticketId) => {
    setTicketsData((prevData) => ({
      ...prevData,
      today: prevData.today.filter((ticket) => ticket.ticketSummary.id !== ticketId),
      upcoming: prevData.upcoming.filter((ticket) => ticket.ticketSummary.id !== ticketId)
    }));
    success("Ticket Removed Successfully");
  };

  const handleDownload = (ticket) => {
    const { ticketSummary, busDetails } = ticket;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Bus Ticket", 105, 20, null, null, "center");

    doc.setLineWidth(0.5);
    doc.rect(10, 30, 190, 270);

    doc.setFillColor(33, 150, 243);
    doc.rect(10, 30, 190, 20, "F");

    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(busDetails.name, 105, 40, null, null, "center");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Ticket ID: ${ticketSummary.id}`, 15, 60);
    doc.text(`Payment ID: ${ticketSummary.paymentId}`, 15, 75);
    doc.text(`From: ${busDetails.from}`, 15, 90);
    doc.text(`To: ${busDetails.to}`, 15, 105);
    doc.text(`Departure: ${busDetails.departure}`, 15, 120);
    doc.text(`Arrival: ${busDetails.arrival}`, 15, 135);
    doc.text(`Seat No: ${ticketSummary.ticket}`, 15, 150);
    doc.text(`Amount: INR ${ticketSummary.amount}`, 15, 165);
    doc.text(`Date of Journey: ${ticketSummary.date.split("T")[0]}`, 15, 180);

    doc.setFillColor(240, 240, 240);
    doc.rect(10, 185, 190, 30, "F");
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text("Fare Details", 15, 200);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing us! Safe Travels.", 105, 260, null, null, "center");

    doc.save(`Ticket_${ticketSummary.id}.pdf`);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={() => fetchTicketsData(Cookies.get("userid"))}
              >
                Today's Tickets
              </button>
              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Upcoming Tickets
              </button>
              <button
                className="nav-link"
                id="nav-contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-contact"
                type="button"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                Past Tickets
              </button>
            </div>
          </nav>

          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
              <TicketList tickets={ticketsData.today} handleCancel={handleCancelTicket} handleRemove={handleRemoveTicket} handleDownload={handleDownload} />
            </div>
            <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
              <TicketList tickets={ticketsData.upcoming} handleCancel={handleCancelTicket} handleRemove={handleRemoveTicket} handleDownload={handleDownload} />
            </div>
            <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
              <TicketList tickets={ticketsData.past} handleCancel={handleCancelTicket} handleRemove={handleRemoveTicket} handleDownload={handleDownload} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TicketList({ tickets, handleCancel, handleRemove, handleDownload }) {
  return (
    <div className={styles.busdata}>
      {tickets?.map((ticket) => {
        const isCanceled = ticket.canceled;
        return (
          <div
            key={ticket.ticketSummary.id}
            className={`${styles.ticketContainer} ${isCanceled ? styles.canceled : ""}`}
          >
            <h5>{ticket?.busDetails.name.charAt(0).toUpperCase() + ticket?.busDetails.name.slice(1)} Travels</h5>
            <div>
              <p>{ticket?.busDetails.from}</p>
              <p><BiArrowFromLeft /></p>
              <p>{ticket?.busDetails.to}</p>
            </div>
            <hr />
            <h6>Arrival Time: {ticket.busDetails.arrival}</h6>
            <h6>Departure Time: {ticket.busDetails.departure}</h6>
            <hr />
            <h6>Email: {ticket?.busDetails.contactemail}</h6>
            <h6>Phone: {ticket?.busDetails.contactphone}</h6>
            <hr />
            <h6>Date of Journey: {ticket?.ticketSummary.date.split("T")[0]}</h6>
            <hr />
            <div>
              {!isCanceled && (
                <>
                  <button
                    className={styles.btn}
                    onClick={() => handleCancel(ticket.ticketSummary.id)}
                  >
                    Cancel Ticket
                  </button>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => handleDownload(ticket)}
                  >
                    Download Ticket
                  </button>
                </>
              )}
              {isCanceled && (
                <>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(ticket.ticketSummary.id)}
                  >
                    Remove Ticket
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Myticket;
