import React from 'react';
import { NavLink } from 'react-router-dom';

const GuestApp = () => (
    <div className="app">
        <nav>
            <NavLink exact to="/" activeClassName="active">
                New Home
            </NavLink>{' '}
            <NavLink exact to="/about" activeClassName="active">
                New About
            </NavLink>
        </nav>

        <div className="main">guest App Is New</div>

        <footer />
    </div>
);

export default GuestApp;
