// import { GeneralService } from '@/services/general.service';
// import { Request, Response, NextFunction } from 'express';
// import Container from 'typedi';

// export class GeneralController {
//   general = Container.get(GeneralService);

//   public getStatistics = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await this.general.getStatistics();

//       res.status(200).json({ data, message: 'getStatistics' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public getRevenueByCategory = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await this.general.getRevenueByCategory();

//       res.status(200).json({ data, message: 'getRevenueByCategory' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public getOrderInTimeline = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await this.general.getOrderInTimeline();

//       res.status(200).json({ data, message: 'getOrderInTimeline' });
//     } catch (error) {
//       next(error);
//     }
//   };
// }
