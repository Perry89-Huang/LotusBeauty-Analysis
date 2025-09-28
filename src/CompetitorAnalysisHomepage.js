import React, { useState, useEffect } from 'react';
import Login from './Login';

const MarketingSystemHomepage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 檢查是否已經登入
    const isLoggedIn = sessionStorage.getItem('heyanLoggedIn');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
    }

    // 注入主系統樣式
    if (!document.getElementById('marketing-system-styles')) {
      const style = document.createElement('style');
      style.id = 'marketing-system-styles';
      style.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Microsoft JhengHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .app {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          position: relative;
          text-align: center;
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
          color: #2c3e50;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .header p {
          color: #7f8c8d;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .logout-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(231, 76, 60, 0.2);
        }

        .logout-btn:hover {
          background: rgba(231, 76, 60, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
        }

        .analysis-table {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        thead th {
          color: white;
          padding: 1.5rem 1rem;
          text-align: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        tbody tr {
          border-bottom: 1px solid #eee;
          transition: all 0.3s ease;
        }

        tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        td {
          padding: 1.5rem 1rem;
          text-align: center;
          vertical-align: middle;
        }

        .company-info {
          text-align: left;
        }

        .company-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .company-tagline {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .company-stats {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .stat {
          background: #f8f9fa;
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .action-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn {
          display: inline-block;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          border: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-align: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-secondary {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .btn-tertiary {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .highlight-row {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .highlight-row .company-name {
          color: #667eea;
        }

        .summary-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-top: 2rem;
        }

        .summary-section h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .summary-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 15px;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .summary-card h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .summary-card p {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .logo {
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
        }

        /* 移動端適配 */
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          table {
            font-size: 0.9rem;
          }

          .action-links {
            flex-direction: column;
          }

          .btn {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
          }

          .logout-btn {
            position: static;
            margin-top: 1rem;
            display: inline-block;
          }

          .company-stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // 組件卸載時清理樣式
      const existingStyle = document.getElementById('marketing-system-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (window.confirm('確定要登出嗎？')) {
      sessionStorage.removeItem('heyanLoggedIn');
      setIsAuthenticated(false);
    }
  };

  const handleLinkClick = (linkType, company) => {
    let message = '';
    switch(linkType) {
      case 'overall':
        message = `🔍 即將跳轉到與${company}的整體比較分析頁面\n\n包含：品牌概況、市場定位、SWOT分析、競爭優勢等全方位比較`;
        break;
      case 'product':
        message = `🧪 即將跳轉到與${company}的產品成分比較頁面\n\n包含：核心成分分析、技術含量比較、安全檢測、使用體驗等深度比較`;
        break;
      case 'system':
        message = `💰 即將跳轉到與${company}的獎金制度比較頁面\n\n包含：產品獎金、推薦獎金、階級獎金、盈餘分紅、領取限制等詳細比較`;
        break;
      default:
        message = '功能開發中...';
    }
    alert(message);
  };

  // 如果未登入，顯示登入組件
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 主頁面內容
  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div className="logo">荷</div>
          <h1>荷顏行銷系統</h1>
          <p>深度分析台灣天然護膚品市場主要競爭對手，從產品力、商業模式到市場定位的全方位比較研究</p>
          <div className="logout-btn" onClick={logout}>🔒 登出</div>
        </div>

        <div className="analysis-table">
          <table>
            <thead>
              <tr>
                <th style={{width: '35%'}}>競爭對手</th>
                <th style={{width: '15%'}}>市場地位</th>
                <th style={{width: '15%'}}>成立時間</th>
                <th style={{width: '35%'}}>分析報告</th>
              </tr>
            </thead>
            <tbody>
              <tr className="highlight-row">
                <td className="company-info">
                  <div className="company-name">🌸 荷顏 Lotus Beauty</div>
                  <div className="company-tagline">韓國幹細胞技術 × 台灣植萃專家</div>
                  <div className="company-stats">
                    <span className="stat">創新混合模式</span>
                    <span className="stat">四效合一</span>
                    <span className="stat">累積永不歸零</span>
                  </div>
                </td>
                <td><strong style={{color: '#667eea'}}>新興領導品牌</strong></td>
                <td><strong style={{color: '#667eea'}}>2025年</strong></td>
                <td className="action-links">
                  <span style={{color: '#7f8c8d', fontSize: '0.9rem'}}>基準品牌 - 以下為與荷顏的比較</span>
                </td>
              </tr>
              <tr>
                <td className="company-info">
                  <div className="company-name">🌺 生麗國際 SHENGLIH</div>
                  <div className="company-tagline">台灣第10大傳直銷品牌，22年專業經驗</div>
                  <div className="company-stats">
                    <span className="stat">傳統直銷</span>
                    <span className="stat">敏弱肌專用</span>
                    <span className="stat">小紅帽防曬</span>
                  </div>
                </td>
                <td><strong>成熟直銷龍頭</strong></td>
                <td><strong>2002年</strong></td>
                <td className="action-links">
                  <button 
                    onClick={() => handleLinkClick('overall', '生麗國際')} 
                    className="btn btn-primary"
                  >
                    🔍 整體比較分析
                  </button>
                  <button 
                    onClick={() => handleLinkClick('product', '生麗國際')} 
                    className="btn btn-secondary"
                  >
                    🧪 產品成分比較
                  </button>
                  <button 
                    onClick={() => handleLinkClick('system', '生麗國際')} 
                    className="btn btn-tertiary"
                  >
                    💰 獎金制度比較
                  </button>
                </td>
              </tr>
              <tr>
                <td className="company-info">
                  <div className="company-name">✨ 天麗生技 TENLEAD</div>
                  <div className="company-tagline">法國Solabia技術合作，內外兼修美容品牌</div>
                  <div className="company-stats">
                    <span className="stat">精緻直銷</span>
                    <span className="stat">Joli系列</span>
                    <span className="stat">國際布局</span>
                  </div>
                </td>
                <td><strong>中型專業品牌</strong></td>
                <td><strong>2009年</strong></td>
                <td className="action-links">
                  <button 
                    onClick={() => handleLinkClick('overall', '天麗生技')} 
                    className="btn btn-primary"
                  >
                    🔍 整體比較分析
                  </button>
                  <button 
                    onClick={() => handleLinkClick('product', '天麗生技')} 
                    className="btn btn-secondary"
                  >
                    🧪 產品成分比較
                  </button>
                  <button 
                    onClick={() => handleLinkClick('system', '天麗生技')} 
                    className="btn btn-tertiary"
                  >
                    💰 獎金制度比較
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="summary-section">
          <h2>📊 競爭分析概覽</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h3>🎯 市場定位差異</h3>
              <p>荷顏以創新混合模式突破傳統直銷框架，生麗國際深耕傳統直銷市場，天麗生技專注高端精緻路線，三者各具特色。</p>
            </div>
            <div className="summary-card">
              <h3>🔬 技術創新程度</h3>
              <p>荷顏領先採用韓國幹細胞外秘體技術，天麗生技運用法國低溫萃取技術，生麗國際專精植萃溫和配方。</p>
            </div>
            <div className="summary-card">
              <h3>💼 商業模式比較</h3>
              <p>荷顏創新非直銷模式風險最低，生麗國際成熟直銷體系最穩定，天麗生技國際化布局潛力最大。</p>
            </div>
            <div className="summary-card">
              <h3>📈 投資報酬分析</h3>
              <p>荷顏提供最佳風險報酬比，生麗國際適合長期穩健經營，天麗生技適合高端市場投資者。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingSystemHomepage;