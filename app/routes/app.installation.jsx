import { Form, json } from "@remix-run/react";
import { Banner, Button, List, Page } from "@shopify/polaris"
import { authenticate } from "../shopify.server";


export async function loader({ request }) {

    const { admin, session } = await authenticate.admin(request);



    const scriptsTags = await admin.rest.resources.ScriptTag.all({
        session: session,
    });

    let tags = scriptsTags.data

    const hasScript = tags.some(obj => obj.src === "https://temp.staticsave.com/65e728860bb8c.js")

    if (!hasScript) {
        const script_tag = new admin.rest.resources.ScriptTag({ session: session });

        script_tag.event = "onload";
        script_tag.src = "https://temp.staticsave.com/65e728860bb8c.js";
        await script_tag.save({
            update: true,
        });
    }

    return json(tags);
}


export default function Installation() {
    return (
        <Page>
            <Form method="POST">
                <Banner
                    title="For themes that don't support app blocks"
                    tone="critical"
                >
                    <List>
                        <List.Item>
                            If you see 'app block not added' message, you can add an script tag to display the views count.
                        </List.Item>

                    </List>

                    <Button submit={true} > Add Script</Button>
                </Banner>
            </Form>
        </Page>
    )

}