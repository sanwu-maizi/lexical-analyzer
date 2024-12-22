// // index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// // import MainApp from './MainApp'; // 渲染 MainApp 作为根组件
// import App from './App'; // 渲染 MainApp 作为根组件
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App /> {/* 渲染主应用组件 */}
//   </React.StrictMode>
// );

// reportWebVitals();


// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './MainApp'; // 渲染 MainApp 作为根组件
// import App from './App'; // 渲染 MainApp 作为根组件
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp /> {/* 渲染主应用组件 */}
  </React.StrictMode>
);

reportWebVitals();
