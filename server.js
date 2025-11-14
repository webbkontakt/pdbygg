import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Byt ut mot din riktiga Stripe Secret Key
const stripe = new Stripe("sk_test_51SSl3VCZNxjGcm7Pgrdya70pz0WKaoJBWRXLusHhUfeFOur5SJizcl34toFz2uMDQjGqi9UAxneupXKSIldZqsRg00HW8CFrU7");

app.post("/create-checkout-session", async (req, res) => {
    try {
        const cartItems = req.body.items;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Kundvagnen är tom" });
        }

        const lineItems = cartItems.map(item => ({
            price: item.stripePriceId,  // använder stripePriceId från localStorage
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "https://dinhemsida.se/success",
            cancel_url: "https://dinhemsida.se/cart"
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ error: "Kunde inte skapa checkout-session" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
