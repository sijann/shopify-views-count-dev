import { BlockStack, Card, Page } from '@shopify/polaris'
import React from 'react'
import PageTitle from '../components/PageTitle'

const Contact = () => {
    return (
        <Page>
            <BlockStack gap={400}>
                <PageTitle title='Contact' />
                <Card></Card>
            </BlockStack>
        </Page>
    )
}

export default Contact