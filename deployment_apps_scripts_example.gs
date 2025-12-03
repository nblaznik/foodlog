/********************************************************************
  CONFIGURATION
********************************************************************/

// Set your API key here directly:
const OPENAI_KEY = "YOUR_OPENAI_API_KEY_HERE";

/********************************************************************
  MAIN ENTRY POINT
********************************************************************/
function doPost(e) {
  console.log("=== doPost triggered ===");

  // Validate event object
  if (!e || !e.parameter) {
    console.log("ERROR: No event object received");
    return errorResponse("No POST data received");
  }

  console.log("Parameters:", JSON.stringify(e.parameter));

  if (!e.parameter.entry) {
    console.log("ERROR: No entry field received");
    return errorResponse("No entry text received");
  }

  const rawEntry = e.parameter.entry.trim();
  console.log("Raw entry:", rawEntry);
  console.log("Time is:", getCurrentTime());
  
  // Build the prompt
  
  const prompt = `You are a strict nutrition parser.

  Your job:
  - take the following food diary entry
  - split it into individual food items
  - determine each item's relative amount within the dish
  - always use metric units, preferably grams
  - infer realistic nutritional values per 1 serving
  - output ONLY valid JSON, no text outside JSON
  - return an ARRAY of objects (one per food item)
  - based on the current time and the meal itself, classify the meal as breakfast, lunch, dinner, or snack

  Entry: "${rawEntry}"
  Current time: "${getCurrentTime()}"

  Formatting rules:
  1. ALWAYS return an array, even if there is only one item.
  2. Each item must include: meal, description, amount (grams preferred), serving.
  3. Macros (kcal, protein, carbs, fat) must be given as Excel expressions,
    e.g. "=350.0 * INDIRECT("R[0]C[-N]", FALSE)", such that it mulitplies with the previous collumn
  4. All macro base values must contain exactly one decimal place (e.g. 12.0, 4.5)
  5. Do not include explanations.
  6. Do not include date or time (system will handle those).

  Return JSON in this EXACT format:

  [
    {
      "meal": "breakfast", 
      "description": "string",
      "amount": "number in grams, or closest metric unit",
      "serving": 1,
      "kcal": "=base_value *  INDIRECT("R[0]C[-1]", FALSE)",
      "protein": "=base_value *  INDIRECT("R[0]C[-2]", FALSE)",
      "carbs": "=base_value *  INDIRECT("R[0]C[-3]", FALSE)",
      "fats": "=base_value *  INDIRECT("R[0]C[-4]", FALSE)"
    }
  ]    `;
    
  let aiResponseString;

  // Call OpenAI
  try {
    aiResponseString = callOpenAI(prompt);
    console.log("AI response raw:", aiResponseString);
  } catch (err) {
    console.log("OpenAI error:", err);
    return errorResponse("OpenAI failed: " + err);
  }

  let openaiWrapper;
  let nutrition;

  // Parse AI wrapper JSON + inner nutrition JSON
  try {
    openaiWrapper = JSON.parse(aiResponseString);  // json with choices[0].message.content
    nutrition = JSON.parse(openaiWrapper.choices[0].message.content);

    // Ensure it is an array
    if (!Array.isArray(nutrition)) {
      nutrition = [nutrition];
    }

    console.log("Nutrition array:", nutrition);
  } catch (err) {
    console.log("JSON parse error:", err, "Body:", aiResponseString);
    return errorResponse("AI returned invalid JSON");
  }

  // Write the row to the sheet
  try {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

  nutrition.forEach(item => {
    sheet.appendRow([
      getCurrentDate(),
      getCurrentTime(),
      item.meal || "",
      item.description || "",
      item.amount || "",
      item.serving || "",
      item.kcal || "",
      item.protein || "",
      item.carbs || "",
      item.fats || "",
    ]);
  });

  console.log("Rows written:", nutrition.length);
} catch (err) {
  console.log("Sheet write error:", err);
  return errorResponse("Failed to write rows");
}
}


function callOpenAI(prompt) {
  const url = "https://api.openai.com/v1/chat/completions";

  // Force strict JSON-only instructions
  const payload = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Return JSON only. No text before or after. No code blocks. No explanations." },
      { role: "user", content: prompt }
    ],
    temperature: 0
  };

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    payload: JSON.stringify(payload),
    headers: {
      Authorization: "Bearer " + OPENAI_KEY,
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  });

  console.log("OpenAI HTTP code:", response.getResponseCode());
  const text = response.getContentText();
  console.log("OpenAI raw body:", text);

  // Try to extract the JSON safely
  const cleaned = extractJSON(text);
  console.log("Cleaned JSON:", cleaned);

  return cleaned;
}

function extractJSON(raw) {
  // Remove code fences like ```json
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Extract first JSON block
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in AI response: " + raw);
  }

  return match[0]; // return the JSON substring
}

function successResponse() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getCurrentDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = ('0' + (now.getMonth() + 1)).slice(-2);
  const d = ('0' + now.getDate()).slice(-2);
  return `${y}${m}${d}`; // YYYYMMDD
}

function getCurrentTime() {
  const now = new Date();
  const hh = ('0' + now.getHours()).slice(-2);
  const mm = ('0' + now.getMinutes()).slice(-2);
  return `${hh}:${mm}`;
}


function testDoPost() {
  const e = {
    parameter: {
      entry: "pancakes with maple syrup and a side of bacon"
    },
    postData: {
      contents: "",
      length: 0,
      type: "application/x-www-form-urlencoded"
    }
  };
  return doPost(e);
}
