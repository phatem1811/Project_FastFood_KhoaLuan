import { reviewService } from "../services/reviewService";
import { StatusCodes } from "http-status-codes";



const createNew = async (req, res, next) => {
    try {
      
        const createNew = await reviewService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getReviewsByProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewService.getByProduct(productId);
        res.status(200).json(reviews);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const reviewController = {
    createNew, getReviewsByProduct
}
