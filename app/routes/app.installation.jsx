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
    const { shop } = useLoaderData();
    const actionData = useActionData();
    const success = actionData ? actionData.success : false;
    const liquidbanner = useRef(null);
    const jsonbanner = useRef(null);

    const { state } = useNavigation();
    const pending = state === "submitting";
    const installURL = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=sectionId:main`;


    const storeData = { domain: shop }

    return (
        <Page>
            <BlockStack gap={400}>
                <PageTitle title='Installation' />
                {!shop && <Banner
                    title="Oh, no."
                    action={{ content: 'Refresh Page', url: '/app/installation' }}
                    tone="critical"
                >
                    <p>Something went wrong.</p>
                </Banner>}

                <BlockStack gap={"600"}>
                    <ViewsCountInstall liquidbanner={liquidbanner} pending={pending} jsonbanner={jsonbanner} installURL={installURL} />
                    <MostViewedSection storeData={storeData} />
                </BlockStack>
            </BlockStack>
        </Page>
    );
}
