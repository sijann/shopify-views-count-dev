import { authenticate } from "../shopify.server";

export async function loader({ request }) {

    const { admin, session } = await authenticate.admin(request);

    const themes = await admin.rest.resources.Theme.all({
        session: session,
    });

    const activeThemeId = themes.data[0].id;

    const activeThemeData = await admin.rest.resources.Theme.find({
        session: session,
        id: activeThemeId,
    });

    const response = await admin.graphql(
        `#graphql
        query {
            translatableResources(first: 10, resourceType: ONLINE_STORE_THEME) {
                edges {
                    node {
                        resourceId
                        translatableContent {
                            key
                            value
                            digest
                        }
                      
                    }
                }
            }
        }`
    );

    const parsedResponse = await response.json();

    return parsedResponse;
}


export const Theme = () => {
    return (
        <>
            Themes
        </>
    )
}