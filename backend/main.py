from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. DASHBOARD DATA ---
@app.get("/dashboard-stats")
def get_stats():
    return {
        "harvest_history": [
            {"name": "Maha '23", "yield": 450}, # High yield (Rainy)
            {"name": "Yala '23", "yield": 320}, # Lower yield (Dry)
            {"name": "Maha '24", "yield": 480},
            {"name": "Yala '24", "yield": 350},
            {"name": "Maha '25", "yield": 500}, # Projected
        ],
        
        "soil_moisture": 78,
        "alerts": 2
    }

# --- 2. THE SUPER MANUAL BRAIN ---
# Specific phrases must come BEFORE general words for better accuracy.
knowledge_base = {
    # --- GREETINGS (Your Updates) ---
    "hello": "Ayubowan! I am your AgroMind Assistant.",
    "hi": "Hello farmer! How can I help you today?",
    "help": "You can ask me questions like: 'How to grow rice', 'Tea fertilizer', 'Tomato diseases', or 'Market prices'.",

    # --- RICE (PADDY) SPECIFICS ---
    "rice yellow": "If rice leaves turn orange/yellow starting from the tip, it is likely a Potassium or Nitrogen deficiency. Apply MOP or Urea.",
    "rice fertilizer": "For Rice: Base dressing uses TSP. Top dressing uses Urea (at 2 weeks and 6 weeks) and MOP.",
    "rice water": "Maintain standing water of 2-5 cm. Drain the field completely 2 weeks before harvesting.",
    "rice disease": "Common rice diseases are 'Blast' (spots on leaves) and 'Blight'. Use a fungicide like Isoprothiolane.",
    "rice season": "In Sri Lanka, we have two seasons: Maha (rainy, Sept-March) and Yala (dry, May-Aug).",
    "rice": "Rice is the main crop. Ask me about: 'rice fertilizer', 'rice water', or 'rice disease'.",
    "paddy": "Rice is the main crop. Ask me about: 'rice fertilizer', 'rice water', or 'rice disease'.",

    # --- TEA CULTIVATION ---
    "tea fertilizer": "For Tea: Use the 'T-65' or 'U-709' mixture. Apply before the rains start.",
    "tea pruning": "Pruning helps new growth. Light pruning is done every 3-4 years.",
    "tea soil": "Tea loves acidic soil (pH 4.5 to 5.5). If pH is too high, add Sulphur.",
    "tea disease": "Blister Blight is common in wet weather. It creates white blisters on leaves. Spray Copper based fungicide.",
    "tea": "Tea is a major export. Ask about 'tea fertilizer', 'tea pruning', or 'tea soil'.",

    # --- VEGETABLES ---
    "tomato": "Tomatoes need support stakes. Watch out for 'Blight' (black spots). Apply Calcium to prevent bottom rot.",
    "carrot": "Carrots grow best in Nuwara Eliya climate (loose soil). Do not use fresh manure; it splits the roots.",
    "bean": "Beans are nitrogen-fixers. They don't need much Urea. Watch out for Bean Fly pests.",
    "chilli": "Leaf curl in Chilli is caused by thrips/mites. Spray Neem oil or a recommended pesticide.",
    "pumpkin": "Pumpkins need space. If flowers fall off without fruit, you might need more bees for pollination.",

    # --- GENERAL ISSUES ---
    "yellow leaves": "Yellow leaves usually mean Nitrogen deficiency (plant is hungry) or Over-watering (roots are drowning).",
    "black spots": "Black spots are usually Fungal. Remove bad leaves and spray a fungicide.",
    "white spots": "White powdery spots are 'Powdery Mildew'. Use a sulphur spray.",
    "insects": "For general insects, try organic Neem Oil spray first. It is safer for food crops.",
    "worms": "Caterpillars or worms can be picked off by hand or treated with Bacillus thuringiensis (Bt).",

    # --- SOIL & FERTILIZER ---
    "urea": "Urea provides Nitrogen, which makes plants green and leafy. Do not apply when heavy rain is expected.",
    "compost": "Compost improves soil health. Mix it into the soil 2 weeks before planting.",
    "soil test": "You should test your soil pH and nutrients every 2 years at the Department of Agriculture.",
    
    # --- WEATHER & MARKET ---
    "price": "Vegetable prices fluctuate daily at Dambulla and Pettah markets. Carrots and Leeks are currently stable.",
    "weather": "Farming depends on rain. Always check the Department of Meteorology forecast before applying fertilizer."
}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat_with_manual_bot(request: ChatRequest):
    user_msg = request.message.lower() 
    
    # LOGIC: Find the BEST match
    # We check the specific phrases (like "rice fertilizer") first
    for keyword, answer in knowledge_base.items():
        if keyword in user_msg:
            return {"reply": answer}
    
    # If no words match
    return {"reply": "I am not sure about that. Please try asking about: Rice, Tea, Fertilizer, Diseases, or Watering."}