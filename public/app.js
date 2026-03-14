// Data Produk Simulasi (Sekarang lebih proper dan banyak!)
const products = [
  { 
    id: 'mastering-react', 
    title: 'Mastering React.js 2024', 
    desc: 'Panduan komprehensif dari nol hingga mahir membuat aplikasi web modern dengan React dan Next.js.',
    price: 150000, 
    type: 'E-Book',
    badge: 'Terlaris' // Label merah
  },
  { 
    id: 'uiux-fundamental', 
    title: 'UI/UX Design Fundamental', 
    desc: 'Pelajari cara mendesain antarmuka aplikasi yang tidak hanya cantik, tapi juga memiliki konversi tinggi.',
    price: 350000, 
    type: 'Video Course',
    badge: 'Baru' // Label hijau
  },
  { 
    id: 'copywriting-sales', 
    title: 'Formula Copywriting Menjual', 
    desc: 'Kumpulan template dan teknik menulis kalimat penawaran yang terbukti meningkatkan penjualan hingga 300%.',
    price: 99000, 
    type: 'E-Book',
    badge: '' 
  },
  { 
    id: 'fullstack-node', 
    title: 'Backend Mastery with Node.js', 
    desc: 'Kelas intensif merancang arsitektur server, API, dan database yang aman untuk skala perusahaan.',
    price: 450000, 
    type: 'Video Course',
    badge: 'Terlaris'
  },
  { 
    id: 'digital-marketing', 
    title: 'FB & IG Ads Secret', 
    desc: 'Bongkar rahasia algoritma Meta Ads untuk mendatangkan ribuan pengunjung tertarget dengan budget minim.',
    price: 250000, 
    type: 'E-Book',
    badge: ''
  },
  { 
    id: 'freelance-guide', 
    title: 'Freelancer Sukses Tembus Upwork', 
    desc: 'Strategi membangun portofolio, memenangkan bidding, dan mendapatkan klien bule berbayar dolar.',
    price: 199000, 
    type: 'Video Course',
    badge: 'Baru'
  }
];

// Logika untuk index.html (Halaman Beranda)
const productListElement = document.getElementById('product-list');
if (productListElement) {
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Logika menampilkan Badge (Terlaris/Baru)
    let badgeHTML = '';
    if (product.badge === 'Terlaris') {
      badgeHTML = `<div class="badge">${product.badge}</div>`;
    } else if (product.badge === 'Baru') {
      badgeHTML = `<div class="badge new">${product.badge}</div>`;
    }

    card.innerHTML = `
      ${badgeHTML}
      <div class="card-type">${product.type}</div>
      <h3 class="card-title">${product.title}</h3>
      <p class="card-desc">${product.desc}</p>
      <div class="card-price">Rp ${product.price.toLocaleString('id-ID')}</div>
      <a href="product.html?id=${product.id}" class="btn">Beli Sekarang</a>
    `;
    productListElement.appendChild(card);
  });
}

// Logika untuk product.html (Halaman Checkout)
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const selectedProduct = products.find(p => p.id === productId);

  if (selectedProduct) {
    document.getElementById('detail-title').textContent = selectedProduct.title;
    document.getElementById('detail-price').textContent = `Rp ${selectedProduct.price.toLocaleString('id-ID')}`;
  } else {
    document.getElementById('detail-title').textContent = "Produk tidak ditemukan";
    document.getElementById('btn-submit').disabled = true;
  }

  // Proses Submit ke Mayar API
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const btnSubmit = document.getElementById('btn-submit');
    btnSubmit.textContent = 'Memproses Pembayaran...';
    btnSubmit.disabled = true;

    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const mobile = document.getElementById('customer-mobile').value;

    try {
      const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.title,
          price: selectedProduct.price,
          customerName: name,
          customerEmail: email,
          customerMobile: mobile
        })
      });

      const data = await response.json();

      if (data.paymentLink) {
        window.location.href = data.paymentLink; // Arahkan ke Mayar
      } else {
        alert('Gagal! Alasan Mayar: ' + JSON.stringify(data.details));
        btnSubmit.textContent = 'Bayar Sekarang';
        btnSubmit.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan koneksi ke server.');
      btnSubmit.textContent = 'Bayar Sekarang';
      btnSubmit.disabled = false;
    }
  });
}