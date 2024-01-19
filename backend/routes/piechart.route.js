const express = require('express');
const router = express.Router();
const Transaction = require("../datamodels/transactionmodel");

router.route('/api/pie-chart/:month')
.get(async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  
      const categories = await Transaction.distinct('category', {
        dateOfSale: { $gte: startDate, $lt: endDate },
      });
  
      const pieChartData = [];
  
      for (const category of categories) {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: startDate, $lt: endDate },
          category,
        });
  
        pieChartData.push({ category, count });
      }
  
      res.json({ success: true, pieChartData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching pie chart data' });
    }
  })

module.exports = router;
