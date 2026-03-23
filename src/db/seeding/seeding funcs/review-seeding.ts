import {v4 as uuidv4} from "uuid"
import {default as reviewContents} from "./../seeding data/hotel/review-contents.json" with {type:"json"} 
import { get_rand_arr_item, roll_chance_binary, roll_chance_multi } from "../seedingutils.ts";

type ReviewContentType = typeof reviewContents

interface Review {
    review_id:string,
    author_id:number,
    address_id:string,
    rating:number,
    contents?:string
}

export function generateReview(
    hid:string,
    averageStarRating:number,
    authorSSN:number
) {
    // review_id   UUID    PRIMARY KEY,
    // author_id   INTEGER NOT NULL,
    // address_id  UUID    NOT NULL,
    // rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
    // contents    TEXT,

    const review_id = uuidv4();
    const ratingPercentage = generateRatingPercentage(averageStarRating);

    const rating = roll_chance_multi(ratingPercentage, [1, 2, 3, 4, 5])

    const hasContent = roll_chance_binary(30) 

    const review:Review = {
        review_id,
        author_id: authorSSN,
        address_id: hid,
        rating
    }

    if (hasContent) {
        const reviewContentPossibilities = reviewContents[rating as keyof ReviewContentType]
        review.contents = get_rand_arr_item(reviewContentPossibilities)
    }

    return review
    
}

function generateRatingPercentage(averageStarRating:number) {
    if (averageStarRating == 1) {
        return [60, 20, 10, 2, 8];
    } else if (averageStarRating == 2) {
        return [15, 50, 15, 10, 10];
    } else if (averageStarRating == 3) {
        return [10, 20, 40, 20, 10];
    } else if (averageStarRating == 4) {
        return [10, 5, 15, 50, 20];
    } else {
        return [10, 5, 5, 20, 60];
    }
}