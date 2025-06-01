import "../css/login_signup.css";
import { useState } from 'react'
import { Link } from "react-router-dom";
import supabase from "../client";
import toast from 'react-hot-toast';

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleSignup = async (event) => {
        event.preventDefault()

        try {
          const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
          });
          if (error) {
            toast.error(error.message);
            console.log(error.message);
          } else {
            // Handle successful signup (e.g., redirect, show success message)
            toast.success('Signup successful');
            console.log('Signup successful:', data);
          }
        } catch (err) {
          console.log('An unexpected error occurred.');
        }
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
