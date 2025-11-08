import logo from './logo.svg';
import './App.css';

function letsGO() {
  return "We letsGO!";
}

function App() {
  return (
    <div className="App">
      {/* <h1>{letsGO()}</h1> */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Rect
        </a>
      </header>
      <h1>{letsGO()}</h1>
    </div>
  );
}

// function letsGO() {
//   return "We letsGO!";
// }

// function App() {
//   return (
//     <div className="App">
//       <h1>{letsGO()}</h1>
//     </div>
//   );
// }

// export default App;

export default App;
