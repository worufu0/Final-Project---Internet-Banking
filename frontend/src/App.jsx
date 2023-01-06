import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from '_helpers';
import { Nav, PrivateRoute } from '_components';
import { Home } from 'home';
import { Login } from 'login';
import { Beneficiaries } from 'beneficiaries';
import { Transfers } from 'transfers';
import { CreateBeneficiaryAccount } from 'create-beneficiary-account';

export { App };

function App() {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className="app-container">
      <Nav />
      <div className="container pt-4 pb-4">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/beneficiaries"
            element={
              <PrivateRoute>
                <Beneficiaries />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-beneficiary-account"
            element={
              <PrivateRoute>
                <CreateBeneficiaryAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <PrivateRoute>
                <Transfers />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
