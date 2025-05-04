// import { GeneralController } from '@/controllers/general.controller';
// import { Routes } from '@/interfaces/routes.interface';

// import { Router } from 'express';

// export class GeneralRoute implements Routes {
//   public path = '/general';
//   public router = Router();
//   public general = new GeneralController();

//   constructor() {
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     this.router.get(
//       `${this.path}/statistics`,
//       // AuthMiddleware,
//       this.general.getStatistics,
//     );
//     this.router.get(
//       `${this.path}/revenue-by-category`,
//       // AuthMiddleware,
//       this.general.getRevenueByCategory,
//     );
//     this.router.get(
//       `${this.path}/order-in-timeline`,
//       // AuthMiddleware,
//       this.general.getOrderInTimeline,
//     );
//   }
// }
