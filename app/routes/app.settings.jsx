import { BlockStack, Button, Card, InlineStack, Page, Text } from '@shopify/polaris'
import { ArrowLeftIcon } from '@shopify/polaris-icons';

import React from 'react'
import PageTitle from '../components/PageTitle';

const Settings = () => {
  return (
    <Page>
      <BlockStack gap={400}>
        <PageTitle title='Settings' />
        <Card >

          Hello
        </Card>
      </BlockStack>
    </Page>
  )
}

export default Settings