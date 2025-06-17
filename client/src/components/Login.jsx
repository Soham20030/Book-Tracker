import { useState } from "react";
import '../styles/Login.css'
import Logo from "../assets/Logo.svg";

const Login = ({onLogin}) => {
    const[form, setForm] = useState({email:"", password:"",});

    const handleChange =(e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                header: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if(res.ok) {
                alert("Login Successful!");
                localStorage.setItem("token", data.token); //store JWT
                onLogin?.();
            }else {
                alert(data.error || "Login failed");
            }

        } catch (error) {
            console.error("Login error:", error );
            alert("Sercer error durign Login");
        }
    };

    return (

    <>
        <nav className="navbar">
            <div class="logo"><img src={Logo} alt="Logo-image" className="main-logo" /></div>
            <div className="button-div"><button className="signup-button">Signup</button></div>
        </nav>

        <section className="Log">
                <div className="login-component">
                <h2 className="login-header">Login</h2> 

    <form onSubmit={handleSubmit}>
      <label for="name">Email</label>
      <input type="email" name="email" value={form.email} onChange={handleChange} required/>
      <br />

      <label for="name">Password</label>
      <input type="password" name="password"  value={form.password} onChange={handleChange} required />
      <br />

      <button type="submit" className="submit-btn">Login</button>
    </form>

             </div>
            </section>
    </>

    );
};

export default Login;