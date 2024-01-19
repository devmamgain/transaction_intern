const express = require('express');
const router = express.Router();
const Transaction = require("../datamodels/transactionmodel");

router.route('/api/statistics/:month')
.get( async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  
      const totalSaleAmount = await Transaction.aggregate([
        {
          $match: {
            dateOfSale: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' },
          },
        },
      ]);
  
      const totalSoldItems = await Transaction.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
      });
  
      const totalNotSoldItems = await Transaction.countDocuments({
        dateOfSale: null,
      });
  
      res.json({
        success: true,
        totalSaleAmount: totalSaleAmount[0]?.total || 0,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
  });
module.exports = router;
