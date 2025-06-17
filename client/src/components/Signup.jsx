import {useState} from "react";
import '../styles/Signup.css'
import Logo from "../assets/Logo.svg";

const Signup = ({onSignup}) => {
    const [form, setForm] = useState({username:"", email:"", password:"",});

    const handleChange =(e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    console.log("Signup Component loaded");

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/auth/signup",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if(res.ok) {
                alert("Signup Successful");
                onSignup?.();
            } else {
                alert(data.error || "Signup failed");
            }
        } catch (error) {
            console.error(error);
            alert("Server error during Signup");
        }
    };

    return (
    <>
            <nav className="navbar">
                <div class="logo"><img src={Logo} alt="Logo-image" className="main-logo" /></div>
                <div className="button-div"><button className="login-button">Login</button></div>
            </nav>

            <section className="sign">
                <div className="signup-component">
                <h2 className="signup-header">Signup</h2> 
                <form onSubmit={handleSubmit}>
                    <label for="name">Username</label>
                    <input type="text" name="username"  value={form.username} onChange={handleChange} required/>
                    <br/>

                    <label for="name">Email</label>
                    <input type="email" name="email"  value={form.email} onChange={handleChange} required />
                    <br/>

                    <label for="name">Password</label>
                    <input type="password" name="password"  value={form.password} onChange={handleChange}required />
                    <br/>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
            </section>

    </>

        
    );

};

export default Signup;