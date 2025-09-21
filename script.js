document.addEventListener('DOMContentLoaded', () => {
  const methods = document.querySelectorAll('.method');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const manualAmountInput = document.getElementById('manual-amount');
  const validationMessage = document.getElementById('validation-message');
  const payButton = document.getElementById('pay-button');
  const paymentDetails = document.getElementById('payment-details');
  const totalPaymentSpan = document.getElementById('total-payment');
  const qrisDisplay = document.getElementById('qris-display');
  const qrisImage = document.getElementById('qris-image');
  const walletDisplay = document.getElementById('wallet-display');
  const receiverNameSpan = document.getElementById('receiver-name');
  const phoneNumberSpan = document.getElementById('phone-number');
  const successModal = document.getElementById('success-modal');
  const closeButton = document.querySelector('.close-button');
  const downloadQrisBtn = document.getElementById('download-qris-btn');
  const copyQrisBtn = document.getElementById('copy-qris-btn');
  const copyWalletBtn = document.getElementById('copy-wallet-btn');

  let selectedMethod = null;
  let selectedAmount = null;
  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT = 150000;

  const accountInfo = {
    dana: { name: 'Rifki Hermawan', phone: '08886291836' },
    ovo: { name: 'Rifki Hermawan', phone: '08886291836' },
    gopay: { name: 'Rifki Hermawan', phone: '085189111221' }
  };

  function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(num);
  }

  function updatePaymentDetails() {
    const ready = selectedMethod && selectedAmount;
    if (ready) {
      paymentDetails.classList.remove('hidden');
      totalPaymentSpan.textContent = formatRupiah(selectedAmount);

      if (selectedMethod === 'qris') {
        qrisDisplay.classList.remove('hidden');
        walletDisplay.classList.add('hidden');
        const qrisLink = 'https://files.catbox.moe/c3rwkm.jpeg';
        qrisImage.src = qrisLink;
        downloadQrisBtn.href = qrisLink;
      } else {
        qrisDisplay.classList.add('hidden');
        walletDisplay.classList.remove('hidden');
        const acc = accountInfo[selectedMethod];
        receiverNameSpan.textContent = acc.name;
        phoneNumberSpan.textContent = acc.phone;
      }
    } else {
      paymentDetails.classList.add('hidden');
    }
    payButton.disabled = !ready;
  }

  methods.forEach(m => {
    m.addEventListener('click', () => {
      methods.forEach(x => x.classList.remove('selected'));
      m.classList.add('selected');
      selectedMethod = m.dataset.method;
      updatePaymentDetails();
    });
  });

  amountBtns.forEach(b => {
    b.addEventListener('click', () => {
      amountBtns.forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedAmount = parseInt(b.dataset.amount);
      manualAmountInput.value = '';
      validationMessage.classList.add('hidden');
      updatePaymentDetails();
    });
  });

  manualAmountInput.addEventListener('input', () => {
    amountBtns.forEach(x => x.classList.remove('selected'));
    const val = parseInt(manualAmountInput.value);
    if (!isNaN(val) && val >= MIN_AMOUNT && val <= MAX_AMOUNT) {
      selectedAmount = val;
      validationMessage.classList.add('hidden');
    } else {
      selectedAmount = null;
      validationMessage.classList.toggle('hidden', !manualAmountInput.value);
    }
    updatePaymentDetails();
  });

  payButton.addEventListener('click', () => {
    if (selectedMethod && selectedAmount) {
      successModal.classList.remove('hidden');
    }
  });

  closeButton.addEventListener('click', () => successModal.classList.add('hidden'));
  window.addEventListener('click', e => { if (e.target === successModal) successModal.classList.add('hidden'); });

  copyQrisBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('08886291836');
    alert('Nomor QRIS tersalin!');
  });
  copyWalletBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(phoneNumberSpan.textContent);
    alert('Nomor E-Wallet tersalin!');
  });
});