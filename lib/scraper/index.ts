import axios from "axios";
import * as cheerio from "cheerio"
import { extractCurrency, extractDescription, extractPrice } from "../utils";
import { number } from "astro/zod";

export async function scrapeAmazonProduct(url: string) {
    
    if (!url) return;

    // BrightData proxy configuration.

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random() | 0);
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: "brd.superproxy.io",
        port,
        rejectUnauthorized: false,
    }

    try {
        const response = await axios.get(url, options);
        // initialize cheerio and pass it the data we scrape
        const $ = cheerio.load(response.data);

        // pick spect ID's or classes you want to query and store.
        const title = $(`#productTitle`).text().trim();

        // scrape these elements from the amazon page for the current price
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a.price.a-text-price')
        );
         // scrape these elements from the amazon page for the non sale price
        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('a.size-base.a-color-price')
        )
        
        // check if the item is available
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'current unavailable'
        
        // Picture(s) of the item(s)
        const imageElement = $('#imgBlkFront, #landingImage');
        const imageData = imageElement.attr('data-a-dynamic-image');
        let image: string | undefined;
        if (imageData) {
            const imageJSON = JSON.parse(imageData);
            // Get the first URL from the parsed JSON object
            image = Object.keys(imageJSON)[0];
        }

        // we define extractCurrency Utility in a seperate file to keep code clean 
        const currency = extractCurrency($('.a-price-symbol'));

        // Extract the discount rate text and extract numbers followed by a percent sign
        let discountRateMatch: RegExpMatchArray | null = $('.savingsPercentage').text().match(/\d+%?/);
        // Ensure the discount rate is a string
        let discountRate: string = discountRateMatch ? discountRateMatch[0] : "";

        const description = extractDescription($)





        // this data had to be converted toa number here before using it in the data object
        let parsedDiscountRate: number = parseFloat(discountRate.replace('%', ''));
        
        // Construct Data Object To Dispaly The Sanatized DATA (cuh)
        const data = {
            url,
            currency: currency || '$',
            image,
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(currentPrice) || Number(currentPrice),
            discountRate: parsedDiscountRate,
            priceHistory: [],
            category: 'category',
            reviewCount: 100,
            stars: 4.20,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }

        return data;
    } catch (error: any) {
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
};