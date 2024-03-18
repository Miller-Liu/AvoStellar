import "../css/login_signup.css";
import { useState } from 'react';
import { Link } from "react-router-dom";
import supabase from "../apis/client";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleLogin = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        console.log(error);
    }

    return (
        <div className="main-container">
            <div className="container">
                <div>
                    Welcome, Traveler
                </div>
                <form className="form" onSubmit={(e) => handleLogin(e)}>
                    <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">Log In</button>
                </form>
                <div>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}
