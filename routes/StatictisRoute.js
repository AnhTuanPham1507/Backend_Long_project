const { Router } = require("express");
const router = Router({ mergeParams: true });

const { CustomError } = require("../errors/CustomError");
const statictisService = require("../services/StatisticService");

router
    .get("/revenue", async (req, res) => {
        try {
            const foundRevenue = await statictisService.getRevenue();
            res.status(200).json(foundRevenue);
        } catch (error) {
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message });
            else res.status(500).json({ message: "Server has something wrong!!" });
        }
    })
    .get("/topSoldProduct", async (req, res) => {
        try {
            const topSoldProducts = await statictisService.getTopSoldProducts();
            res.status(200).json(topSoldProducts);
        } catch (error) {
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message });
            else res.status(500).json({ message: "Server has something wrong!!" });
        }
    })

module.exports = { router };
