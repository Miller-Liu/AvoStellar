import "../css/login_signup.css";
import { useState } from 'react'
import { Link } from "react-router-dom";
import supabase from "../apis/client";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleSignup = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
    }

    return (
        <div className="main-container">
            <div className="container">
                <div>
                    Welcome, new Traveler
                </div>
                <form className="form" onSubmit={(e) => handleSignup(e)}>
                    <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">Sign Up</button>
                </form>
                <div>
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    )
}
