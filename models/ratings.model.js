import mongoose from "mongoose";

const ratingsSchema = new mongoose.Schema(

    {
        postBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        carId: {
            type: mongoose.Types.ObjectId,
            ref: "Cars"
        },
        bookingId: {
            type: mongoose.Types.ObjectId,
            ref: "Bookings"
        },
        comment: {
            type: String,
        },
        star: {
            type: Number
        }
    },
    { timestamps: true }
);

const Ratings = mongoose.model('Ratings', ratingsSchema)
export default Ratings;