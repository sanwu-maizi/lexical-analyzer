// SyntaxAnalyzer.js
import React, { useState, useContext } from 'react';
import { Button, Alert, Typography, Space } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Parser } from './parser';
import TokenContext from './TokenContext'; // 从独立文件导入

const { Title } = Typography;

function SyntaxAnalyzer() {
  const { tokens, lexErrors } = useContext(TokenContext);
  const [parseSteps, setParseSteps] = useState([]);
  const [parseSuccess, setParseSuccess] = useState(null);

  // 添加调试日志
  console.log('Tokens (for parsing):', tokens);
  console.log('LexErrors (for parsing):', lexErrors);

  const handleParse = () => {
    if (tokens.length === 0) {
      setParseSteps(['没有可解析的记号。']);
      setParseSuccess(false);
      return;
    }

    const parser = new Parser(tokens);
    const result = parser.parse();
    console.log('Parser result:', result); // 调试日志
    setParseSteps(result.steps);
    setParseSuccess(result.success);
  };

  return (
    <div className="SyntaxAnalyzer">
      <div className="container">
        <Title level={1} className="header">语法分析器</Title>
        
        {lexErrors.length > 0 && (
          <div className="errors">
            <Title level={3}>词法错误列表</Title>
            <Space direction="vertical">
              {lexErrors.map((error, index) => (
                <Alert
                  key={index}
                  message={`错误：${error}`}
                  type="error"
                  icon={<WarningOutlined />}
                  showIcon
                />
              ))}
            </Space>
          </div>
        )}

        {tokens.length > 0 ? (
          <div className="token-list">
            <Title level={3}>记号列表</Title>
            <pre>
              {tokens.map((token, index) => `<${token.type}, ${token.lexeme}>`).join('\n')}
            </pre>
          </div>
        ) : (
          <Alert
            message="没有可用的记号"
            description="请先进行词法分析。"
            type="info"
            showIcon
          />
        )}

        <div className="actions">
          <Button type="primary" onClick={handleParse} disabled={tokens.length === 0}>
            启动语法分析
          </Button>
        </div>

        {parseSteps.length > 0 && (
          <div className="parse-steps">
            <Title level={3}>语法分析步骤</Title>
            <pre>{parseSteps.join('\n')}</pre>
          </div>
        )}

        {parseSuccess !== null && (
          <div className="analysis-result">
            {parseSuccess ? (
              <Alert
                message="语法分析成功！"
                description="输入的代码通过了语法分析。"
                type="success"
                icon={<CheckCircleOutlined />}
                showIcon
              />
            ) : (
              <Alert
                message="语法分析失败！"
                description="输入的代码存在语法错误，请检查分析步骤。"
                type="error"
                icon={<WarningOutlined />}
                showIcon
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SyntaxAnalyzer;
