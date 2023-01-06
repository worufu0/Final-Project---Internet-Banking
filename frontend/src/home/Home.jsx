import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '_store';

export { Home };

function Home() {
  const dispatch = useDispatch();
  // const { user: authUser } = useSelector((x) => x.auth);
  const { accounts } = useSelector((x) => x.users);

  useEffect(() => {
    dispatch(userActions.getListAccount());
  }, []);

  return (
    <div>
      <h1 className="mb-4">Danh sách tài khoản của tôi</h1>
      {accounts.data?.length ? (
        <ul>
          {accounts.data?.map((account) => (
            <li key={account.id}>
              <div className="d-flex justify-content-between">
                <span>
                  STK: {account.accountNumber}
                  {`${
                    account.accountType === 'Tài khoản thanh toán'
                      ? ` (${account.accountType})`
                      : ''
                  }`}
                </span>
                <span>{account.blance.toLocaleString()} đồng</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>Chưa có tài khoản !</div>
      )}
    </div>
  );
}
