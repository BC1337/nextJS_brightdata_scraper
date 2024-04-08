"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

// ensures that the link comes from amazon specifically and nothing else
const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.endsWith('amazon')
      ) {
        return true;
      }
  } catch (error) {
    return false;
  }
  return false;
}

// Main searchbar component
const Searchbar = () => {
  const [searchPrompt, setsearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const isValidLink = isValidAmazonProductUrl(searchPrompt);

      if (!isValidLink) return alert("Please provide a valid amazon link!");

      try {
        setIsLoading(true);
        
        // Scrape the product page through a server action
        const product = await scrapeAndStoreProduct(searchPrompt)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <form 
    className="flex flex-wrap gap-4 mt-12"
    onSubmit={handleSubmit}
    >

    <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setsearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
    />
    <button
      type="submit"
      className="searchbar-btn"
      disabled={searchPrompt === ''} // implicit return boolean check
    >
      {isLoading ? 'Searching...' : 'Search'}
    </button>
    </form>
  )
}

export default Searchbar