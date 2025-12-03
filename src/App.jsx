import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Community from './pages/Community';
import Store from './pages/Store';

// Importaciones de Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import Help from './pages/Help';

// Importaciones del Asistente (Add Plant)
import AddPlantLayout from './pages/add-plant/AddPlantLayout';
import Step1Prepare from './pages/add-plant/Step1Prepare';
import Step2Wifi from './pages/add-plant/Step2Wifi';
import Step3Calibrate from './pages/add-plant/Step3Calibrate';
import Step4Name from './pages/add-plant/Step4Name';

import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- Rutas Protegidas --- */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/editar-perfil" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />   
        <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
        <Route path="/comunidad" element={<ProtectedRoute><Community /></ProtectedRoute>} />     

        {/* --- Rutas del Asistente de Nueva Planta --- */}
        <Route path="add-plant" element={<ProtectedRoute><AddPlantLayout /></ProtectedRoute>}>
          {/* Si el usuario entra a /add-plant, redirigir al paso 1 */}
          <Route index element={<Navigate to="step-1" replace />} />
          
          {/* Definición explícita de los pasos */}
          <Route path="step-1" element={<Step1Prepare />} />
          <Route path="step-2" element={<Step2Wifi />} />
          <Route path="step-3" element={<Step3Calibrate />} />
          <Route path="step-4" element={<Step4Name />} />
        </Route>
        
      </Routes>
    </Layout>
  );
}

export default App;