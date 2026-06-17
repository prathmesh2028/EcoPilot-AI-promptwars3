import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EcoProvider } from './context/EcoContext';
import { Layout } from './components/layout/Layout';

import { Landing }    from './pages/Landing';
import { Assessment } from './pages/Assessment';
import { Dashboard }  from './pages/Dashboard';
import { ActionPlan } from './pages/ActionPlan';
import { Simulator }  from './pages/Simulator';
import { Report }     from './pages/Report';

function App() {
  return (
    <EcoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index              element={<Landing />}    />
            <Route path="assessment"  element={<Assessment />} />
            <Route path="dashboard"   element={<Dashboard />}  />
            <Route path="action-plan" element={<ActionPlan />} />
            <Route path="simulator"   element={<Simulator />}  />
            <Route path="report"      element={<Report />}     />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EcoProvider>
  );
}

export default App;
