"use server"

import { scrapeAmazonProduct } from "../scraper/index"

export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return;

    try {
        const scapedProduct = await scrapeAmazonProduct(productUrl);

        if (!scapedProduct) return;

        
    } catch (error: any) {
        throw new Error(`failed to create or update product: ${error.message}`)
    }
};