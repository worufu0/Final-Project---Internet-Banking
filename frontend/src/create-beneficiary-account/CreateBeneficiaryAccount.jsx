import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { history } from '_helpers';
import { receiverActions } from '_store';

export { CreateBeneficiaryAccount };

function CreateBeneficiaryAccount() {
  const dispatch = useDispatch();
  const [accountNumber, setAccountNumber] = useState('');

  const handleOnChange = (event) => {
    setAccountNumber(event.target.value);
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    await dispatch(receiverActions.saveRecipient({ accountNumber }));
    history.navigate('/beneficiaries');
  };

  return (
    <div>
      <h1 className="mb-4">Thêm người thụ hưởng</h1>
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label htmlFor="account-number">Số tài khoản</label>
          <input
            type="text"
            value={accountNumber}
            className="form-control"
            id="account-number"
            onChange={handleOnChange}
          />
        </div>
        <button className="btn btn-primary">Thêm mới</button>
      </form>
    </div>
  );
}
