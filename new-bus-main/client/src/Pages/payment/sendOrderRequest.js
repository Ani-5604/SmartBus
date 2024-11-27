import axios from "axios";
import { removeall } from "../../Redux/ticket/ticket.action";
import { success } from "../../Utils/notification";
import jsPDF from "jspdf";

export const sendOrderRequest = async (
  busdata,
  creds,
  orderId,
  response,
  date,
  ticket,
  busid,
  userid,
  amount,
  token,
  dispatch,
  navigate
) => {
  let ticketSummary = {
    date: date,
    ticket: ticket,
    amount: amount,
  };
  let userDetails = creds;

  let busDetails = {
    name: busdata[0].companyname,
    from: busdata[0].from,
    to: busdata[0].to,
    contactemail: busdata[0].email,
    contactphone: busdata[0].phone,
    arrival: busdata[0].arrival,
    departure: busdata[0].departure,
  };

  const payload = {
    busDetails,
    ticketSummary,
    paymentDetails: {
      orderId,
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
    },
    userDetails,
    bus: busid,
    user: userid,
  };

  try {
    await axios.post(" http://localhost:8070/order", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    success("Ticket Booked successfully");
    dispatch(removeall());
    
    // Generate and download ticket PDF
    generateAndDownloadTicket(busDetails, ticketSummary, userDetails, orderId);

    navigate("/");
  } catch (err) {
    console.log(err);
  }
};

const generateAndDownloadTicket = (busDetails, ticketSummary, userDetails, orderId) => {
  const doc = new jsPDF();

  // Add Ticket Header
  doc.setFontSize(18);
  doc.text("Ticket Confirmation", 20, 20);

  // Add Order ID
  doc.setFontSize(12);
  doc.text(`Order ID: ${orderId}`, 20, 30);

  // Add User Details
  doc.text("Passenger Details:", 20, 40);
  doc.text(`Name: ${userDetails.name}`, 20, 50);
  doc.text(`Email: ${userDetails.email}`, 20, 60);

  // Add Ticket Details
  doc.text("Ticket Details:", 20, 80);
  doc.text(`Date: ${ticketSummary.date}`, 20, 90);
  doc.text(`Seats: ${ticketSummary.ticket.count}`, 20, 100);
  doc.text(`Amount Paid: $${ticketSummary.amount}`, 20, 110);

  // Add Bus Details
  doc.text("Bus Details:", 20, 130);
  doc.text(`Company: ${busDetails.name}`, 20, 140);
  doc.text(`Route: ${busDetails.from} to ${busDetails.to}`, 20, 150);
  doc.text(`Departure: ${busDetails.departure}`, 20, 160);
  doc.text(`Arrival: ${busDetails.arrival}`, 20, 170);
  doc.text(`Contact: ${busDetails.contactemail}, ${busDetails.contactphone}`, 20, 180);

  // Trigger the download of the generated PDF ticket
  const fileName = `Ticket_${orderId}.pdf`;
  doc.save(fileName);

  // Notify user that the ticket has been generated and downloaded
  success("Your ticket has been generated and is ready for download.");
};
