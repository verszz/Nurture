import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../actions/user.action";
import styles from './LoginPage.module.css'

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

    const handleRegister = () => {
        navigate('/register');
    };

    console.log("Rendering LoginPage component"); // Log saat komponen LoginPage dirender

    return (
        <div className={styles.loginPage}>
        <header className={styles.header}>
            <h1>NURTURE</h1>
        </header>
        <div className={styles.loginBox}>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username <span>*</span></label>
                <input type="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <label htmlFor="password">Password <span>*</span></label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit" className={styles.loginButton}>LOGIN</button>
            </form>
            <p className={styles.font}>Don't have an account yet? <button className={styles.loginButton} onClick={handleRegister}>Register Now</button></p>
        </div>
    </div>
    );
};

export default LoginPage;
