import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";

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
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res);
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
        <p className="text-xl text-gray-600">Activating your account...</p>
      ) : error ? (
        <p className="text-xl text-red-600">Your token is expired!</p>
      ) : (
        <div className="text-center">
          <p className="text-xl text-green-600 mb-4">Your account has been created successfully!</p>
          <p className="text-gray-500">Redirecting to login page...</p>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
