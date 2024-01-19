// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import"./DashbBoard.css"
const DashBoard = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('2022-03'); // Default to March
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState([]);
  
    useEffect(() => {
      fetchTransactions();
      fetchStatistics();
      fetchBarChartData();
    }, [selectedMonth, currentPage]);
  
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/transactions?month=${selectedMonth}&search=${searchText}&page=${currentPage}`);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
  
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/statistics/${selectedMonth}`);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
  
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bar-chart/${selectedMonth}`);
        setBarChartData(response.data.barChartData);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };
  
    const handleNextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };
  
    const handleMonthChange = (event) => {
      setSelectedMonth(event.target.value);
    };
  
    const handleSearchChange = (event) => {
      setSearchText(event.target.value);
    };
  
    return (
        <div className="app">
        <div className="transactions-table">
          <label>Select Month:</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => {
              const monthValue = `${new Date(2022, i, 1).toISOString().substring(0, 7)}`;
              return (
                <option key={monthValue} value={monthValue}>
                  {new Date(`${monthValue}-01`).toLocaleString('en-US', { month: 'short', year: 'numeric' })}
                </option>
              );
            })}
          </select>
          <input type="text" placeholder="Search transaction" value={searchText} onChange={handleSearchChange} />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handlePrevPage}>Previous</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
  
        <div className="transactions-statistics">
          <h2>Transactions Statistics</h2>
          <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
          <p>Total Sold Items: {statistics.totalSoldItems}</p>
          <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
  
        <div className="transactions-bar-chart">
          <h2>Transactions Bar Chart</h2>
          <ul>
            {barChartData.map((item) => (
              <li key={item.range}>
                {item.range}: {item.count} items
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default DashBoard;
