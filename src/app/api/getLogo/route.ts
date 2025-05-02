import { NextRequest, NextResponse } from "next/server";

// Stock ticker validation regex
const TICKER_REGEX = /^[A-Za-z]{1,5}$/;

export async function GET(request: NextRequest) {
  try {
    // Get ticker from query parameter
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    // Validate ticker parameter
    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker parameter is required" },
        { status: 400 }
      );
    }

    // Validate ticker format to prevent SSRF
    if (!TICKER_REGEX.test(ticker)) {
      return NextResponse.json(
        { error: "Invalid ticker format" },
        { status: 400 }
      );
    }

    // Primary source URL (SVG format)
    const primaryUrl = `https://assets.parqet.com/logos/symbol/${ticker}?format=svg`;

    // Try to fetch from primary source
    let response = await fetch(primaryUrl, { method: "GET" });

    // If primary source fails, try the fallback source (PNG format)
    if (!response.ok) {
      const fallbackUrl = `https://cdn.nvstly.com/icons/stocks/${ticker}.png`;
      response = await fetch(fallbackUrl, { method: "GET" });

      // If both sources fail, return an error
      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch logo from both sources" },
          { status: 404 }
        );
      }
    }

    // Get the image data and content type
    const imageData = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") ||
      (primaryUrl === response.url ? "image/svg+xml" : "image/png");

    // Return the image directly
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Error fetching stock logo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
