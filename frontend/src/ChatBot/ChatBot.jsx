import React, { useState } from "react";
import styles from "./Chatbot.module.css";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("http://localhost:3000/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();

            const botMessage = { sender: "bot", text: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error communicating with backend:", error);
        }

        setInput("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.chatWindow}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.sender === "user"
                                ? styles.userMessage
                                : styles.botMessage
                        }
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit" className={styles.sendButton} onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
