import { authenticate } from "../../../shopify.server";

export async function loader({ request }) {
    try {
        const { session, admin } = await authenticate.admin(request);
        const { shop } = session;

        const url = new URL(request.url);
        const storeId = url.searchParams.get("store");
        const productId = url.searchParams.get("product");

        if (!shop || !productId) {
            return json({ success: false, shop: null, message: 'Shop and product is required.' });
        }

        const page = 1;
        const pageSize = 20;

        try {
            const products = await db.productView.findMany({
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
                return json({ success: true, shop, products: null });
            }
            const productsJSON = [];

            for (const productView of products) {
                try {
                    const product = await admin.rest.resources.Product.find({
                        session,
                        id: productView.productId,
                    });
                    productsJSON.push({
                        success: true,
                        title: product.title,
                        image: product.image.src,
                        url: `https://${shop}/products/${product.handle}`,
                        views: productView.count
                    });
                } catch (e) {
                    console.error(`Error fetching product: ${e}`);
                }
            }




            return { success: true, shop, productsData: productsJSON };
        } catch (e) {
            console.error(e);
            return json({ success: false, shop, message: 'Error while fetching products data.' });
        }

    } catch (error) {
        console.error(error);
        return json({ success: false, message: 'Something went wrong.', error });
    }
}