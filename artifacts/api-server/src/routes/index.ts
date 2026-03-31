import { Router, type IRouter } from "express";
import healthRouter from "./health";
import emailRouter from "./email";
import emailConfigRouter from "./emailConfig";

const router: IRouter = Router();

router.use(healthRouter);
router.use(emailConfigRouter);
router.use(emailRouter);

export default router;
