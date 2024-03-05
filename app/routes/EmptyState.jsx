import { json, useLoaderData } from '@remix-run/react';
import { EmptyState, Card } from '@shopify/polaris';
import React from 'react';
import { authenticate } from '../shopify.server';

export async function loader({ request }) {
    try {
        const { topic, session, admin } = await authenticate.admin(request);
        const { shop } = session;
        return { shop: shop };
    } catch (error) {
        console.error('Error:', error);
        return json({ success: false, message: 'An error occurred.' });
    }
}

function EmptyStateComponent() {
    const { shop } = useLoaderData()
    const url = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=newAppsSection`

    return (
        <EmptyState
            heading="Dashboard is empty."
            action={{ content: 'Install', url: url, target: '_blank' }}
            secondaryAction={{
                content: 'Settings',
                url: '/app/settings',
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
            <p>Start by customizing the settings, or installing the widget to your store. </p>
        </EmptyState>
    );

}

export default EmptyStateComponent
