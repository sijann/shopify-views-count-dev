if (!customElements.get('views-count-component')) {


    customElements.define('views-count-component', class CustomViewsCountComponent extends HTMLElement {
        constructor() {
            super();
            this.storeId = this.dataset.storeid;
            this.productId = this.dataset.productid;
            this.id = this.dataset.id;

            // Create a shared variable to track request status and count
            if (!CustomViewsCountComponent.requestSent) {
                CustomViewsCountComponent.requestSent = false;
                CustomViewsCountComponent.viewsCount = null;
            }

            this.requestDebounce = this.debounce(this.sendViewsCountRequest.bind(this), 100);
        }

        debounce(func, wait) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func(...args), wait);
            };
        }

        async sendViewsCountRequest() {
            if (!CustomViewsCountComponent.requestSent) {
                CustomViewsCountComponent.requestSent = true;

                try {
                    const response = await fetch(`/apps/custom-app/product`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({ storeId: this.storeId, productId: this.productId }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch views count');
                    }

                    const data = await response.json();
                    CustomViewsCountComponent.viewsCount = data.count; // Update shared count
                    this.updateViewsCount(); // Update for this component
                } catch (error) {
                    console.error('Error fetching views count:', error);
                } finally {
                    CustomViewsCountComponent.requestSent = false; // Allow future requests
                }
            }
        }

        connectedCallback() {
            this.requestDebounce(); // Initiate the request
        }

        updateViewsCount() {
            // Check if count is available (fetched or null)
            if (CustomViewsCountComponent.viewsCount !== null) {
                const viewsCountElements = document.querySelectorAll('views-count') || this.querySelector('views-count');
                if (viewsCountElements && viewsCountElements[0]) {
                    viewsCountElements.forEach((element) => {
                        element.textContent = CustomViewsCountComponent.viewsCount;

                    })
                }

            } else {
                // Display loading indicator or placeholder (optional)
                console.log('Views count not yet available'); // Or display a message
            }
        }
    });
}