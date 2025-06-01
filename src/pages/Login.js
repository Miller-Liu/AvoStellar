import "../css/login_signup.css";
import { useState } from 'react';
import { Link } from "react-router-dom";
import supabase from "../client";
import toast from 'react-hot-toast';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });
          if (error) {
            toast.error(error.message);
            console.log(error.message);
          } else {
            // Handle successful signup (e.g., redirect, show success message)
            toast.success('Login successful');
            console.log('Login successful:', data);
          }
        } catch (err) {
          console.log('An unexpected error occurred.');
        }
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
