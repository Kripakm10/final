import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Reset from './components/Reset';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import WasteManagement from './components/WasteManagement';
import WaterManagement from './components/WaterManagement';
import Grievance from './components/Grievance';
import Registration from './components/Registration'; // Assuming /r maps to this

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset" element={<Reset />} />

            {/* Protected/Role-based routes could be wrapped here, but keeping flat for restoration */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<UserDashboard />} />

            <Route path="/waste" element={<WasteManagement />} />
            <Route path="/water" element={<WaterManagement />} />
            <Route path="/grievance" element={<Grievance />} />
            <Route path="/r" element={<Registration />} />
        </Routes>
    );
};

export default App;
