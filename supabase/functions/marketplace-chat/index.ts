import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Complete marketplace product catalog
const marketplaceData = {
  categories: ["Diamonds", "Gold", "Silver", "Platinum", "Sapphire"],
  
  diamonds: {
    description: "Certified, ethically sourced diamonds with exceptional clarity and brilliance",
    products: [
      "Round Brilliant Diamond", "Princess Cut Diamond", "Emerald Cut Diamond", "Oval Diamond",
      "Cushion Cut Diamond", "Marquise Diamond", "Pear Shape Diamond", "Radiant Cut Diamond",
      "Asscher Cut Diamond", "Heart Shape Diamond", "Trillion Diamond", "Baguette Diamond",
      "Rose Cut Diamond", "Old European Diamond", "Old Mine Diamond", "French Cut Diamond"
    ],
    clarityGrades: ["IF (Internally Flawless)", "VVS1", "VVS2", "VS1", "VS2", "SI1"],
    priceRange: "$5,000 - $25,000 per carat",
    weights: "0.5 ct - 3.5 ct"
  },
  
  gold: {
    description: "Pure gold bars, coins, and bullion. All products are certified and hallmarked",
    products: [
      "24K Gold Bar 100g", "24K Gold Bar 250g", "24K Gold Bar 500g", "24K Gold Bar 1kg",
      "22K Gold Coin 50g", "22K Gold Coin 100g", "Gold Krugerrand 1oz", "Gold Maple Leaf",
      "Gold American Eagle", "Gold Britannia", "Gold Philharmonic", "Gold Buffalo",
      "PAMP Suisse Gold", "Credit Suisse Gold", "Perth Mint Gold Bar"
    ],
    purityGrades: ["999.9 (24K)", "916 (22K)", "750 (18K)"],
    priceRange: "$1,500 - $30,000",
    weights: ["50g", "100g", "250g", "500g", "1kg", "1 oz"]
  },
  
  silver: {
    description: "Premium silver investments including bars, coins, and bullion at competitive prices",
    products: [
      "999 Silver Bar 1kg", "999 Silver Bar 5kg", "Sterling Silver Coin", "Silver Bullion 100oz",
      "American Silver Eagle", "Silver Maple Leaf", "Silver Britannia", "Silver Philharmonic",
      "Silver Krugerrand", "Silver Kangaroo", "PAMP Suisse Silver", "Perth Mint Silver"
    ],
    purityGrades: ["999 (Fine Silver)", "9999 (Ultra Fine)", "925 (Sterling)"],
    priceRange: "$30 - $3,000",
    weights: ["1 oz", "100g", "500g", "1kg", "5kg"]
  },
  
  platinum: {
    description: "Rare platinum products for discerning investors seeking portfolio diversification",
    products: [
      "Platinum Bar 100g", "Platinum Bar 250g", "Platinum Bar 500g", "Platinum Bar 1kg",
      "Platinum Eagle 1oz", "Platinum Maple Leaf", "Platinum Britannia", "Platinum Philharmonic",
      "PAMP Platinum Bar", "Credit Suisse Platinum", "Perth Mint Platinum"
    ],
    purityGrades: ["999.5"],
    priceRange: "$1,000 - $45,000",
    weights: ["1 oz", "100g", "250g", "500g", "1kg"]
  },
  
  sapphire: {
    description: "Exquisite natural sapphires sourced from the finest mines worldwide",
    products: [
      "Blue Sapphire Ceylon", "Kashmir Blue Sapphire", "Burmese Sapphire", "Thai Blue Sapphire",
      "Ceylon Pink Sapphire", "Padparadscha Sapphire", "Yellow Sapphire", "Star Sapphire Blue",
      "Star Sapphire Pink", "Montana Sapphire", "Australian Sapphire", "Madagascar Sapphire"
    ],
    qualityGrades: ["AAA+ (Exceptional)", "AAA", "AA", "Exceptional"],
    priceRange: "$3,000 - $28,000 per carat",
    weights: "1.0 ct - 6.0 ct"
  },
  
  features: {
    purchaseTypes: ["Fixed Price Sale", "Auction (with bidding)"],
    paymentMethods: ["Wallet Connection (Crypto)", "Traditional Payment"],
    services: ["Secure Storage", "Global Shipping", "Authentication Certificates", "Investment Guidance"]
  }
};

// Function to search the web using Firecrawl
async function searchWeb(query: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  
  if (!apiKey) {
    console.log("Firecrawl API key not configured, skipping web search");
    return "Web search is not available at the moment.";
  }

  try {
    console.log("Searching web for:", query);
    
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        limit: 5,
        scrapeOptions: {
          formats: ["markdown"],
        },
      }),
    });

    if (!response.ok) {
      console.error("Firecrawl search failed:", response.status);
      return "Unable to search the web at this time.";
    }

    const data = await response.json();
    console.log("Firecrawl search results received");
    
    if (data.success && data.data && data.data.length > 0) {
      const results = data.data.slice(0, 3).map((item: any, i: number) => {
        const content = item.markdown ? item.markdown.slice(0, 500) : item.description || "No content available";
        return `[${i + 1}] ${item.title || "Untitled"}\nURL: ${item.url}\n${content}`;
      }).join("\n\n---\n\n");
      
      return results;
    }
    
    return "No relevant web results found.";
  } catch (error) {
    console.error("Web search error:", error);
    return "Error performing web search.";
  }
}

// Function to scrape a specific URL
async function scrapeUrl(url: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  
  if (!apiKey) {
    return "Web scraping is not available at the moment.";
  }

  try {
    console.log("Scraping URL:", url);
    
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
      return "Unable to scrape the webpage.";
    }

    const data = await response.json();
    
    if (data.success && data.data?.markdown) {
      return data.data.markdown.slice(0, 2000);
    }
    
    return "Could not extract content from the webpage.";
  } catch (error) {
    console.error("Scrape error:", error);
    return "Error scraping webpage.";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are MAISON AI, an expert assistant for the MAISON precious metals and gems marketplace. You have complete knowledge of our inventory and can search the web for live market data.

## MARKETPLACE INVENTORY
${JSON.stringify(marketplaceData, null, 2)}

## YOUR CAPABILITIES
1. **Product Knowledge**: You know every product, price range, quality grade, and specification in our marketplace
2. **Web Search**: You can search the web for live gold/silver/platinum prices, market news, and investment trends
3. **URL Scraping**: You can read content from specific URLs users provide

## GUIDELINES
- Be professional, helpful, and concise - befitting a luxury marketplace
- When users ask about current market prices, USE the search_web tool to get live data
- When users share URLs, USE the scrape_url tool to read the content
- Reference specific products from our inventory when relevant
- Provide investment context when discussing precious metals
- If a product isn't in our catalog, suggest alternatives we do offer
- For purchases, guide users to the appropriate category page

## PURCHASE TYPES
- Fixed Price: Direct purchase at listed price
- Auction: Place bids on auction items, minimum bid increments apply

Always be accurate about what we sell. If unsure, recommend browsing our categories or contacting support.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "search_web",
          description: "Search the web for live market prices, precious metals news, investment trends, or any current information. Use this for real-time data like gold prices, market analysis, or news.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query (e.g., 'current gold price per ounce', 'platinum market forecast 2024')"
              }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "scrape_url",
          description: "Read and extract content from a specific webpage URL. Use this when a user shares a link or asks about content from a specific website.",
          parameters: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "The full URL to scrape (e.g., 'https://example.com/article')"
              }
            },
            required: ["url"]
          }
        }
      }
    ];

    // First API call - may return tool calls
    console.log("Making initial AI request");
    const initialResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tools: tools,
        tool_choice: "auto",
      }),
    });

    if (!initialResponse.ok) {
      const status = initialResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const initialData = await initialResponse.json();
    const assistantMessage = initialData.choices?.[0]?.message;

    // Check if the model wants to use tools
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("Processing tool calls:", assistantMessage.tool_calls.length);
      
      const toolResults = [];
      
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        let result = "";
        
        if (functionName === "search_web") {
          result = await searchWeb(functionArgs.query);
        } else if (functionName === "scrape_url") {
          result = await scrapeUrl(functionArgs.url);
        }
        
        toolResults.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }

      // Second API call with tool results - stream this one
      console.log("Making follow-up request with tool results");
      const followUpResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            assistantMessage,
            ...toolResults,
          ],
          stream: true,
        }),
      });

      if (!followUpResponse.ok) {
        throw new Error(`Follow-up AI request failed: ${followUpResponse.status}`);
      }

      return new Response(followUpResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tool calls - stream the direct response
    console.log("No tool calls, streaming direct response");
    const streamResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!streamResponse.ok) {
      throw new Error(`Stream request failed: ${streamResponse.status}`);
    }

    return new Response(streamResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("marketplace-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
