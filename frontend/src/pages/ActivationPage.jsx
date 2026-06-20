import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";
import { FaSpinner } from "react-icons/fa";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } catch (err) {
          console.error(err);
          setError(true);
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, [activation_token, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <FaSpinner className="animate-spin text-blue-600 text-2xl" />
          <p className="text-xl text-gray-600">Activating your account...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-xl text-red-600 mb-2">Your token is invalid or expired!</p>
          <p className="text-gray-600">Please try signing up again</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-green-600 mb-2">Your account has been created successfully!</p>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
