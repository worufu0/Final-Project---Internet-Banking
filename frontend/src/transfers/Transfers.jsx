import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '_helpers';
import { accountActions, receiverActions } from '_store';

export { Transfers };

function Transfers() {
  const dispatch = useDispatch();
  const { otp: otpState } = useSelector((x) => x.accounts);
  const [accountNumber, setAccountNumber] = useState('');
  const [cash, setCash] = useState('');
  const [otp, setOtp] = useState('');

  const handleOnChangeAccountNumber = (event) => {
    setAccountNumber(event.target.value);
  };
  const handleOnChangeCash = (event) => {
    setCash(event.target.value);
  };
  const handleOnGetOtp = async () => {
    await dispatch(accountActions.getOtp());
    console.log(otpState);
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    await dispatch(accountActions.createTransaction({ accountNumber, cash, otp }));
  };

  return (
    <div>
      <h1 className="mb-4">Chuyển tiền</h1>
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label htmlFor="account-number">Số tài khoản</label>
          <input
            type="text"
            value={accountNumber}
            className="form-control"
            id="account-number"
            onChange={handleOnChangeAccountNumber}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cash">Số tiền</label>
          <input
            type="text"
            value={cash}
            className="form-control"
            id="cash"
            onChange={handleOnChangeCash}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cash">Mã OTP</label>
          <input readOnly type="text" value={otp} className="form-control" id="otp" />
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleOnGetOtp}>
          Lấy mã OTP
        </button>
        <button type="submit" className="ml-2 btn btn-primary">
          Chuyển
        </button>
      </form>
    </div>
  );
}
