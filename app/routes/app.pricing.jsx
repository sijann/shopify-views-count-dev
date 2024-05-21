import React from 'react'
import { MONTHLY_PLAN, authenticate } from '../shopify.server';
import { Badge, BlockStack, Button, Card, Divider, InlineGrid, InlineStack, List, Page, Text } from '@shopify/polaris';
import { useLoaderData, useNavigation } from '@remix-run/react';


export const loader = async ({ request }) => {
    const { billing } = await authenticate.admin(request);
    const { hasActivePayment, appSubscriptions } = await billing.check({
        plans: [MONTHLY_PLAN],
        isTest: true,
    });


    return { hasActivePayment, appSubscriptions };
};

const Pricing = () => {

    const plans = [
        {
            name: 'Pro',
            price: '$3.99',
            features: [
                'Unlimited views',
                'Views Count Block',
                'Most viewed products section',
                'Customizable text',
                'Priority support',
            ],
        },

    ]

    const { hasActivePayment, appSubscriptions } = useLoaderData();

    const navigation = useNavigation();

    const isLoading = false





    return (

        <Page>

            <Card>
                <BlockStack gap={600}>
                    <BlockStack gap={400} align='center' inlineAlign='center'>

                        <InlineStack gap={"200"}>
                            <Text as="h2" variant="headingMd">
                                Pricing
                            </Text>
                        </InlineStack>
                        <Text>
                            Choose a plan that fits your needs. You can always upgrade or downgrade your plan.
                        </Text>
                    </BlockStack>

                    <InlineStack align='center' gap='200' >

                        {plans.map((plan, index) => {
                            return (
                                <Card key={index} background=''>
                                    <BlockStack gap={500}>
                                        <BlockStack gap={300} inlineAlign='center'>
                                            <Text as="h3" alignment='center' variant="headingLg">
                                                {plan.name}
                                            </Text>
                                            <Badge tone='success' size='large'> 7-DAY FREE TRIAL </Badge>
                                            <Text as='h3' variant='headingMd' tone='magic'>
                                                {plan.price} per month
                                            </Text>
                                        </BlockStack>
                                        <Divider borderWidth='050' />
                                        <List>
                                            {plan.features.map((feature, index) => {
                                                return (
                                                    <List.Item key={index}>
                                                        <Text variant='bodyMd'>{feature}</Text>
                                                    </List.Item>
                                                )
                                            })}
                                        </List>
                                        <Button variant='primary' disabled={isLoading} loading={isLoading} tone={`${hasActivePayment ? 'critical' : 'success'}`} url={`${hasActivePayment ? '/app/plans/cancel' : '/app/upgrade'}`}>
                                            {hasActivePayment ? 'Cancel' : 'Upgrade'}
                                        </Button>
                                    </BlockStack>
                                </Card>
                            )
                        })}
                    </InlineStack>
                </BlockStack>
            </Card>

        </Page>
    )
}

export default Pricing