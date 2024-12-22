// parser.js
export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.p = 0; // 当前处理的单词指针
    this.flag = 0; // 错误标志
    // 对应C++中:
    // program:
    //   cout << "program";
    //   Ans = "--> block\n       ";
    //   cout << Ans;
    this.Ans = "--> block\n       ";
    this.steps = [];
    // 输出程序开始
    this.steps.push("program");
    this.steps.push(this.Ans);
  }

  parse() {
    this.program();
    if (this.flag === 0) {
      this.steps.push("语法分析成功！");
      return { success: true, steps: this.steps };
    } else {
      this.steps.push("语法分析失败！");
      return { success: false, steps: this.steps };
    }
  }

  currentLexeme() {
    return this.p < this.tokens.length ? this.tokens[this.p].lexeme : null;
  }

  currentType() {
    return this.p < this.tokens.length ? this.tokens[this.p].type : null;
  }

  match(lex) {
    if (this.currentLexeme() === lex) {
      this.p++;
      return true;
    }
    return false;
  }

  isID() {
    return this.currentType() === 101; // ID
  }

  isNum() {
    const t = this.currentType();
    return t >= 98 && t <= 100; // num
  }

  error() {
    if (this.flag === 0) {
      this.steps.push("语法分析出错！");
    }
    this.flag = 1;
  }

  // 与C++代码一致:
  // program:
  //   print("program")
  //   Ans = "--> block\n       "
  //   block()
  program() {
    // 在构造函数中已经输出了program和Ans
    this.block();
  }

  // block -> { stmts }
  block() {
    if (this.match("{")) {
      let pos = this.Ans.indexOf("block");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "{stmts}" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.stmts();
      if (this.flag === 1) return;
      if (!this.match("}")) this.error();
    } else {
      this.error();
    }
  }

  // stmts -> stmt stmts | ε
  stmts() {
    const lex = this.currentLexeme();
    // stmt的FIRST集：ID(101), if, while, do, break, {
    if (this.isID() || lex === "if" || lex === "while" || lex === "do" || lex === "break" || lex === "{") {
      let pos = this.Ans.indexOf("stmts");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "stmtstmts" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.stmt();
      if (this.flag === 1) return;
      this.stmts();
      if (this.flag === 1) return;
    } else {
      // stmts -> ε
      let pos = this.Ans.indexOf("stmts");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      return;
    }
  }

  // stmt的产生式与C++对应:
  // stmt -> id=expr; | while(bool)stmt | do stmt while(bool) | break | block | if(bool)stmt stmt1
  stmt() {
    const lex = this.currentLexeme();

    if (this.isID()) {
      // stmt -> id=expr;
      let pos = this.Ans.indexOf("stmt");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "id=expr;" + this.Ans.slice(pos + 4);
        this.steps.push(this.Ans);
      }
      this.p++;
      if (!this.match("=")) { this.error(); return; }
      this.expr();
      if (this.flag === 1) return;
      if (!this.match(";")) { this.error(); return; }
    } else if (lex === "while") {
      // stmt -> while(bool)stmt
      let pos = this.Ans.indexOf("stmt");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "while(bool)stmt" + this.Ans.slice(pos + 4);
        this.steps.push(this.Ans);
      }
      this.p++;
      if (!this.match("(")) { this.error(); return; }
      this.booL();
      if (this.flag === 1) return;
      if (!this.match(")")) { this.error(); return; }
      this.stmt();
      if (this.flag === 1) return;
    } else if (lex === "do") {
      // stmt -> do stmt while(bool)
      let pos = this.Ans.indexOf("stmt");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "dostmtwhile(bool)" + this.Ans.slice(pos + 4);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.stmt();
      if (this.flag === 1) return;
      if (!this.match("while")) { this.error(); return; }
      if (!this.match("(")) { this.error(); return; }
      this.booL();
      if (this.flag === 1) return;
      if (!this.match(")")) { this.error(); return; }
    } else if (lex === "break") {
      // stmt -> break
      let pos = this.Ans.indexOf("stmt");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "break" + this.Ans.slice(pos + 4);
        this.steps.push(this.Ans);
      }
      this.p++;
    } else if (lex === "{") {
      // stmt -> block
      let pos = this.Ans.indexOf("stmt");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "block" + this.Ans.slice(pos + 4);
        this.steps.push(this.Ans);
      }
      this.block();
    } else if (lex === "if") {
      // stmt -> if(bool)stmt stmt1
      this.p++;
      if (!this.match("(")) { this.error(); return; }
      let pos = this.Ans.indexOf("stmt");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "if(bool)stmt stmt1" + this.Ans.slice(pos + 4);
        this.steps.push(this.Ans);
      }
      this.booL();
      if (this.flag === 1) return;
      if (!this.match(")")) { this.error(); return; }
      this.stmt();
      if (this.flag === 1) return;
      this.stmt1();
      if (this.flag === 1) return;
    } else {
      this.error();
    }
  }

  // stmt1 -> else stmt | ε
  stmt1() {
    if (this.currentLexeme() === "else") {
      this.p++;
      let pos = this.Ans.indexOf("stmt1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "else stmt" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.stmt();
      if (this.flag === 1) return;
    } else {
      // ε
      return;
    }
  }

  // bool -> expr bool1
  booL() {
    let pos = this.Ans.indexOf("bool");
    if (pos !== -1) {
      this.Ans = this.Ans.slice(0, pos) + "exprbool1" + this.Ans.slice(pos + 4);
      this.steps.push(this.Ans);
    }
    this.expr();
    if (this.flag === 1) return;
    this.booL1();
    if (this.flag === 1) return;
  }

  // bool1 -> < expr | <= expr | > expr | >= expr | ε
  booL1() {
    const lex = this.currentLexeme();
    if (lex === "<" || lex === "<=" || lex === ">" || lex === ">=") {
      let pos = this.Ans.indexOf("bool1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + lex + "expr" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.expr();
      if (this.flag === 1) return;
    } else {
      // ε
      return;
    }
  }

  // expr -> term expr1
  expr() {
    let pos = this.Ans.indexOf("expr");
    if (pos !== -1) {
      this.Ans = this.Ans.slice(0, pos) + "termexpr1" + this.Ans.slice(pos + 4);
      this.steps.push(this.Ans);
    }
    this.term();
    if (this.flag === 1) return;
    this.expr1();
    if (this.flag === 1) return;
  }

  // expr1 -> + term | - term | ε
  expr1() {
    const lex = this.currentLexeme();
    if (lex === "+") {
      let pos = this.Ans.indexOf("expr1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "+term" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.term();
      if (this.flag === 1) return;
    } else if (lex === "-") {
      let pos = this.Ans.indexOf("expr1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "-term" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.term();
      if (this.flag === 1) return;
    } else {
      // ε
      let pos = this.Ans.indexOf("expr1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      return;
    }
  }

  // term -> factor term1
  term() {
    let pos = this.Ans.indexOf("term");
    if (pos !== -1) {
      this.Ans = this.Ans.slice(0, pos) + "factorterm1" + this.Ans.slice(pos + 4);
      this.steps.push(this.Ans);
    }
    this.factor();
    if (this.flag === 1) return;
    this.term1();
    if (this.flag === 1) return;
  }

  // term1 -> * factor | / factor | ε
  term1() {
    const lex = this.currentLexeme();
    if (lex === "*") {
      let pos = this.Ans.indexOf("term1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "*factor" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.factor();
      if (this.flag === 1) return;
    } else if (lex === "/") {
      let pos = this.Ans.indexOf("term1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "/factor" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.factor();
      if (this.flag === 1) return;
    } else {
      // ε
      let pos = this.Ans.indexOf("term1");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "" + this.Ans.slice(pos + 5);
        this.steps.push(this.Ans);
      }
      return;
    }
  }

  // factor -> (expr) | id | num
  factor() {
    const lex = this.currentLexeme();
    const t = this.currentType();
    if (lex === "(") {
      let pos = this.Ans.indexOf("factor");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "(expr)" + this.Ans.slice(pos + 6);
        this.steps.push(this.Ans);
      }
      this.p++;
      this.expr();
      if (this.flag === 1) return;
      if (!this.match(")")) { this.error(); return; }
    } else if (this.isID()) {
      let pos = this.Ans.indexOf("factor");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "id" + this.Ans.slice(pos + 6);
        this.steps.push(this.Ans);
      }
      this.p++;
    } else if (this.isNum()) {
      let pos = this.Ans.indexOf("factor");
      if (pos !== -1) {
        this.Ans = this.Ans.slice(0, pos) + "num" + this.Ans.slice(pos + 6);
        this.steps.push(this.Ans);
      }
      this.p++;
    } else {
      this.error();
    }
  }

}
