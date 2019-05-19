import { Router } from "express";

const router = new Router();

router.get("/user", (req, res) => {
    res.json(req.user);
});

export default router;