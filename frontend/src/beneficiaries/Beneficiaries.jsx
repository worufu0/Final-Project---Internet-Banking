import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { history } from '_helpers';
import { receiverActions } from '_store';

export { Beneficiaries };

function Beneficiaries() {
  const dispatch = useDispatch();
  const { accounts } = useSelector((x) => x.receivers);

  const handleOnTransfers = (accountNumber) => {
    localStorage.setItem('accountNumber', accountNumber);
    history.navigate('/transfers');
  };
  const handleOnDelete = async (accountNumber) => {
    await dispatch(receiverActions.deleteRecipient({ accountNumber }));
    await dispatch(receiverActions.getListRecipient());
    alert('Xoá người thụ hưởng thành công!');
  };

  useEffect(() => {
    dispatch(receiverActions.getListRecipient());
  }, []);

  return (
    <div>
      <h1 className="mb-4">Danh sách tài khoản thụ hưởng</h1>
      <NavLink to="/create-beneficiary-account" className="btn btn-primary mb-4">
        Thêm người thụ hưởng
      </NavLink>
      {accounts?.length ? (
        <ul>
          {accounts?.map((account) => (
            <li key={account.id}>
              <div className="d-flex justify-content-between">
                <span>
                  STK: {account.accountNumber} {account.reminiscentName}
                </span>
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      handleOnTransfers(account.accountNumber);
                    }}
                  >
                    Chuyển tiền
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={() => {
                      handleOnDelete(account.accountNumber);
                    }}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>Chưa có tài khoản thụ hưởng!</div>
      )}
    </div>
  );
}
