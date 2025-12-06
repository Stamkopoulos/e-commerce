import { Router } from "express";


const router = Router();

//Public
router.get('/collections', (req, res) => {
  res.send('All Collections');
})

export default router;