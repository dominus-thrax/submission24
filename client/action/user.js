import axios from 'axios';
import apiConfig from '../configs/api';
// import { adminAllEvents } from './events';
import { getRegisteredEvents } from './events';

export const userLogin = async (
  values,
  type,
  dispatchUser,
  dispatchEvents
) => {
  const options = {
    method: "POST",
    url: `${apiConfig.url}/${type}/sign`,
    headers: {
      "Content-Type": "application/json",
    },
    data: values,
  };
  try {
    const res = await axios(options);
    localStorage.setItem(
      "submission",
      JSON.stringify({ token: res.data.token, type })
    );
    dispatchUser({
      type: "SET_USER",
      user: {
        ...res.data[type],
        type,
      },
    });
    getRegisteredEvents(dispatchEvents);
    return res.data[type];
  } catch (e) {
    console.log(e);
    if (e?.response) {
      return e?.response?.data;
    }
    return {
      error: "Something Went Wrong",
    };
  }
};

export const loadUser = async (dispatchUser, dispatchEvents) => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (submission) {
    const options = {
      method: "GET",
      url: `${apiConfig.url}/${submission.type}/me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${submission.token}`,
      },
    };
    try {
      const res = await axios(options);
     console.log("res:",res);
      dispatchUser({
        type: "SET_USER",
        user: {
          ...res.data[submission.type],
          type: submission.type,
        },
      });
      getRegisteredEvents(dispatchEvents)
      return {
        ...res.data[submission.type],
        type: submission.type,
      };
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

export const logout = async (
  dispatchUser,
  dispatchEvents,
) => {
  const submission = JSON.parse(localStorage.getItem("submission"));
  if (submission) {
    const options = {
      method: "DELETE",
      url: `${apiConfig.url}/${submission.type}/signout`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${submission.token}`,
      },
    };
    try {
      const res = await axios(options);
      console.log("logout res:",res);
      localStorage.removeItem("submission");
      dispatchUser({
        type: "RESET_USER",
      });
      dispatchEvents({
        type: "RESET_EVENTS",
      })
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




