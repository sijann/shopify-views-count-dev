import { json } from '@remix-run/node';
import db from '../db.server';
import { authenticate } from '../shopify.server';

export let loader = async ({ request }) => {
    await authenticate.admin(request);
    const url = new URL(request.url);
    const storeId = url.searchParams.get("storeId");
    const page = url.searchParams.get("page") || 1;
    const pageSize = url.searchParams.get("pageSize") || 20;

    if (!storeId) return json({ success: false, message: 'storeId is required.' })

    const products = await db.productView.findMany({
        where: {
            storeId,
        },
        orderBy: {
            count: 'desc',
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
    });

    if (!products) return json({ success: true, products: null })

    return json(products.map((productView) => ({
        productId: productView.productId,
        views: productView.count,
    })), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
