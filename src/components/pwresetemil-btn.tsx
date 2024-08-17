import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// import './firebaseConfig';  // Firebase 초기 설정 파일

function PasswordResetPopup({ show, onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    const auth = getAuth();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('비밀번호 재설정 링크를 이메일로 보냈습니다.');
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2 style={titleStyle}>비밀번호 재설정</h2>
        <input
          type="email"
          style={inputStyle}
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {loading ? (
          <button style={buttonStyle} disabled>
            전송 중...
          </button>
        ) : (
          <button style={buttonStyle} onClick={handlePasswordReset}>
            비밀번호 재설정 링크 보내기
          </button>
        )}
        {message && <p style={successMessageStyle}>{message}</p>}
        {error && <p style={errorMessageStyle}>{error}</p>}
        <button style={closeButtonStyle} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div style={appStyle}>
      <button style={triggerButtonStyle} onClick={togglePopup}>
        비밀번호 재설정
      </button>
      <PasswordResetPopup show={showPopup} onClose={togglePopup} />
    </div>
  );
}

export default App;

// 스타일 정의
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

const inputStyle = {
  width: '80%',
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  marginTop: `50px`,
  backgroundColor: `black`,
  width: `100%`,
  color: `white`,
  padding: `10px 20px`,
  borderRadius: `50px`,
  border: `0`,
  display: 1,
  gap: 1,
  alignItems: `center`,
  justifyContent: `center`,
  cursor: `pointer`,
};

const successMessageStyle = {
  color: 'green',
  marginTop: '10px',
};

const errorMessageStyle = {
  color: 'red',
  marginTop: '10px',
};

const closeButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};

// const appStyle = {
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   height: '100vh',
// };

const triggerButtonStyle = {
  marginTop: `50px`,
  backgroundColor: `white`,
  width: `100%`,
  color: `black`,
  padding: `10px 20px`,
  borderRadius: `50px`,
  border: `0`,
  display: 1,
  gap: 1,
  alignItems: `center`,
  justifyContent: `center`,
  cursor: `pointer`,
};
