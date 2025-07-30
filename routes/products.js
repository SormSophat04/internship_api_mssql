// routes/products.js
const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db");

// CREATE product
router.post("/", async (req, res) => {
  const { ProductName, Price, Stock } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("ProductName", ProductName)
      .input("Price", Price)
      .input("Stock", Stock)
      .query(
        "INSERT INTO Products (ProductName, Price, Stock) VALUES (@ProductName, @Price, @Stock)"
      );
    res.status(201).send("Product created");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READ all products
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Products");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READ single product
router.get("/:Id", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Id", req.params.Id)
      .query("SELECT * FROM Products WHERE Id = @Id");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE product
router.put("/:Id", async (req, res) => {
  const { ProductName, Price, Stock } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Id", req.params.Id)
      .input("ProductName", ProductName)
      .input("Price", Price)
      .input("Stock", Stock)
      .query(
        "UPDATE Products SET ProductName = @ProductName, Price = @Price, Stock = @Stock WHERE Id = @Id"
      );
    res.send("Product updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE product
router.delete("/:Id", async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Id", req.params.Id)
      .query("DELETE FROM Products WHERE Id = @Id");
    res.send("Product deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
