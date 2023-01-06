import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { authActions } from '_store';

export { Nav };

function Nav() {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  // only show nav when logged in
  if (!authUser) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav">
        <NavLink to="/" className="nav-item nav-link">
          Danh sách tài khoản của tôi
        </NavLink>
        <NavLink to="/beneficiaries" className="nav-item nav-link">
          Danh sách tài khoản thụ hưởng
        </NavLink>
        <NavLink to="/transfers" className="nav-item nav-link">
          Chuyển tiền
        </NavLink>
        <button onClick={logout} className="btn btn-link nav-item nav-link">
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
