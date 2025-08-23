// Clean

// Crypto Address Functionality
const bitcoinAddress = 'bc1qgagwuduswp962rmhxgvtpth4a4048hdk6pwc9h';
const ethereumAddress = '0x95E6e7fd8D503B9271708C16F71c1768C57D3AbC';

// Copy Bitcoin address to clipboard
function copyBitcoinAddress() {
    navigator.clipboard.writeText(bitcoinAddress).then(() => {
        showNotification('Bitcoin address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy address');
    });
}

// Copy Ethereum address to clipboard
function copyEthereumAddress() {
    navigator.clipboard.writeText(ethereumAddress).then(() => {
        showNotification('Ethereum address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy address');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'fixed top-4 right-4 z-50 px-4 py-2 text-white bg-green-500 rounded shadow-lg';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Open Bitcoin modal
function openBitcoinModal() {
    const modal = document.getElementById('bitcoin-modal');
    if (modal) {
        modal.classList.remove('hidden');
        generateQRCode();
    }
}

// Close Bitcoin modal
function closeBitcoinModal() {
    const modal = document.getElementById('bitcoin-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Open Ethereum modal
function openEthereumModal() {
    const modal = document.getElementById('ethereum-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Close Ethereum modal
function closeEthereumModal() {
    const modal = document.getElementById('ethereum-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Generate QR code for Bitcoin address
function generateQRCode() {
    const qrContainer = document.getElementById('bitcoin-qr');
    if (!qrContainer) return;
    
    // Simple QR code using Google Charts API
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(bitcoinAddress)}`;
    
    qrContainer.innerHTML = `
        <img src="${qrUrl}" alt="Bitcoin QR Code" class="mx-auto w-48 h-48 rounded-lg border border-zinc-600">
        <p class="mt-2 text-sm text-center text-zinc-400">Scan with your Bitcoin wallet</p>
    `;
}

// Initialize crypto functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listener for Bitcoin button to open modal
    const bitcoinButton = document.querySelector('button[data-bitcoin-address]');
    if (bitcoinButton) {
        bitcoinButton.addEventListener('click', openBitcoinModal);
    }
    
    // Add click event listener for Ethereum button to open modal
    const ethereumButton = document.querySelector('button[data-ethereum-address]');
    if (ethereumButton) {
        ethereumButton.addEventListener('click', openEthereumModal);
    }
    
    // Add click event listeners for Bitcoin address elements in modal to copy
    const bitcoinElements = document.querySelectorAll('code[data-bitcoin-address]');
    bitcoinElements.forEach(element => {
        element.addEventListener('click', copyBitcoinAddress);
        element.style.cursor = 'pointer';
        element.title = 'Click to copy Bitcoin address';
    });
    
    // Add click event listeners for Ethereum address elements in modal to copy
    const ethereumElements = document.querySelectorAll('code[data-ethereum-address]');
    ethereumElements.forEach(element => {
        element.addEventListener('click', copyEthereumAddress);
        element.style.cursor = 'pointer';
        element.title = 'Click to copy Ethereum address';
    });
    
    // Close Bitcoin modal when clicking outside
    const bitcoinModal = document.getElementById('bitcoin-modal');
    if (bitcoinModal) {
        bitcoinModal.addEventListener('click', function(e) {
            if (e.target === bitcoinModal) {
                closeBitcoinModal();
            }
        });
    }
    
    // Close Ethereum modal when clicking outside
    const ethereumModal = document.getElementById('ethereum-modal');
    if (ethereumModal) {
        ethereumModal.addEventListener('click', function(e) {
            if (e.target === ethereumModal) {
                closeEthereumModal();
            }
        });
    }

    // Add event listener for Bitcoin modal close button
    const bitcoinCloseButton = document.querySelector('#bitcoin-modal button');
    if (bitcoinCloseButton) {
        bitcoinCloseButton.addEventListener('click', closeBitcoinModal);
    }

    // Add event listener for Ethereum modal close button
    const ethereumCloseButton = document.querySelector('#ethereum-modal button');
    if (ethereumCloseButton) {
        ethereumCloseButton.addEventListener('click', closeEthereumModal);
    }
});