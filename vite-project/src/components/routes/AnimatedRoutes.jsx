import React from 'react'
import {Routes, Route, useLocation } from 'react-router-dom'
import {AnimatePresence} from 'framer-motion'
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UserPage from '../pages/UserPage'
function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence>
    <Routes location = {location} key={location.pathname}>
    <Route path = '/' element = {<HomePage/>}/>
    <Route path = '/login' element = {<LoginPage/>}/>
    <Route path = '/register' element = {<RegisterPage/>}/>
    <Route path = 'dashboard' element = {<UserPage/>}/>
    </Routes>
    </AnimatePresence>
    )

}

export default AnimatedRoutes;