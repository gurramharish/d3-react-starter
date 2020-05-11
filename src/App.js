import React from 'react';
import './App.css';
import ChartWrapper from './ChartWrapper';
import NavBar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import LineGraph from './react-chart-components/LineGraph';

function App() {
  return (
    <div className="App">
      <NavBar bg="light">
        <NavBar.Brand>BarChartly</NavBar.Brand>
      </NavBar>
      <Container>
        <LineGraph />
      </Container>
    </div>
  );
}

export default App;
