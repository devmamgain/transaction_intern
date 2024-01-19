const express = require('express');
const router = express.Router();
const Transaction = require("../datamodels/transactionmodel");

router.route('/api/bar-chart/:month')
.get(async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity },
      ];
  
      const barChartData = [];
  
      for (const range of priceRanges) {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: startDate, $lt: endDate },
          price: { $gte: range.min, $lte: range.max },
        });
  
        barChartData.push({ range: `${range.min}-${range.max}`, count });
      }
  
      res.json({ success: true, barChartData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching bar chart data' });
    }
  });
  module.exports = router;
