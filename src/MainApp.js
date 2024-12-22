// MainApp.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import LexicalAnalyzer from './LexicalAnalyzer';
import SyntaxAnalyzer from './SyntaxAnalyzer';
import './App.css';
import TokenContext from './TokenContext'; // 从独立文件导入

const { Header, Content } = Layout;

function MainApp() {
  const [tokens, setTokens] = useState([]);
  const [lexErrors, setLexErrors] = useState([]);

  return (
    <TokenContext.Provider value={{ tokens, setTokens, lexErrors, setLexErrors }}>
      <Router>
        <Layout>
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['lexical']}>
              <Menu.Item key="lexical">
                <Link to="/">词法分析器</Link>
              </Menu.Item>
              <Menu.Item key="syntax">
                <Link to="/syntax">语法分析器</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<LexicalAnalyzer />} />
              <Route path="/syntax" element={<SyntaxAnalyzer />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </TokenContext.Provider>
  );
}

export default MainApp;
