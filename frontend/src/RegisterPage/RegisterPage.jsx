import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../actions/user.action";
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State untuk pesan error
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Register attempt with:", username, password);
        setErrorMessage(""); // Reset error sebelum mencoba register
        try {
            const response = await signup(username, password);
            if (response.success) {
                console.log("Register successful", response);
                alert("Register successful!");
                localStorage.setItem("username", username);
                navigate("/home");
            } else {
                console.log("Register failed", response);
                setErrorMessage(response.message || "Register failed!"); // Set pesan error dari respons
            }
        } catch (error) {
            console.error("Error during register:", error);
            setErrorMessage(error.message || "An error occurred during registration."); // Set pesan error dari exception
        }
    };

    console.log("Rendering RegisterPage component");

    return (
        <div className={styles.registerPage}>
            <header className={styles.header}>
                <h1>NURTURE</h1>
            </header>
            <div className={styles.registerBox}>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username <span>*</span></label>
                    <input 
                        type="username" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Username" 
                        required 
                    />
                    <label htmlFor="password">Password <span>*</span></label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required 
                    />
                    {/* Kotak Pesan Error */}
                    {errorMessage && (
                        <div 
                            style={{
                                backgroundColor: "#BFBAAA", // Warna abu-abu muda
                                color: "#AE383A", 
                                padding: "10px",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                border: "1px solid #ccc",
                                fontSize: "0.9em",
                                textAlign: "center",
                            }}
                        >
                            {errorMessage}
                        </div>
                    )}
                    <button type="submit" className={styles.registerButton}>SIGN UP</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
