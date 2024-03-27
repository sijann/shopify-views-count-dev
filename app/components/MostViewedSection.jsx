import { Banner, BlockStack, Box, Button, Card, FormLayout, InlineGrid, InlineStack, Select, Text } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons';
import React, { useCallback, useState } from 'react'

const MostViewedSection = ({ storeData, blockData }) => {

    const { domain } = storeData;

    const [selected, setSelected] = useState('index');

    const handleSelectChange = useCallback(
        (value) => setSelected(value),
        [],
    );
    const options = [
        { label: 'Homepage', value: 'index' },
        { label: 'Product Page', value: 'product' },
        { label: 'Collection Page', value: 'collection' },
        { label: 'Cart Page', value: 'cart' },
    ];
    const blockURL = `https://${domain}/admin/themes/current/editor?template=${selected}&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/most-viewed-products&target=newSection`
    return (
        <Card>
            <BlockStack gap={400}>
                <BlockStack gap={200}>
                    <Text variant='headingMd' as='h2'>Install Most Viewed Products Section</Text>
                    <Text>Add 'Most Viewed Products' section to your store. You can customize the options from the theme editor.</Text>
                </BlockStack>
                <InlineGrid columns={2} gap={200}>

                    <Banner tone="success" icon={''} >
                        <InlineStack direction={'row'} blockAlign='end' gap={"200"}>

                            <FormLayout>
                                <Select

                                    label="Select Page Template"
                                    options={options}
                                    onChange={handleSelectChange}
                                    value={selected}
                                />

                                <Button tone="success" icon={PlusIcon} variant="primary" url={blockURL} target="_blank">
                                    Install
                                </Button>
                            </FormLayout>
                        </InlineStack>
                    </Banner>
                    {/* <Form method={hasScript ? 'DELETE' : 'POST'}>
    <Banner ref={liquidbanner} title="For themes that don't support app blocks" tone="warning" icon={''} >
        <BlockStack align="start" inlineAlign="start" gap={"200"}>
            <Text as="p">If you see 'app block not added' message, you can add a script tag to display the views count.</Text>
            <Button loading={pending} tone={hasScript ? 'critical' : 'success'} icon={hasScript ? MinusIcon : PlusIcon} variant="primary" submit={true}>
                {hasScript ? 'Remove Script' : 'Add Script'}
            </Button>
        </BlockStack>
    </Banner>
</Form> */}
                </InlineGrid>
            </BlockStack>
        </Card>
    )
}

export default MostViewedSection