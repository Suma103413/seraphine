import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(title="SERAPHINE API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class CartItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class PaymentRequest(BaseModel):
    cart: List[CartItem]
    total: float
    cardNumber: str
    expiry: str
    cvv: str

class ChatRequest(BaseModel):
    message: str

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

# Endpoints
@app.get("/products")
async def get_products():
    return [
        {
            "id": 1,
            "name": "Pink Leather Handbag",
            "price": 2450.00,
            "imageURL": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800",
            "description": "A vibrant pink handbag featuring a silver chain strap and a chevron pattern."
        },
        {
            "id": 2,
            "name": "Camel Wool Trench Coat",
            "price": 3800.00,
            "imageURL": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800",
            "description": "A classic, long camel-colored wool coat with a matching belt."
        },
        {
            "id": 3,
            "name": "Gold Aviator Sunglasses",
            "price": 450.00,
            "imageURL": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
            "description": "Classic gold-rimmed aviator sunglasses offering complete UV protection and timeless style."
        },
        {
            "id": 4,
            "name": "Tan Bomber Jacket",
            "price": 2100.00,
            "imageURL": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
            "description": "A stylish tan zip-up bomber jacket, crafted for everyday luxury wear."
        },
        {
            "id": 5,
            "name": "Ivory Leather Tote",
            "price": 2900.00,
            "imageURL": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800",
            "description": "Supple full-grain leather tote, handcrafted by master artisans."
        },
        {
            "id": 6,
            "name": "Floral Print Stilettos",
            "price": 4500.00,
            "imageURL": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
            "description": "Pointed-toe stilettos with a colorful pink and red floral pattern."
        },
        {
            "id": 7,
            "name": "Men's Tailored Suit",
            "price": 3200.00,
            "imageURL": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
            "description": "A sharp, tailored navy suit crafted from premium Italian wool."
        }
    ]

@app.post("/process-payment")
async def process_payment(payment: PaymentRequest):
    # Simulate a delay for payment processing
    await asyncio.sleep(2)
    return {"status": "success", "message": "Payment Successful", "transactionId": "TXN_SERAPHINE_10294"}

@app.post("/chat")
async def chat(request: ChatRequest):
    msg = request.message.lower()
    reply = ""

    if "material" in msg or "fabric" in msg:
        reply = "At SERAPHINE, we pride ourselves on utilizing only the finest materials, such as our signature Italian silk and hand-sourced cashmere, to ensure an unparalleled tactile experience."
    elif "price" in msg or "cost" in msg:
        reply = "Our pieces reflect true artisanal craftsmanship and exclusivity. If you are inquiring about a specific item, I would be delighted to provide detailed pricing."
    elif "shipping" in msg or "delivery" in msg:
        reply = "We offer complimentary white-glove delivery globally. Your curated selections will arrive in our bespoke signature packaging within 3 to 5 business days."
    elif "hello" in msg or "hi" in msg:
        reply = "Welcome to SERAPHINE. I am your personal concierge. How may I elevate your wardrobe today?"
    else:
        reply = "An exquisite choice of inquiry. Our collection is designed for the discerning individual. Could I assist you with specific details regarding our silks, cashmeres, or perhaps our bespoke services?"

    return {"reply": reply}

@app.post("/contact-submit")
async def contact_submit(request: ContactRequest):
    # In a real app, this would send an email or save to DB.
    return {"status": "success", "message": "Thank you for reaching out. A SERAPHINE representative will contact you shortly."}

# Mount the frontend directory so it's served by FastAPI
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
