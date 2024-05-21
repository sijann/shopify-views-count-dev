import React, { useEffect, useRef } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Avatar, Banner, BlockStack, Button, Card, Icon, InlineGrid, InlineStack, Page, Text, Tooltip } from "@shopify/polaris";
import { PlusIcon, MinusIcon, CheckIcon, QuestionCircleIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import ViewsCountInstall from "../components/ViewsCountInstall";
import MostViewedSection from "../components/MostViewedSection";
import PageTitle from "../components/PageTitle";

export async function loader({ request }) {
    try {
        const { admin, session } = await authenticate.admin(request);
        const { shop } = session;
        let response = { shop };
        if (!shop) return response;

        const scriptsTags = await admin.rest.resources.ScriptTag.all({ session });
        response.hasScript = scriptsTags.data.some(obj => obj.src === "https://host-scripts.onrender.com/shopify-views-script.js");

        const themes = await admin.rest.resources.Theme.all({ session });
        const currentTheme = themes.data.find(theme => theme.role === 'main');

        if (currentTheme) {
            try {
                const productPage = await admin.rest.resources.Asset.all({
                    session,
                    theme_id: currentTheme.id,
                    asset: { "key": "templates/product.json" },
                });

                if (productPage.data.length > 0) {
                    const asset = productPage.data[0];
                    response.productPage = asset;
                    const assetValue = JSON.parse(asset.value);
                    const sectionKeys = Object.keys(assetValue.sections);
                    response.sectionId = sectionKeys[0];
                    response.blockInstalled = JSON.stringify(assetValue.sections).includes("6b3abca8-2d33-43dd-a64e-90115c65c50d");
                } else {
                    response.productPage = null;
                }
            } catch (error) {
                response.liquid = true
                return response;
            }
        }

        return response;
    } catch (error) {
        return { error: error.message };
    }
}

export async function action({ request }) {
    const { admin, session } = await authenticate.admin(request);
    switch (request.method) {
        case 'POST':
            try {
                const scriptTag = new admin.rest.resources.ScriptTag({ session });
                scriptTag.event = "onload";
                scriptTag.src = "https://host-scripts.onrender.com/shopify-views-script.js";
                await scriptTag.save({ update: true });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        case 'DELETE':
            try {
                const scriptsTags = await admin.rest.resources.ScriptTag.all({ session });
                const hasScript = scriptsTags.data.find(obj => obj.src === "https://host-scripts.onrender.com/shopify-views-script.js");
                if (hasScript) await admin.rest.resources.ScriptTag.delete({ session, id: hasScript.id });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        default:
            return { success: false };
    }
}

export default function Installation() {
    const { shop, hasScript, liquid = false, sectionId = '', blockInstalled = false } = useLoaderData();
    const actionData = useActionData();
    const success = actionData ? actionData.success : false;
    const liquidbanner = useRef(null);
    const jsonbanner = useRef(null);

    const { state } = useNavigation();
    const pending = state === "submitting";
    const installURL = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=sectionId:${sectionId}`;

    useEffect(() => {
        if (liquid) {
            liquidbanner.current?.focus();

        } else {
            jsonbanner.current?.focus();
        }

    }, [])

    const storeData = { domain: shop }
    const mostViewedBlockData = { isInstalled: false }

    return (
        <Page>
            <BlockStack gap={400}>
                <PageTitle title='Installation' />
                {!shop && <Banner
                    title="Oh, no."
                    action={{ content: 'Refresh Page', url: '/app/' }}
                    tone="critical"
                >
                    <p>Something went wrong.</p>
                </Banner>}

                <BlockStack gap={"600"}>
                    <ViewsCountInstall hasScript={hasScript} liquidbanner={liquidbanner} pending={pending} jsonbanner={jsonbanner} blockInstalled={blockInstalled} installURL={installURL} />


                    <MostViewedSection storeData={storeData} blockData={mostViewedBlockData} />
                </BlockStack>
            </BlockStack>
        </Page>
    );
}
