import React from 'react';
import { NavLink } from 'react-router-dom';

const GrowthApp = () => (
    <div className="app">
        <nav>
            <NavLink exact to="/" activeClassName="active">
                New Home
            </NavLink>{' '}
            <NavLink exact to="/about" activeClassName="active">
                New About
            </NavLink>
        </nav>

        <div className="main">Growth App Is New</div>

        <footer />
    </div>
);

export default GrowthApp;
