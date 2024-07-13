import React from 'react';
import './App.css';
import TreeVisualization from './components/TreeVisualization/TreeVisualization';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Family Tree Project</h1>
        <TreeVisualization />
      </header>
    </div>
  );
}

export default App
