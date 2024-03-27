import { json } from "@remix-run/react";
import db from '../db.server'

export async function loader({ request }) {
    try {
        const url = new URL(request.url);
        const storeId = url.searchParams.get("store");

        if (!storeId) {
            return json({ success: false, shop: null, message: 'Shop  is required.' });
        }

        const page = 1;
        const pageSize = 20;

        try {
            const products = await db.productView.findMany({
                select: {
                    productHandle: true,
                    count: true

                },
                where: {
                    storeId,
                },
                orderBy: {
                    count: 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });

            if (products.length === 0) {
                return json({ success: true, products: null });
            } else {
                return json({ success: true, products: products })
            }
        } catch (e) {
            console.log('-------------______ERROR')
            console.error(e);
            return json({ success: false, message: 'Error while fetching products data.' });
        }

    } catch (error) {
        console.error(error);
        return json({ success: false, message: 'Something went wrong.', error });
    }
}