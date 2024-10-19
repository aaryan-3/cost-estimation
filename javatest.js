async function loadFlightData() {
    const response = await fetch('jsontest.json');
    const data = await response.json();
    return data;
  }
  
  // Populate the airline filter dropdown
  async function populateAirlineFilter() {
    const data = await loadFlightData();
    const airlineSelect = document.getElementById('airline-select');
  
    const airlines = [...new Set(data.map(flight => flight.airline))];
    airlines.forEach(airline => {
      const option = document.createElement('option');
      option.value = airline;
      option.textContent = airline;
      airlineSelect.appendChild(option);
    });
  }
  
  // Display flights in the table
  function displayFlights(data) {
    const tableBody = document.getElementById('flight-table').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear previous data
  
    data.forEach(flight => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${flight.airline}</td>
        <td>${flight.flightTime}</td>
        <td>${flight.fuel}</td>
        <td>${flight.cost}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Plot Flight Time vs Fuel Consumption
  function plotFlightTimeVsFuel(data) {
    const trace = {
      x: data.map(flight => flight.flightTime),
      y: data.map(flight => flight.fuel),
      mode: 'markers',
      type: 'scatter',
      marker: { size: 10, color: 'blue' }
    };
  
    const layout = {
      title: 'Flight Time vs Fuel Consumption',
      xaxis: { title: 'Flight Time (minutes)' },
      yaxis: { title: 'Fuel Consumption (gallons)' }
    };
  
    Plotly.newPlot('flight-time-chart', [trace], layout);
  }
  
  // Plot Airline vs Total Cost
  function plotAirlineVsCost(data) {
    const airlines = [...new Set(data.map(flight => flight.airline))];
    const costs = airlines.map(airline =>
      data.filter(flight => flight.airline === airline).reduce((sum, flight) => sum + flight.cost, 0)
    );
  
    const trace = {
      x: airlines,
      y: costs,
      type: 'bar'
    };
  
    const layout = {
      title: 'Total Cost per Airline',
      xaxis: { title: 'Airline' },
      yaxis: { title: 'Total Cost ($)' }
    };
  
    Plotly.newPlot('fuel-cost-chart', [trace], layout);
  }
  
  // Load and filter flights based on selected airline
  async function loadFilteredFlights() {
    const data = await loadFlightData();
    const selectedAirline = document.getElementById('airline-select').value;
  
    const filteredData = selectedAirline
      ? data.filter(flight => flight.airline === selectedAirline)
      : data;
  
    displayFlights(filteredData);
    plotFlightTimeVsFuel(filteredData);
    plotAirlineVsCost(filteredData);
  }
  
  // Initialize the app
  window.onload = async () => {
    await populateAirlineFilter();
    loadFilteredFlights();
  };
