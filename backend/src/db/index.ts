import mongoose, { Schema } from 'mongoose';
import * as z from 'zod';

export const connectDB = async() => {
    const mongoUrl = process.env.MONGO_CONN_URL!;

    if (!mongoUrl) {
        throw new Error("Mongo connection URL missing");
    }
    
    await mongoose.connect(mongoUrl);
};

export const ZodUserSchema = z.object({
    username: z.string()
            .trim()
            .toLowerCase()
            .min(3, "Username must be at least 3 characters")
            .max(10, "Username must be at most 10 characters")
            .regex(
                /^[a-z0-9]+$/,
                "Username can only contain lowercase letters (a-z) and numbers (0-9)"
            ),

    firstName: z.string()
            .max(15, "First name must at be at most 15 chars")
            .trim(),

    lastName: z.string()
            .max(15, "Last name must at be at most 15 chars")
            .trim(),

    password: z.string()
            .min(6, "Password must be at least 6 characters")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[^\w\s]/, "Password must contain at least one special character")
});

export type User = z.infer<typeof ZodUserSchema>;

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
        select: false
    }
});

export const UserModel = mongoose.model<User>('User', userMongooseSchema);