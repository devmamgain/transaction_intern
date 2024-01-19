const express = require('express');
const mongoose = require('mongoose');
const mongooseconnect = require("./mongoose/mongooseconnect")
const sendingdata = require("./sendingdata")
const cors = require("cors");
const app = express();
const PORT = 8000;
app.use(cors());
app.use(express.json());
const transactionroute = require("./routes/transaction.route")
const statisticsroute = require ("./routes/statisics.route")
const barchart = require("./routes/barchart.route")

const piechart = require("./routes/piechart.route");
const { default: axios } = require('axios');

mongooseconnect()
sendingdata()

app.use("/",transactionroute)
app.use("/",statisticsroute)
app.use("/",barchart)
app.use("/",piechart)

app.get('/api/combined-data/:month', async (req, res) => {
  try {
    const { month } = req.params;

    const transactions = await axios.get(`http://localhost:${PORT}/api/transactions?month=${month}`);
    const statistics = await axios.get(`http://localhost:${PORT}/api/statistics/${month}`);
    const barChart = await axios.get(`http://localhost:${PORT}/api/bar-chart/${month}`);
    const pieChart = await axios.get(`http://localhost:${PORT}/api/pie-chart/${month}`);

    res.json({
      success: true,
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching combined data' });
  }
});
mongoose.connection.once("open", () => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || PORT, () => {
      console.log("Server is Up and Running");
    });
  });