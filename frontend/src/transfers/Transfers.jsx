import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { history } from '_helpers';
import { accountActions, receiverActions } from '_store';

export { Transfers };

function Transfers() {
  const dispatch = useDispatch();
  const [accountNumber, setAccountNumber] = useState(localStorage.getItem('accountNumber') || '');
  const [cash, setCash] = useState('');
  const [save, setSave] = useState(false);
  const [otp, setOtp] = useState('');

  const handleOnChangeAccountNumber = (event) => {
    setAccountNumber(event.target.value);
  };
  const handleOnChangeCash = (event) => {
    setCash(event.target.value);
  };
  const handleOnChangeOtp = (event) => {
    setOtp(event.target.value);
  };
  const handleOnChangeSave = (event) => {
    setSave(event.target.value);
  };
  const handleOnGetOtp = async () => {
    await dispatch(accountActions.getOtp());
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (save) await dispatch(receiverActions.saveRecipient({ accountNumber }));
    await dispatch(accountActions.createTransaction({ accountNumber, cash, otp }));
    history.navigate('/');
    alert('Chuyển tiền thành công !');
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
          <input
            type="text"
            value={otp}
            className="form-control"
            id="otp"
            onChange={handleOnChangeOtp}
          />
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="save"
            value={save}
            onChange={handleOnChangeSave}
          />
          <label className="form-check-label" htmlFor="save">
            Lưu thông tin người nhận
          </label>
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
