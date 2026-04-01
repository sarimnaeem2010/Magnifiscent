import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import emailRouter from "./email.js";
import emailConfigRouter from "./emailConfig.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";
import settingsRouter from "./settings.js";
import dealsRouter from "./deals.js";
import discountCodesRouter from "./discountCodes.js";
import contentRouter from "./content.js";
import adminRouter from "./admin.js";
import exportImportRouter from "./exportImport.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(exportImportRouter);
router.use(emailConfigRouter);
router.use(emailRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(settingsRouter);
router.use(dealsRouter);
router.use(discountCodesRouter);
router.use(contentRouter);

export default router;
