import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const matchRideRequest = async (request) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze the following ride request and extract key information:
    "${request}"
    
    Please provide a JSON response with the following structure:
    {
      "type": "one-time" or "recurring",
      "pickup": "extracted pickup location",
      "destination": "extracted destination",
      "date": "extracted date (YYYY-MM-DD format) or 'recurring'",
      "time": "extracted time (HH:MM format)",
      "frequency": "daily", "weekdays", or "weekly" (if recurring),
      "passengers": "number of passengers (default to 1 if not specified)"
    }
    
    Provide only the JSON object without any additional text or formatting.
  `;

  try {
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini API');
    const response = await result.response;
    let text = response.text();
    console.log('Raw response:', text);

    // Remove any markdown formatting
    text = text.replace(/```json\n?/, '').replace(/```\n?/, '').trim();
    console.log('Cleaned response:', text);

    const parsedResponse = JSON.parse(text);
    console.log('Parsed response:', parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error in matchRideRequest:", error);
    if (error.response) {
      console.error("API response:", error.response);
    }
    throw new Error(`Failed to process ride request: ${error.message}`);
  }
};

export const matchRideOffer = async (availability) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze the following driver availability and extract key information:
    "${availability}"
    
    Please provide a JSON response with the following structure:
    {
      "type": "one-time" or "recurring",
      "startLocation": "extracted start location",
      "route": ["list of areas or stops along the route"],
      "date": "extracted date (YYYY-MM-DD format) or 'recurring'",
      "time": "extracted time (HH:MM format)",
      "frequency": "daily", "weekdays", or "weekly" (if recurring),
      "seats": "number of available seats (default to 4 if not specified)"
    }
    
    Provide only the JSON object without any additional text or formatting.
  `;

  try {
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini API');
    const response = await result.response;
    let text = response.text();
    console.log('Raw response:', text);

    // Remove any markdown formatting
    text = text.replace(/```json\n?/, '').replace(/```\n?/, '').trim();
    console.log('Cleaned response:', text);

    const parsedResponse = JSON.parse(text);
    console.log('Parsed response:', parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error in matchRideOffer:", error);
    if (error.response) {
      console.error("API response:", error.response);
    }
    throw new Error(`Failed to process driver availability: ${error.message}`);
  }
};

export const matchRides = async (requests, availabilities) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Given the following ride requests and driver availabilities, match them based on compatibility:
    
    Requests: ${JSON.stringify(requests)}
    Availabilities: ${JSON.stringify(availabilities)}
    
    Please provide a JSON response with the following structure:
    [
      {
        "requestId": "ID of the matched request",
        "availabilityId": "ID of the matched availability",
        "compatibilityScore": "A number between 0 and 1 indicating how well they match",
        "type": "one-time" or "recurring"
      },
      ...
    ]
    
    Consider factors such as location proximity, time compatibility, available seats, and whether it's a one-time ride or a recurring carpool.
    For recurring carpools, ensure that the frequencies match (e.g., both are 'daily' or both are 'weekdays').
    Prioritize matches with higher compatibility scores.
    
    Provide only the JSON array without any additional text or formatting.
  `;

  try {
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini API');
    const response = await result.response;
    let text = response.text();
    console.log('Raw response:', text);

    // Remove any markdown formatting
    text = text.replace(/```json\n?/, '').replace(/```\n?/, '').trim();
    console.log('Cleaned response:', text);

    const parsedResponse = JSON.parse(text);
    console.log('Parsed response:', parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error in matchRides:", error);
    if (error.response) {
      console.error("API response:", error.response);
    }
    throw new Error(`Failed to match rides: ${error.message}`);
  }
};