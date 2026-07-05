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
            .regex(
                /^[a-zA-Z]+$/,
                "First Name can only contain letters"
            )
            .trim(),

    lastName: z.string()
            .max(15, "Last name must at be at most 15 chars")
            .regex(
                /^[a-zA-Z]+$/,
                "Last Name can only contain letters"
            )
            .trim(),

    password: z.string()
            .min(6, "Password must be at least 6 characters")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[^\w\s]/, "Password must contain at least one special character")
});

export const ZodSignInSchema = z.object({
    username: z.string()
            .trim()
            .toLowerCase()
            .min(3, "Invalid username or password")
            .max(10, "Invalid username or password")
            .regex(
                /^[a-z0-9]+$/,
                "Invalid username or password"
            ),

    password: z.string()
            .min(6, "Invalid username or password")
            .regex(/\d/, "Invalid username or password")
            .regex(/[^\w\s]/, "Invalid username or password")
});

export const ZodUpdateSchema = ZodUserSchema.pick({
    username: true,
    firstName: true,
    lastName: true,
}).partial();

export const ZodTransferSchema = z.object({
    to: z.string(),
    amount: z.number().positive()
});

/* -------------------------------------------------------------------------------------------------------------------------------------- */

export type User = z.infer<typeof ZodUserSchema>;

const UserMongooseSchema = new Schema<User>({
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
    },
}, {
    versionKey: false,
});

type Account = {
    userId: mongoose.Types.ObjectId,
    balance: number
};

const AccountMongooseSchema = new Schema<Account>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: () => Math.floor(Math.random() * 10000) + 1,
        min: 0
    }
});

export const UserModel = mongoose.model<User>('User', UserMongooseSchema);
export const AccountModel = mongoose.model<Account>('Account', AccountMongooseSchema);