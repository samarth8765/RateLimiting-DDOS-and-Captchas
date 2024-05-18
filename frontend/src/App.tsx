import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import axios from "axios";
import "./index.css";

function App() {
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [OTP, setOTP] = useState<string>("");
  // const [responseData, setResponseData] = useState<string>("");

  async function sendInfoToBackend() {
    try {
      console.log("Sending data to backend...");
      console.log("Password:", password);
      console.log("OTP:", OTP);
      console.log("Token:", token);

      const data = await axios.post("http://localhost:3000/reset-password", {
        email: "hola@gmail.com",
        otp: OTP,
        password: password,
        token: token,
      });

      // setResponseData(data.data);
      console.log(data.data);
    } catch (err) {
      console.error("Error occurred:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Change Your Password
          </h2>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 mb-4 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="OTP"
            className="w-full p-3 mb-6 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setOTP(e.target.value)}
          />
          <button
            onClick={() => sendInfoToBackend()}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
          >
            Change Password
          </button>
          <Turnstile
            onSuccess={(token) => setToken(token)}
            siteKey="0x4AAAAAAAaeVH3C7pQHljgS"
          />
        </div>
        {/* <div>
          {responseData && (
            <div className="bg-gray-700 p-4 rounded-lg text-white mt-4">
              <p>Server Response: {responseData}</p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default App;
