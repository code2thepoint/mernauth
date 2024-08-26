import React from 'react';
import { Link } from 'react-router-dom';
 

export default function Nav({ user, logout }) {
  return (

    <nav className="navbar">
      <Link to="/"><h1>My App</h1> </Link>
      <ul>
        {user && <LoginRoutes user={user} logout={logout}/>}
      </ul>
    </nav>

  );
}



function LoginRoutes({ logout }) {
  return (
    <>
      <li><a  onClick={logout} >Logout</a></li>
    </>
  );
}



 