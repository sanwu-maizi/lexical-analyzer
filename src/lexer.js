// lexer.js

export const TokenType = {
  IF: 0,
  ELSE: 1,
  WHILE: 2,
  DO: 3,
  BREAK: 4,
  MAIN: 5,
  INT: 6,
  FLOAT: 7,
  DOUBLE: 8,
  RETURN: 9,
  CONST: 10,
  VOID: 11,
  CONTINUE: 12,
  CHAR: 13,
  UNSIGNED: 14,
  ENUM: 15,
  LONG: 16,
  SWITCH: 17,
  CASE: 18,
  AUTO: 19,
  STATIC: 20,
  // Special Symbols
  PLUS: 22,
  MINUS: 23,
  COMMA: 24,
  DIV: 25,
  ASSIGN: 26,
  LT: 27,
  GT: 28,
  LBRACE: 29,
  RBRACE: 30,
  SEMICOLON: 31,
  LPAREN: 32,
  RPAREN: 33,
  AMP: 34,
  EXCLAM: 35,
  HASH: 36,
  LBRACKET: 37,
  RBRACKET: 38,
  EQ: 39,
  NEQ: 40,
  AND: 41,
  OR: 42,
  GEQ: 43,
  LEQ: 44,
  // Other Token Types
  DEC: 98,
  OTC: 99,
  HEX: 100,
  ID: 101,
  STRING_CONST: 102,
  CHAR_CONST: 103,
  EOF: 50,
  ERROR: 51,
};

// List of keywords
const keywords = [
  "if", "else", "while", "do", "break", "main", "int", "float",
  "double", "return", "const", "void", "continue", "char", "unsigned",
  "enum", "long", "switch", "case", "auto", "static",
];

// List of special symbols
const specialSymbols = [
  "+", "-", ",", "/", "=", "<", ">", "{", "}", ";",
  "(", ")", "&", "!", "#", "[", "]",
];

function lexer(sourceCode) {
  const tokens = [];
  const errors = [];
  let p = 0; // Current position
  const length = sourceCode.length;

  // Stack for matching brackets
  const stacks = {
    '{': [],
    '[': [],
    '(': [],
  };

  // Helper functions
  const isWhitespace = (ch) => /\s/.test(ch);
  const isLetter = (ch) => /[a-zA-Z_]/.test(ch);
  const isDigit = (ch) => /[0-9]/.test(ch);
  const isHexDigit = (ch) => /[0-9a-fA-F]/.test(ch);

  // Preprocess: remove comments and unnecessary whitespaces
  const preprocess = (source) => {
    let str = "";
    let prevChar = null;
  
    for (let i = 0; i < source.length; i++) {
      // Remove single-line comments
      if (source[i] === '/' && source[i + 1] === '/') {
        i += 2;
        while (i < source.length && source[i] !== '\n') {
          i++;
        }
        continue;
      }
  
      // Remove multi-line comments
      if (source[i] === '/' && source[i + 1] === '*') {
        i += 2;
        while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
          i++;
        }
        if (i >= source.length - 1) {
          errors.push("Unterminated comment");
          break;
        }
        i += 2;
        continue;
      }
  
      // Skip newline and tab characters
      if (source[i] === '\n' || source[i] === '\t') {
        continue;
      }
  
      // Remove extra spaces
      if (source[i] === ' ') {
        // Only add space if the previous character is not a space or special symbol
        if (prevChar && !isWhitespace(prevChar) && !specialSymbols.includes(prevChar)) {
          str += source[i];
        }
      } else {
        // If current character is a symbol, trim trailing spaces before adding the symbol
        if (specialSymbols.includes(source[i])) {
          str = str.trimEnd(); // Remove spaces before the symbol
        }
        str += source[i];
      }
  
      prevChar = source[i];
    }
  
    // Final pass to remove trailing spaces
    return str.trim();
  };
  
  

  const preprocessedSource = preprocess(sourceCode);

  while (p < preprocessedSource.length) {
    let ch = preprocessedSource[p];

    // Skip whitespace
    if (isWhitespace(ch)) {
      p++;
      continue;
    }

    // Initialize token
    let currentToken = "";
    let sym = TokenType.ERROR;

    // Identifier or keyword
    if (ch === '_' || isLetter(ch)) {
      sym = TokenType.ID;
      while (p < preprocessedSource.length && (preprocessedSource[p] === '_' || isLetter(preprocessedSource[p]) || isDigit(preprocessedSource[p]))) {
        currentToken += preprocessedSource[p];
        p++;
      }
      // Check if keyword
      const keywordIndex = keywords.indexOf(currentToken);
      if (keywordIndex !== -1) {
        sym = keywordIndex;
      }
      tokens.push({ type: sym, lexeme: currentToken });
      continue;
    }

    // Number (DEC, OTC, HEX)
    if (isDigit(ch)) {
      sym = TokenType.DEC;
      while (p < preprocessedSource.length && isDigit(preprocessedSource[p])) {
        currentToken += preprocessedSource[p];
        p++;
      }

      // Check for hexadecimal
      if (ch === '0' && preprocessedSource[p] === 'x') {
        sym = TokenType.HEX;
        currentToken += preprocessedSource[p]; // 'x'
        p++;
        while (p < preprocessedSource.length && isHexDigit(preprocessedSource[p])) {
          currentToken += preprocessedSource[p];
          p++;
        }
      }
      // Check for octal
      else if (ch === '0' && isDigit(preprocessedSource[p])) {
        sym = TokenType.OTC;
        while (p < preprocessedSource.length && /[0-7]/.test(preprocessedSource[p])) {
          currentToken += preprocessedSource[p];
          p++;
        }
      }

      tokens.push({ type: sym, lexeme: currentToken });
      continue;
    }

    // String constant
    if (ch === '"') {
      sym = TokenType.STRING_CONST;
      currentToken += ch;
      p++;
      while (p < preprocessedSource.length && preprocessedSource[p] !== '"') {
        currentToken += preprocessedSource[p];
        p++;
      }
      if (p < preprocessedSource.length) {
        currentToken += preprocessedSource[p]; // Closing "
        p++;
      } else {
        errors.push("Unterminated string literal");
      }
      tokens.push({ type: sym, lexeme: currentToken });
      continue;
    }

    // Character constant
    if (ch === '\'') {
      sym = TokenType.CHAR_CONST;
      currentToken += ch;
      p++;
      while (p < preprocessedSource.length && preprocessedSource[p] !== '\'') {
        currentToken += preprocessedSource[p];
        p++;
      }
      if (p < preprocessedSource.length) {
        currentToken += preprocessedSource[p]; // Closing '
        p++;
      } else {
        errors.push("Unterminated character literal");
      }
      tokens.push({ type: sym, lexeme: currentToken });
      continue;
    }

    // Special symbols
    if (specialSymbols.includes(ch)) {
      currentToken += ch;
      sym = TokenType.PLUS; // default

      switch (ch) {
        case '+':
          sym = TokenType.PLUS;
          break;
        case '-':
          sym = TokenType.MINUS;
          break;
        case ',':
          sym = TokenType.COMMA;
          break;
        case '/':
          sym = TokenType.DIV;
          break;
        case '=':
          // Check for ==
          if (preprocessedSource[p + 1] === '=') {
            currentToken += '=';
            sym = TokenType.EQ;
            p++;
          } else {
            sym = TokenType.ASSIGN;
          }
          break;
        case '<':
          // Check for <=
          if (preprocessedSource[p + 1] === '=') {
            currentToken += '=';
            sym = TokenType.LEQ;
            p++;
          } else {
            sym = TokenType.LT;
          }
          break;
        case '>':
          // Check for >=
          if (preprocessedSource[p + 1] === '=') {
            currentToken += '=';
            sym = TokenType.GEQ;
            p++;
          } else {
            sym = TokenType.GT;
          }
          break;
        case '{':
          sym = TokenType.LBRACE;
          stacks['{'].push(ch);
          break;
        case '}':
          sym = TokenType.RBRACE;
          if (stacks['{'].length > 0) stacks['{'].pop();
          else errors.push("Unmatched }");
          break;
        case ';':
          sym = TokenType.SEMICOLON;
          break;
        case '(':
          sym = TokenType.LPAREN;
          stacks['('].push(ch);
          break;
        case ')':
          sym = TokenType.RPAREN;
          if (stacks['('].length > 0) stacks['('].pop();
          else errors.push("Unmatched )");
          break;
        case '&':
          // Check for &&
          if (preprocessedSource[p + 1] === '&') {
            currentToken += '&';
            sym = TokenType.AND;
            p++;
          } else {
            sym = TokenType.AMP;
          }
          break;
        case '!':
          // Check for !=
          if (preprocessedSource[p + 1] === '=') {
            currentToken += '=';
            sym = TokenType.NEQ;
            p++;
          } else {
            sym = TokenType.EXCLAM;
          }
          break;
        case '#':
          sym = TokenType.HASH;
          break;
        case '[':
          sym = TokenType.LBRACKET;
          stacks['['].push(ch);
          break;
        case ']':
          sym = TokenType.RBRACKET;
          if (stacks['['].length > 0) stacks['['].pop();
          else errors.push("Unmatched ]");
          break;
        default:
          sym = TokenType.ERROR;
      }

      tokens.push({ type: sym, lexeme: currentToken });
      p++;
      continue;
    }

    // If character does not match any token
    errors.push(`Unknown character: ${ch}`);
    p++;
  }

  // After processing, check for unmatched brackets
  if (stacks['{'].length > 0) errors.push("Unmatched {");
  if (stacks['['].length > 0) errors.push("Unmatched [");
  if (stacks['('].length > 0) errors.push("Unmatched (");

  return { tokens, errors, processedCode: preprocessedSource };
}

export default lexer;
