import { authenticate, MONTHLY_PLAN } from "../shopify.server";

export const loader = async ({ request }) => {
    const { billing, session } = await authenticate.admin(request);

    const { shop } = session

    const shopName = shop.replace('.myshopify.com', '')


    await billing.require({
        plans: [MONTHLY_PLAN],
        isTest: true,
        onFailure: async () => billing.request({
            plan: MONTHLY_PLAN,
            isTest: true,
            returnUrl: `https://admin.shopify.com/store/${shopName}/apps/${process.env.APP_HANDLE}/app`,
        }),
    });

};
