import { BlockStack, Button, Card, Grid, Icon, Text } from '@shopify/polaris'
import {
    PlusIcon, SettingsIcon, NoteIcon, ChatIcon
} from '@shopify/polaris-icons';
import React from 'react'

const QuickLinks = () => {
    return (



        <BlockStack gap={200}>
            <Text as='h3' variant='headingMd' alignment='center' > Quick Links </Text>

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
                    <Card>
                        <BlockStack align='center' inlineAlign='center' gap={200}>
                            <Text alignment='center'>Install the widgets into your store.</Text>
                            <Button tone='success' variant='plain' url='/app/installation' icon={PlusIcon} > Installation</Button>
                        </BlockStack>
                    </Card>
                </Grid.Cell>

                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
                    <Card>
                        <BlockStack align='center' inlineAlign='center' gap={200}>
                            <Text alignment='center'>Customize the widget settings.</Text>
                            <Button tone='success' variant='plain' url='/app/settings' icon={SettingsIcon} >Settings</Button>
                        </BlockStack>
                    </Card>

                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
                    <Card>
                        <BlockStack align='center' inlineAlign='center' gap={200}>
                            <Text alignment='center'>Find a solution for commonly asked questions.</Text>
                            <Button tone='success' variant='plain' url='/app/faq' icon={ChatIcon} >FAQ</Button>
                        </BlockStack>
                    </Card>

                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
                    <Card>
                        <BlockStack align='center' inlineAlign='center' gap={200}>
                            <Text alignment='center'>Have question? Contact us.</Text>
                            <Button tone='success' variant='plain' url='/app/contact' icon={ChatIcon} >Contact</Button>
                        </BlockStack>
                    </Card>

                </Grid.Cell>
            </Grid>

        </BlockStack >
    )
}

export default QuickLinks