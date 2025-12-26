import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Configuration
const BULK_IMPORT_DIR = path.join(process.cwd(), 'bulk_import');
const DRY_RUN = false;

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

// Database Connection
const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing in .env");
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected for Bulk Upload");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
};

// Utils
const uploadToCloudinary = async (filePath) => {
    try {
        if (DRY_RUN) return "https://via.placeholder.com/150";
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "blinkit_clone_products"
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${filePath}:`, error);
        return null; // Return null on failure
    }
};

const findOrCreateCategory = async (name) => {
    let category = await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (!category) {
        console.log(`Creating Category: ${name}`);
        if (!DRY_RUN) {
            category = await CategoryModel.create({
                name: name,
                image: ""
            });
        }
    }
    return category;
};

const findOrCreateSubCategory = async (name, categoryId) => {
    let subCategory = await SubCategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (!subCategory) {
        console.log(`Creating SubCategory: ${name}`);
        if (!DRY_RUN) {
            subCategory = await SubCategoryModel.create({
                name: name,
                image: "",
                category: [categoryId]
            });
        }
    } else {
        if (!DRY_RUN && !subCategory.category.includes(categoryId)) {
            subCategory.category.push(categoryId);
            await subCategory.save();
        }
    }
    return subCategory;
};

// Simple RTF Stripper (Basic)
const stripRtf = (rtf) => {
    // Remove RTF control words and groups
    return rtf.replace(/\\par[d]?/g, '\n')
        .replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, '')
        .trim();
};

const processProductFolder = async (folderPath, categoryName, subCategoryName) => {
    const folderName = path.basename(folderPath);
    const files = fs.readdirSync(folderPath);

    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    const rtfFile = files.find(f => f.endsWith('.rtf'));

    if (imageFiles.length === 0) {
        console.warn(`No images found in ${folderPath}, skipping.`);
        return;
    }

    console.log(`Processing Product in: ${folderPath}`);

    // 1. Prepare Data
    let productData = {
        name: folderName,
        price: Math.floor(Math.random() * (1000 - 50 + 1)) + 50, // Random 50-1500
        stock: Math.floor(Math.random() * (150 - 10 + 1)) + 10,  // Random 10-150
        unit: 1,
        discount: Math.floor(Math.random() * (40 - 1 + 1)) + 1, // Random 1-40%
        description: `Fresh ${folderName} from ${subCategoryName}`,
        more_details: {}
    };

    // Read clean Description from RTF if available
    if (rtfFile) {
        try {
            const rtfContent = fs.readFileSync(path.join(folderPath, rtfFile), 'utf-8');
            const cleanText = stripRtf(rtfContent);
            if (cleanText.length > 5) {
                productData.description = cleanText;
            }
        } catch (e) {
            console.warn("Failed to read RTF, using default description.");
        }
    }

    // 2. Upload Images
    const uploadedImages = [];
    for (const imageFile of imageFiles) {
        // Upload sequentially
        const url = await uploadToCloudinary(path.join(folderPath, imageFile));
        if (url) uploadedImages.push(url);
    }
    productData.image = uploadedImages;

    // 3. Resolve Relations
    const category = await findOrCreateCategory(categoryName);
    const subCategory = await findOrCreateSubCategory(subCategoryName, category?._id);

    if (!category || !subCategory) {
        console.error("Failed to resolve category/subcategory structure.");
        return;
    }

    productData.category = [category._id];
    productData.subCategory = [subCategory._id];

    // 4. Save Product
    if (!DRY_RUN) {
        const existing = await ProductModel.findOne({ name: productData.name });
        if (existing) {
            console.log(`Product ${productData.name} already exists. Updating...`);
            // await ProductModel.updateOne({ _id: existing._id }, productData);
        } else {
            await ProductModel.create(productData);
            console.log(`SUCCESS: Added ${productData.name}`);
        }
    } else {
        console.log("DRY RUN: Would save:", JSON.stringify(productData, null, 2));
    }
};

const traverseDirectory = async (currentPath, depth = 0) => {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            if (depth === 0) {
                // Entering Category
                await traverseDirectory(itemPath, depth + 1);
            } else if (depth === 1) {
                // Entering SubCategory
                await traverseDirectory(itemPath, depth + 1);
            } else if (depth === 2) {
                // This is a Product Folder
                const pathParts = itemPath.split(path.sep);
                const subCategoryName = pathParts[pathParts.length - 2];
                const categoryName = pathParts[pathParts.length - 3];

                await processProductFolder(itemPath, categoryName, subCategoryName);
            }
        }
    }
};

// Start
const run = async () => {
    await connectDB();

    if (!fs.existsSync(BULK_IMPORT_DIR)) {
        console.error(`Bulk import directory not found: ${BULK_IMPORT_DIR}`);
        process.exit(1);
    }

    console.log("Starting Bulk Upload (Default Mode - No AI)...");
    await traverseDirectory(BULK_IMPORT_DIR);
    console.log("Bulk Upload Complete.");
    process.exit(0);
};

run();
