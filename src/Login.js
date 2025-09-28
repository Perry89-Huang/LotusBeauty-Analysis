import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const CORRECT_PASSWORD = "beauty";

  useEffect(() => {
    // 注入登入頁面樣式
    if (!document.getElementById('login-styles')) {
      const style = document.createElement('style');
      style.id = 'login-styles';
      style.textContent = `
        .login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .login-modal {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: modalSlideIn 0.6s ease;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-header {
          margin-bottom: 2rem;
        }

        .login-header h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .login-header p {
          color: #7f8c8d;
          margin-bottom: 2rem;
          font-size: 1rem;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .login-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          margin: 0 auto 1rem;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .login-form {
          margin-bottom: 2rem;
        }

        .login-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid #e9ecef;
          border-radius: 50px;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          text-align: center;
          letter-spacing: 2px;
          font-family: 'Microsoft JhengHei', sans-serif;
          box-sizing: border-box;
        }

        .login-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .login-input.error-input {
          border-color: #e74c3c;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .login-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .login-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-btn.loading {
          background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
        }

        .login-error-message {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          min-height: 1.2rem;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .login-error-message.show {
          opacity: 1;
        }

        .login-footer {
          margin-top: 2rem;
        }

        .login-footer p {
          color: #95a5a6;
          font-size: 0.8rem;
          margin: 0;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        /* 移動端適配 */
        @media (max-width: 768px) {
          .login-modal {
            padding: 2rem;
            margin: 1rem;
          }

          .login-header h2 {
            font-size: 1.5rem;
          }

          .login-input {
            font-size: 0.9rem;
            padding: 0.8rem 1.2rem;
          }

          .login-btn {
            font-size: 0.9rem;
            padding: 0.8rem;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // 組件卸載時清理樣式
      const existingStyle = document.getElementById('login-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const checkPassword = () => {
    const trimmedPassword = password.trim();
    
    if (trimmedPassword === '') {
      showErrorMessage('請輸入密碼');
      return;
    }

    setIsLoading(true);

    // 模擬驗證延遲
    setTimeout(() => {
      if (trimmedPassword === CORRECT_PASSWORD) {
        sessionStorage.setItem('heyanLoggedIn', 'true');
        setError('');
        setShowError(false);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        showErrorMessage('密碼錯誤，請重新輸入');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const showErrorMessage = (message) => {
    setError(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      checkPassword();
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    if (showError) {
      setShowError(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <div className="login-logo">荷</div>
          <h2>荷顏行銷系統</h2>
          <p>此為機密商業分析報告，請輸入密碼查看</p>
        </div>
        <div className="login-form">
          <input
            type="password"
            value={password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="請輸入查看密碼"
            maxLength={20}
            className={`login-input ${error && showError ? 'error-input' : ''}`}
            disabled={isLoading}
          />
          <button 
            onClick={checkPassword} 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '🔄 驗證中...' : '🔓 驗證密碼'}
          </button>
          {error && (
            <div className={`login-error-message ${showError ? 'show' : ''}`}>
              {error}
            </div>
          )}
        </div>
        <div className="login-footer">
          <p>🔒 為保護商業機密，本分析報告僅供授權人員查看</p>
        </div>
      </div>
    </div>
  );
};

export default Login;