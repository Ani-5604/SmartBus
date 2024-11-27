import { useEffect } from "react";
import { useDispatch } from "react-redux";


import { default as Slider } from "../Components/Landing/Slider";
import { removeall } from "../Redux/ticket/ticket.action";

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(removeall());
  }, []);
  return (
    <>
      <Slider />
      
     
    </>
  );
}
export default Home;
