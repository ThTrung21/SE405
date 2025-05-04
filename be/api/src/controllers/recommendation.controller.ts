// import { Request, Response, NextFunction } from 'express';
// import { Container } from 'typedi';
// import { RecommendationService } from '@services/recommendation.service';
// import { Dish } from '@interfaces/dishes.interface';

// export class RecommendationController {
//   public recommendationService = Container.get(RecommendationService);

//   public getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const userId = Number(req.params.userId);

//     try {
//       const recommendations: Dish[] = await this.recommendationService.getRecommendations(userId);
//       res.status(200).json({ data: recommendations, message: 'recommendations' });
//     } catch (error) {
//       next(error);
//     }
//   };
// }
