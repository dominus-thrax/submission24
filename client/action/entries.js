import axios from "axios";
import apiConfig from "../configs/api";

export const submitEntries = async (values, type) => {
    const submission = JSON.parse(localStorage.getItem("submission"));
    if (submission) {
        const options = {
            method: "POST",
            url: `${apiConfig.url}/${type}/post`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${submission.token}`,
            },
            data: values,
        };
        try {
            const res = await axios(options);
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
}

export const getEntries = async (type) => {
    const submission = JSON.parse(localStorage.getItem("submission"));
    if (submission) {
        const options = {
            method: "GET",
            url: `${apiConfig.url}/${type}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${submission.token}`,
            },
        };
        try {
            const res = await axios(options);
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
}

export const getLeaderboard = async (type) => {
    const submission = JSON.parse(localStorage.getItem("submission"));
    if (submission) {
        const options = {
            method: "GET",
            url: `${apiConfig.url}/${type}/leaderboard`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${submission.token}`,
            },
        };
        try {
            const res = await axios(options);
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
}