class CustomViewsCountComponent extends HTMLElement {
    constructor() {
        super();
        this.storeId = this.dataset.storeid;
        this.productId = this.dataset.productid;
        this.requestDebounce = debounce(this.sendViewsCountRequest.bind(this), 100);
        this.requestDebounce(this.storeId, this.productId);
    }

    async sendViewsCountRequest(storeId, productId) {
        try {
            const response = await fetch('http://localhost:46575/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeId, productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch views count');
            }

            const data = await response.json();

            const viewsCountElement = this.shadowRoot?.querySelector('#views-count') || this.querySelector('#views-count');
            viewsCountElement.textContent = data.count;
        } catch (error) {
            console.error('Error fetching views count:', error);
        }
    }

    connectedCallback() {
        this.requestDebounce(this.storeId, this.productId);
    }
}

function debounce(func, wait) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

customElements.define('views-count-component', CustomViewsCountComponent);
