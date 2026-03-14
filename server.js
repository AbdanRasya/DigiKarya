require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public')); 

// ==========================================
// ENDPOINT 1: MEMBUAT LINK PEMBAYARAN MAYAR
// ==========================================
app.post('/api/checkout', async (req, res) => {
  try {
    const { productName, price, customerName, customerEmail, customerMobile } = req.body;

    // Payload Khusus Headless API Mayar
    const payload = {
      name: productName, 
      amount: price,     
      description: `Pesanan dari: ${customerName}`, 
      email: customerEmail,       // Wajib
      mobile: customerMobile,     // Wajib
      customer_name: customerName,
      redirectUrl: `http://localhost:${PORT}/index.html` 
    };

    const response = await fetch('https://api.mayar.club/hl/v1/payment/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("=== BALASAN MAYAR ===", data);

    if (data && data.data && data.data.link) {
      res.json({ paymentLink: data.data.link });
    } else {
      res.status(400).json({ error: 'Ditolak Mayar', details: data });
    }
  } catch (error) {
    console.error("=== ERROR SERVER ===", error.message);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// ==========================================
// ENDPOINT 2: WEBHOOK MAYAR (Ketik bayar sukses)
// ==========================================
app.post('/api/webhook/mayar', (req, res) => {
  const status = req.body.status;
  if (status === 'COMPLETED' || status === 'PAID') {
    const email = req.body.customer?.email || 'User';
    console.log(`✅ [WEBHOOK] Hore! ${email} sudah berhasil membayar!`);
  }
  res.status(200).json({ received: true });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});