import { Card, EmptyState, Text } from "@shopify/polaris";


function EmptyStateComponent() {

    return (
        <Card>
            <EmptyState
                heading="Dashboard is empty."
                action={{ content: 'Install', url: '/app/installation' }}
                secondaryAction={{
                    content: 'Get Help',
                    url: '/app/contact',

                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
                <Text>Products data will appear here once you install the widget and the products get views.</Text>
            </EmptyState>
        </Card>
    );

}

export default EmptyStateComponent
