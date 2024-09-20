import axios from "axios";
import apiConfig from "../configs/api";

export const getRegisteredEvents = async (dispatchEvents) => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (submission.type === "user") {
    const options = {
      method: "GET",
      url: `${apiConfig.url}/user/user_events`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${submission.token}`,
      },
    };
    try {
      const res = await axios(options);
      console.log("res",res);
      console.log("line number 17 in get events", res.data);
      dispatchEvents({
        type: "SET_EVENTS",
        events: res.data,
      });
      return res.data;
    } catch (e) {
      console.log(e);
      if (e?.response?.data) {
        return e.response.data;
      }
      return {
        error: "Something Went Wrong",
      };
    }
  }
};
