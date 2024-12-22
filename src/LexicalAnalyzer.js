// LexicalAnalyzer.js
import React, { useState, useContext } from 'react';
import { Button, Table, Alert, Space, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import lexer, { TokenType } from './lexer';
import TokenContext from './TokenContext'; // 从独立文件导入

const { Title } = Typography;

function LexicalAnalyzer() {
  const [code, setCode] = useState(`
    {
      i = 2;
      while (i <= 100)
      {
        sum = sum + i;
        i = i + 2;
      }
    }
  `);
  const { tokens, setTokens, lexErrors, setLexErrors } = useContext(TokenContext);
  const [processedCode, setProcessedCode] = useState([]);

  // 添加调试日志
  console.log('Tokens (before analysis):', tokens);
  console.log('LexErrors (before analysis):', lexErrors);

  const handleAnalyze = () => {
    const result = lexer(code);
    console.log('Lexer result:', result); // 调试日志
    if (result) {
      setProcessedCode(result.processedCode);
      setTokens(result.tokens);
      setLexErrors(result.errors);
    } else {
      setTokens([]);
      setProcessedCode("");
      setLexErrors(['词法分析失败。']);
    }
  };

  const columns = [
    { title: '类型', dataIndex: 'type', key: 'type', render: (text) => getTokenTypeName(text) },
    { title: '词法单元', dataIndex: 'lexeme', key: 'lexeme' },
  ];

  return (
    <div className="App">
      <div className="container">
        <Title level={1} className="header">词法分析器</Title>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="10"
          className="code-input"
          placeholder="在这里输入或粘贴你的C代码..."
        ></textarea>
        <div className="actions">
          <Button type="primary" onClick={handleAnalyze}>分析代码</Button>
        </div>

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

        {processedCode && (
          <div className="processed-code">
            <Title level={3}>处理后的代码</Title>
            <pre>{processedCode}</pre>
          </div>
        )}

        <div className="result">
          <Title level={3}>记号列表</Title>
          {tokens.length > 0 ? (
            <Table
              dataSource={tokens}
              columns={columns}
              rowKey={(record, index) => index}
              pagination={false}
            />
          ) : (
            <Alert
              message="没有记号"
              description="没有发现有效的记号。"
              type="info"
              showIcon
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get token type name
function getTokenTypeName(type) {
  const tokenNames = {
    0: 'IF',
    1: 'ELSE',
    2: 'WHILE',
    3: 'DO',
    4: 'BREAK',
    5: 'MAIN',
    6: 'INT',
    7: 'FLOAT',
    8: 'DOUBLE',
    9: 'RETURN',
    10: 'CONST',
    11: 'VOID',
    12: 'CONTINUE',
    13: 'CHAR',
    14: 'UNSIGNED',
    15: 'ENUM',
    16: 'LONG',
    17: 'SWITCH',
    18: 'CASE',
    19: 'AUTO',
    20: 'STATIC',
    22: 'PLUS',
    23: 'MINUS',
    24: 'COMMA',
    25: 'DIV',
    26: 'ASSIGN',
    27: 'LT',
    28: 'GT',
    29: 'LBRACE',
    30: 'RBRACE',
    31: 'SEMICOLON',
    32: 'LPAREN',
    33: 'RPAREN',
    34: 'AMP',
    35: 'EXCLAM',
    36: 'HASH',
    37: 'LBRACKET',
    38: 'RBRACKET',
    39: 'EQ',
    40: 'NEQ',
    41: 'AND',
    42: 'OR',
    43: 'GEQ',
    44: 'LEQ',
    98: 'DEC',
    99: 'OTC',
    100: 'HEX',
    101: 'ID',
    102: 'STRING_CONST',
    103: 'CHAR_CONST',
  };

  return tokenNames[type] || 'UNKNOWN';
}

export default LexicalAnalyzer;
