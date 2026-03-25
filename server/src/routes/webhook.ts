import {Router, Request, Response} from "express";

const router = Router();

router.post("/order-created", (req, res) => {
    if (req.body.challenge) {
        console.log('Webhook challenge received');
        return res.json({ challenge: req.body.challenge });
    }

    const { event } = req.body;

    console.log('New order created:', {
        itemId:    event.pulseId,
        itemName:  event.pulseName,
        boardId:   event.boardId,
        createdAt: new Date().toISOString()
    });

    res.json({ status: 'ok' });
});

export default router;