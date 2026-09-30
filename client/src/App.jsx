import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/useAuth';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Login from './pages/Login';
import Membership from './pages/Membership';
import MemberDetail from './pages/MemberDetail';
import Members from './pages/Members';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
import Plans from './pages/Plans';
import Register from './pages/Register';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberDetail />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
