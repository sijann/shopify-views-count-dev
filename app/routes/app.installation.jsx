import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { Banner, BlockStack, Button, Grid, Icon, InlineGrid, List, Page, Text, TextField } from "@shopify/polaris"
import { PlusIcon, MinusIcon, CheckIcon } from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";





export async function loader({ request }) {
    try {
        const { admin, session } = await authenticate.admin(request);
        const { shop } = session

        let response = {}

        response.shop = shop

        const scriptsTags = await admin.rest.resources.ScriptTag.all({
            session: session,
        });

        const hasScript = scriptsTags.data.some(
            obj => obj.src === "https://host-scripts.onrender.com/shopify-views-script.js"
        );

        response.hasScript = hasScript


        const themes = await admin.rest.resources.Theme.all({
            session: session,
        });
        const currentTheme = themes.data.find(theme => theme.role === 'main');



        let productPage;
        if (currentTheme) {
            productPage = await admin.rest.resources.Asset.all({
                session: session,
                theme_id: currentTheme.id,
                asset: { "key": "templates/product.json" },
            });



            const asset = productPage.data

            response.productPage = asset

            if (asset) {
                const assetValue = JSON.parse(asset[0].value);
                const sectionKeys = Object.keys(assetValue.sections);
                const sectionId = sectionKeys[0];
                response.sectionId = sectionId

                const sectionsString = JSON.stringify(assetValue.sections);

                // Search for the text "6b3abca8-2d33-43dd-a64e-90115c65c50d" in the string
                const searchText = "6b3abca8-2d33-43dd-a64e-90115c65c50d";
                const blockFound = sectionsString.includes(searchText);
                if (blockFound) {
                    response.blockInstalled = true;
                }
            }

        }

        console.log('----responde', response)

        return json(response);
    } catch (error) {
        return json({ error: error.message });
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
                const hasScript = scriptsTags.data.find(
                    obj => obj.src === "https://host-scripts.onrender.com/shopify-views-script.js"
                );
                if (hasScript) {
                    await admin.rest.resources.ScriptTag.delete({ session, id: hasScript.id });
                }
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        default:
            return { success: false };
    }
}
export default function Installation() {
    const { shop, productPage, hasScript, sectionId, blockInstalled = false } = useLoaderData();
    console.log(productPage)
    const actionData = useActionData();
    const success = actionData ? actionData.success : false;
    const installURL = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=sectionId:${sectionId}`


    return (
        <Page>
            <InlineGrid columns={2} gap={200}>
                <Form method={hasScript ? 'DELETE' : 'POST'}>
                    <Banner title="For themes that don't support app blocks" tone="warning">
                        <BlockStack align="start" inlineAlign="start" gap={"200"}>
                            <Text as="p">
                                If you see 'app block not added' message, you can add a script tag to display the views count.
                                {hasScript &&
                                    "(already added)"

                                }
                            </Text>


                            <Button tone={hasScript ? 'critical' : 'success'} icon={hasScript ? MinusIcon : PlusIcon} variant="primary" submit={true}>
                                {hasScript ? 'Remove Script' : 'Add Script'}
                            </Button>
                            {/* {success && <p>Script {hasScript ? 'added' : 'removed'} successfully.</p>} */}
                        </BlockStack>
                    </Banner>
                </Form>

                <Banner title="For themes that support app blocks" tone="success">
                    <BlockStack align="start" inlineAlign="start" gap={"200"}>
                        <Text as="p">
                            If you are using JSON templates, you can simply install the widget from here.
                        </Text>

                        <Button tone="success" icon={blockInstalled ? CheckIcon : PlusIcon} variant="primary" url={installURL} target="_blank">
                            {blockInstalled ? 'Installed' : 'Install'}
                        </Button>
                    </BlockStack>
                </Banner>

            </InlineGrid>
        </Page>
    );
}
