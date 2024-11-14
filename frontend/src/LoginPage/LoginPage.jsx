import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../actions/user.action";
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login attempt with:", username, password); // Log saat login dicoba
        try {
            const response = await login(username, password);
            if (response.success) {
                console.log("Login successful", response); // Log saat login berhasil
                alert("Login successful!");
                localStorage.setItem("username", username);
                navigate("/home"); 
            } else {
                console.log("Login failed", response); // Log jika login gagal
                alert("Login failed!");
            }
        } catch (error) {
            console.error("Error during login:", error); // Log jika ada error di login
        }
    };

    console.log("Rendering LoginPage component"); // Log saat komponen LoginPage dirender

    return (
        <div className="login-page">
            <header>
                <h1>LET'S DO IT</h1>
            </header>
            <div className="login-box">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Username <span>*</span></label>
                    <input type="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <label htmlFor="password">Password <span>*</span></label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit" className="login-button">LOGIN</button>
                </form>
                <p className="font">Don't have an account yet? Register Now</p>
            </div>
        </div>
    );
};

export default LoginPage;
