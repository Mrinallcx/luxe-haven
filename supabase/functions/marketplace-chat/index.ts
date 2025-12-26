import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Complete marketplace product catalog with IDs for linking
const productCatalog = [
  // Diamonds (IDs 1-16)
  { id: 1, name: "Round Brilliant Diamond", price: 12500, pricePerUnit: "per carat", category: "diamonds", purity: "VVS1", weight: "1.5 ct", status: "sale" },
  { id: 2, name: "Princess Cut Diamond", price: 9800, pricePerUnit: "per carat", category: "diamonds", purity: "VS1", weight: "1.2 ct", status: "auction" },
  { id: 3, name: "Emerald Cut Diamond", price: 15200, pricePerUnit: "per carat", category: "diamonds", purity: "VVS2", weight: "2.0 ct", status: "sale" },
  { id: 4, name: "Oval Diamond", price: 11000, pricePerUnit: "per carat", category: "diamonds", purity: "VS2", weight: "1.8 ct", status: "auction" },
  { id: 5, name: "Cushion Cut Diamond", price: 13500, pricePerUnit: "per carat", category: "diamonds", purity: "VVS1", weight: "1.7 ct", status: "sale" },
  { id: 6, name: "Marquise Diamond", price: 8900, pricePerUnit: "per carat", category: "diamonds", purity: "VS1", weight: "1.3 ct", status: "sale" },
  { id: 7, name: "Pear Shape Diamond", price: 14200, pricePerUnit: "per carat", category: "diamonds", purity: "IF", weight: "2.2 ct", status: "auction" },
  { id: 8, name: "Radiant Cut Diamond", price: 10500, pricePerUnit: "per carat", category: "diamonds", purity: "VVS2", weight: "1.4 ct", status: "sale" },
  
  // Gold (IDs 31-45)
  { id: 31, name: "24K Gold Bar 100g", price: 5890, pricePerUnit: "per bar", category: "gold", purity: "999.9", weight: "100g", status: "auction" },
  { id: 32, name: "24K Gold Bar 250g", price: 14500, pricePerUnit: "per bar", category: "gold", purity: "999.9", weight: "250g", status: "sale" },
  { id: 33, name: "Gold Krugerrand 1oz", price: 1950, pricePerUnit: "per oz", category: "gold", purity: "916", weight: "1 oz", status: "sale" },
  { id: 34, name: "Gold Maple Leaf", price: 2100, pricePerUnit: "per oz", category: "gold", purity: "999.9", weight: "1 oz", status: "sale" },
  { id: 35, name: "Gold American Eagle", price: 2050, pricePerUnit: "per oz", category: "gold", purity: "916", weight: "1 oz", status: "auction" },
  { id: 36, name: "PAMP Suisse Gold Bar", price: 6200, pricePerUnit: "per bar", category: "gold", purity: "999.9", weight: "100g", status: "sale" },
  
  // Silver (IDs 61-75)
  { id: 61, name: "999 Silver Bar 1kg", price: 890, pricePerUnit: "per bar", category: "silver", purity: "999", weight: "1kg", status: "sale" },
  { id: 62, name: "American Silver Eagle", price: 35, pricePerUnit: "per oz", category: "silver", purity: "999", weight: "1 oz", status: "auction" },
  { id: 63, name: "Silver Maple Leaf", price: 32, pricePerUnit: "per oz", category: "silver", purity: "9999", weight: "1 oz", status: "sale" },
  { id: 64, name: "Silver Britannia", price: 30, pricePerUnit: "per oz", category: "silver", purity: "999", weight: "1 oz", status: "sale" },
  { id: 65, name: "PAMP Suisse Silver Bar", price: 950, pricePerUnit: "per bar", category: "silver", purity: "999", weight: "1kg", status: "auction" },
  
  // Platinum (IDs 91-105)
  { id: 91, name: "Platinum Bar 100g", price: 4200, pricePerUnit: "per bar", category: "platinum", purity: "999.5", weight: "100g", status: "auction" },
  { id: 92, name: "Platinum Maple Leaf", price: 1100, pricePerUnit: "per oz", category: "platinum", purity: "999.5", weight: "1 oz", status: "sale" },
  { id: 93, name: "Platinum American Eagle", price: 1150, pricePerUnit: "per oz", category: "platinum", purity: "999.5", weight: "1 oz", status: "auction" },
  { id: 94, name: "Platinum Britannia", price: 1080, pricePerUnit: "per oz", category: "platinum", purity: "999.5", weight: "1 oz", status: "sale" },
  
  // Sapphire (IDs 121-135)
  { id: 121, name: "Ceylon Blue Sapphire", price: 12000, pricePerUnit: "per carat", category: "sapphire", purity: "AAA+", weight: "3.0 ct", status: "sale" },
  { id: 122, name: "Kashmir Blue Sapphire", price: 25000, pricePerUnit: "per carat", category: "sapphire", purity: "AAA+", weight: "2.5 ct", status: "auction" },
  { id: 123, name: "Star Sapphire", price: 15000, pricePerUnit: "per carat", category: "sapphire", purity: "AAA", weight: "4.0 ct", status: "sale" },
  { id: 124, name: "Padparadscha Sapphire", price: 18000, pricePerUnit: "per carat", category: "sapphire", purity: "AAA+", weight: "3.2 ct", status: "auction" },
  { id: 125, name: "Montana Sapphire", price: 8500, pricePerUnit: "per carat", category: "sapphire", purity: "AA", weight: "2.8 ct", status: "sale" },
];

// Function to search products
function searchProducts(query: string, category?: string, maxPrice?: number, minPrice?: number, status?: string): any[] {
  let results = [...productCatalog];
  
  // Filter by category
  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  // Filter by price range
  if (maxPrice) {
    results = results.filter(p => p.price <= maxPrice);
  }
  if (minPrice) {
    results = results.filter(p => p.price >= minPrice);
  }
  
  // Filter by status
  if (status) {
    results = results.filter(p => p.status === status.toLowerCase());
  }
  
  // Search by name if query provided
  if (query && query.trim()) {
    const searchTerms = query.toLowerCase().split(' ');
    results = results.filter(p => 
      searchTerms.some(term => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term) ||
        p.purity.toLowerCase().includes(term)
      )
    );
  }
  
  return results.slice(0, 6); // Return max 6 products
}

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

    const systemPrompt = `You are MAISON AI, an expert assistant for the MAISON precious metals and gems marketplace.

## YOUR CAPABILITIES
1. **Show Products**: Use the get_products tool to display interactive product cards to users
2. **Web Search**: Use search_web for live market prices and news
3. **Product Knowledge**: You know all products, prices, and specifications

## IMPORTANT BEHAVIOR
- When users ask about products, prices, or what you offer - ALWAYS use the get_products tool to show them actual product cards
- When users ask "what diamonds do you have" or "show me gold" - use get_products
- When users ask about current market prices - use search_web first, then optionally show products
- Product cards will be rendered visually in the chat - users can click to view details or add to cart

## PRODUCT CATEGORIES
- Diamonds: Various cuts (Round, Princess, Emerald, Oval, etc.) - $8,900 to $25,000 per carat
- Gold: Bars and coins (24K, 22K) - $1,950 to $14,500
- Silver: Bars and coins - $30 to $950
- Platinum: Bars and coins - $1,080 to $4,200
- Sapphire: Various origins (Ceylon, Kashmir, Montana) - $8,500 to $25,000 per carat

## PURCHASE TYPES
- "sale" = Fixed Price (Add to Cart)
- "auction" = Bidding (Place Bid)

Be professional and helpful. When showing products, add a brief description of what you're showing.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "get_products",
          description: "Search and display product cards from the marketplace. Use this whenever users ask about products, prices, availability, or want to see what we offer. Returns interactive product cards that users can click.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search term to find products (e.g., 'diamond', 'gold bar', 'sapphire')"
              },
              category: {
                type: "string",
                enum: ["diamonds", "gold", "silver", "platinum", "sapphire"],
                description: "Filter by specific category"
              },
              minPrice: {
                type: "number",
                description: "Minimum price filter"
              },
              maxPrice: {
                type: "number",
                description: "Maximum price filter"
              },
              status: {
                type: "string",
                enum: ["sale", "auction"],
                description: "Filter by sale type - 'sale' for fixed price, 'auction' for bidding"
              }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "search_web",
          description: "Search the web for live market prices, precious metals news, investment trends. Use for real-time data.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query"
              }
            },
            required: ["query"]
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
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
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
      let productsToShow: any[] = [];
      
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        let result = "";
        
        if (functionName === "get_products") {
          const products = searchProducts(
            functionArgs.query || "",
            functionArgs.category,
            functionArgs.maxPrice,
            functionArgs.minPrice,
            functionArgs.status
          );
          productsToShow = products;
          result = JSON.stringify(products);
        } else if (functionName === "search_web") {
          result = await searchWeb(functionArgs.query);
        }
        
        toolResults.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }

      // Second API call with tool results
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
        }),
      });

      if (!followUpResponse.ok) {
        throw new Error(`Follow-up request failed: ${followUpResponse.status}`);
      }

      const followUpData = await followUpResponse.json();
      const finalContent = followUpData.choices?.[0]?.message?.content || "";

      // Return response with products embedded as special JSON block
      const responsePayload: any = {
        content: finalContent,
      };
      
      if (productsToShow.length > 0) {
        responsePayload.products = productsToShow;
      }

      return new Response(JSON.stringify(responsePayload), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No tool calls - return direct response
    const content = assistantMessage?.content || "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("marketplace-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
