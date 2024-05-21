import { Button, Divider, InlineStack, Text } from '@shopify/polaris'
import { ArrowLeftIcon } from '@shopify/polaris-icons';
import React from 'react'

const PageTitle = ({ title }) => {
    return (
        <>
            <InlineStack align="space-between" blockAlign="center">
                <Text as='h2' variant='headingMd'>{title}</Text>
                <Button url="/app/" icon={ArrowLeftIcon} >Back</Button>
            </InlineStack>
            <Divider borderWidth='025' borderColor='border-tertiary' />
        </>
    )
}

export default PageTitle