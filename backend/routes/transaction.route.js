const express = require('express');
const router = express.Router();
const Transaction = require("../datamodels/transactionmodel");

router.route('/api/transactions')
.get( async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const skip = (page - 1) * perPage;

    const query = search
      ? {
        $or: [
          { dateOfSale: { $gte: new Date(`${month}-01`), $lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)) } },
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { price: { $regex: search, $options: 'i' } },
          ],

        }
      ]
    }
      : {
        dateOfSale: { $gte: new Date(`${month}-01`), $lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)) },
      };

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(perPage));

    res.json({ success: true, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
});

  
module.exports = router;
