import mongoose, { Schema } from 'mongoose';
import * as z from 'zod';

export const connectDB = async() => {
    try{
        const mongoUrl = process.env.MONGO_CONN_URL as string;
        if (!mongoUrl) {
            throw new Error("Mongo connection URL missing");
        }
        await mongoose.connect(mongoUrl);
    } catch (error){
        console.log(error);
    }
}

export const userSchema = z.object({
    username: z.string()
            .min(3, "Username must be at least 3 chars")
            .max(10, "Username must be at most 10 chars")
            .trim()
            .toLowerCase(),

    firstName: z.string()
            .max(15, "First name must at be at most 15 chars")
            .trim(),

    lastName: z.string()
            .max(15, "Last name must at be at most 15 chars")
            .trim(),

    password: z.string()
            .min(6, "Password must be at least 6 characters")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/, "Password must contain at least one special character")
});

export type User = z.infer<typeof userSchema>;

const userMongooseSchema = new Schema<User>({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 10
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15
    },
    password: {
        type: String,
        required: true,
    }
});

export const UserModel = mongoose.model<User>('User', userMongooseSchema);