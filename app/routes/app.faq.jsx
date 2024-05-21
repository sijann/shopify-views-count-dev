import {
    LegacyCard,
    LegacyStack,
    Button,
    Collapsible,
    TextContainer,
    Link,
    Page,
    InlineStack,
    Icon,
    Text,
    BlockStack,
    Card,
} from '@shopify/polaris';
import {
    CaretDownIcon,
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import PageTitle from '../components/PageTitle';

export default function Faq() {
    const [open, setOpen] = useState(true);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <Page>
            <BlockStack gap={400}>
                <PageTitle title='FAQ' />
                <Card>
                    <BlockStack inlineAlign='start'>
                        <Button
                            onClick={handleToggle}
                            ariaExpanded={open}
                            ariaControls="basic-collapsible"
                            variant='monochromePlain'
                        >
                            <InlineStack as='div' blockAlign='center' align='space-between' >
                                <Text> Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
                                <Icon source={CaretDownIcon} />

                            </InlineStack >
                        </Button>
                        <Collapsible
                            open={open}
                            id="basic-collapsible"
                            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                            expandOnPrint
                        >
                            <p>
                                Your mailing list lets you contact customers or visitors who
                                have shown an interest in your store. Reach out to them with
                                exclusive offers or updates about your products.
                            </p>
                            <Link url="#">Test link</Link>
                        </Collapsible>
                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
    );
}