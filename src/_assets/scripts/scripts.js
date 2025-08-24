/**
 * Robot Sox - Optimized Crypto Functionality
 */

class CryptoModal {
    constructor() {
        this.addresses = {
            bitcoin: 'bc1qgagwuduswp962rmhxgvtpth4a4048hdk6pwc9h',
            ethereum: '0x95E6e7fd8D503B9271708C16F71c1768C57D3AbC'
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    // Copy address to clipboard with fallback
    async copyToClipboard(text, type) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers or non-HTTPS
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            this.showNotification(`${type} address copied to clipboard!`);
        } catch (err) {
            console.error('Failed to copy: ', err);
            this.showNotification('Failed to copy address');
        }
    }

    // Show notification with fade-out animation
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'fixed top-4 right-4 z-50 px-4 py-2 text-white bg-green-500 rounded shadow-lg transition-opacity duration-300';
        document.body.appendChild(notification);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    }

    // Modal control methods
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Add fade-in animation
            modal.style.opacity = '0';
            requestAnimationFrame(() => {
                modal.style.transition = 'opacity 0.3s ease-in-out';
                modal.style.opacity = '1';
            });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.style.opacity = '1';
            }, 300);
        }
    }

    // Event binding with event delegation for better performance
    bindEvents() {
        // Use event delegation for better performance
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-bitcoin-address], [data-ethereum-address]');
            if (!target) return;

            if (target.hasAttribute('data-bitcoin-address')) {
                if (target.tagName === 'BUTTON') {
                    this.openModal('bitcoin-modal');
                } else if (target.tagName === 'CODE') {
                    this.copyToClipboard(this.addresses.bitcoin, 'Bitcoin');
                }
            } else if (target.hasAttribute('data-ethereum-address')) {
                if (target.tagName === 'BUTTON') {
                    this.openModal('ethereum-modal');
                } else if (target.tagName === 'CODE') {
                    this.copyToClipboard(this.addresses.ethereum, 'Ethereum');
                }
            }
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            // Close modal when clicking on backdrop
            if (e.target.id === 'bitcoin-modal') {
                this.closeModal('bitcoin-modal');
            } else if (e.target.id === 'ethereum-modal') {
                this.closeModal('ethereum-modal');
            }
            
            // Close modal when clicking close button
            if (e.target.closest('#bitcoin-modal button')) {
                this.closeModal('bitcoin-modal');
            } else if (e.target.closest('#ethereum-modal button')) {
                this.closeModal('ethereum-modal');
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('bitcoin-modal');
                this.closeModal('ethereum-modal');
            }
        });

        // Add hover effects and cursor styles
        document.addEventListener('DOMContentLoaded', () => {
            const addressElements = document.querySelectorAll('code[data-bitcoin-address], code[data-ethereum-address]');
            addressElements.forEach(element => {
                element.style.cursor = 'pointer';
                element.title = element.hasAttribute('data-bitcoin-address') 
                    ? 'Click to copy Bitcoin address' 
                    : 'Click to copy Ethereum address';
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CryptoModal());
} else {
    new CryptoModal();
}

// Global functions for backward compatibility (can be removed if not needed)
window.copyBitcoinAddress = () => new CryptoModal().copyToClipboard('bc1qgagwuduswp962rmhxgvtpth4a4048hdk6pwc9h', 'Bitcoin');
window.copyEthereumAddress = () => new CryptoModal().copyToClipboard('0x95E6e7fd8D503B9271708C16F71c1768C57D3AbC', 'Ethereum');
window.openBitcoinModal = () => new CryptoModal().openModal('bitcoin-modal');
window.openEthereumModal = () => new CryptoModal().openModal('ethereum-modal');
window.closeBitcoinModal = () => new CryptoModal().closeModal('bitcoin-modal');
window.closeEthereumModal = () => new CryptoModal().closeModal('ethereum-modal');