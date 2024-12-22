import React, { useState } from "react";
import "./App.css";
import { lexer, TokenType } from "./lexer";
import { Button, Table, Alert, Space, Typography } from "antd";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";

const { Title } = Typography;

function App() {
  const [code, setCode] = useState(`
    int main() {
      int x = 10;
      float y = 3.14;
      if (x > 5) {
        y = y + 2;
      }
      return 0;
    }
  `);
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState([]);
  const [processedCode, setProcessedCode] = useState([]);

  const handleAnalyze = () => {
    const result = lexer(code);
    if (result && Array.isArray(result.tokens)) {
      const validTokens = result.tokens.filter(
        (token) => token.type !== TokenType.EOF && token.type !== TokenType.ERROR
      );
      const errorTokens = result.tokens.filter((token) => token.type === TokenType.ERROR);
      setProcessedCode(result.processedCode);
      setTokens(validTokens);
      setErrors(errorTokens);
    } else {
      setTokens([]);
      setErrors([{ line: 1, lexeme: "Lexer returned an invalid result." }]);
      setProcessedCode("");
    }
  };

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
              columns={[
                { title: "类型", dataIndex: "type", key: "type", render: (text) => getTokenTypeName(text)},
                { title: "词法单元", dataIndex: "lexeme", key: "lexeme" },
              ]}
              rowKey="lexeme"
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

          {errors.length > 0 && (
            <div className="errors">
              <Title level={3}>错误列表</Title>
              <Space direction="vertical">
                {errors.map((error, index) => (
                  <Alert
                    key={index}
                    message={`行 ${error.line}`}
                    description={error.lexeme}
                    type="error"
                    icon={<WarningOutlined />}
                    showIcon
                  />
                ))}
              </Space>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 辅助函数：根据 TokenType 获取类型名称
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
    21: 'PLUS',
    22: 'MINUS',
    23: 'COMMA',
    24: 'DIV',
    25: 'ASSIGN',
    26: 'LT',
    27: 'GT',
    28: 'LBRACE',
    29: 'RBRACE',
    30: 'SEMICOLON',
    31: 'LPAREN',
    32: 'RPAREN',
    33: 'AMP',
    34: 'EXCLAM',
    35: 'HASH',
    36: 'LBRACKET',
    37: 'RBRACKET',
    38: 'EQ',
    39: 'NEQ',
    40: 'AND',
    41: 'OR',
    42: 'GEQ',
    43: 'LEQ',
    44: 'DEC',
    45: 'OTC',
    46: 'HEX',
    47: 'ID',
    48: 'STRING_CONST',
    49: 'CHAR_CONST',
    50: 'EOF',
    51: 'ERROR',
  };

  return tokenNames[type] || 'UNKNOWN';
}


export default App;
