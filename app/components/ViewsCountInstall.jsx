import { Form } from '@remix-run/react'
import { Banner, BlockStack, Button, Card, Icon, InlineGrid, InlineStack, Text, Tooltip } from '@shopify/polaris'
import { PlusIcon, MinusIcon, CheckIcon, ViewIcon } from '@shopify/polaris-icons';
import React from 'react'

const ViewsCountInstall = ({ hasScript, liquidbanner, pending, jsonbanner, blockInstalled, installURL }) => {
    return (
        <Card>
            <BlockStack gap={400}>
                <BlockStack gap={200}>

                    <InlineStack gap={"200"}>
                        <Text as="h2" variant="headingMd">
                            Install Views Count Block
                        </Text>


                    </InlineStack>
                    <Text>
                        Add views count block in the product page, which will look like this: (views: 101). You can always customize the text from theme editor.
                    </Text>
                </BlockStack>

                <InlineGrid columns={2} gap={200}>

                    <Banner ref={jsonbanner} title="For themes that support app blocks" tone="success" icon={''}>
                        <BlockStack align="start" inlineAlign="start" gap={"200"}>
                            <Text as="p">If you are using JSON templates, you can simply install the widget from here.</Text>
                            <InlineStack gap={300}>
                                <Button tone="success" icon={blockInstalled ? CheckIcon : PlusIcon} variant="primary" url={installURL} target="_blank">
                                    {blockInstalled ? 'Installed' : 'Install'}
                                </Button>
                                {blockInstalled &&
                                    <Button icon={ViewIcon} url={installURL} target="_blank">
                                        View block
                                    </Button>
                                }
                            </InlineStack>
                        </BlockStack>
                    </Banner>
                    <Form method={hasScript ? 'DELETE' : 'POST'}>
                        <Banner ref={liquidbanner} title="For themes that don't support app blocks" tone="warning" icon={''} >
                            <BlockStack align="start" inlineAlign="start" gap={"200"}>
                                <Text as="p">If you see 'app block not added' message, you can add a script tag to display the views count.</Text>
                                <Button loading={pending} tone={hasScript ? 'critical' : 'success'} icon={hasScript ? MinusIcon : PlusIcon} variant="primary" submit={true}>
                                    {hasScript ? 'Remove Script' : 'Add Script'}
                                </Button>
                            </BlockStack>
                        </Banner>
                    </Form>
                </InlineGrid>
            </BlockStack>
        </Card>
    )
}

export default ViewsCountInstall