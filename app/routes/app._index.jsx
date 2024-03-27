import React, { useState } from 'react'
import EmptyStateComponent from './EmptyState'
import { Avatar, Banner, BlockStack, Button, Card, DataTable, EmptyState, Grid, InlineStack, LegacyCard, Link, Page, Pagination, Text, Thumbnail } from '@shopify/polaris'
import { authenticate } from '../shopify.server';
import db from '../db.server'
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import SkeletonExample from '../components/SkeletonPage';

export async function loader({ request }) {
  try {
    const { session, admin } = await authenticate.admin(request);
    const { shop } = session;

    if (!shop) {
      return json({ success: false, shop: null, message: 'shop is required.' });
    }

    const storeId = shop;
    const page = 1;
    const pageSize = 20;

    try {
      const products = await db.productView.findMany({
        where: {
          storeId,
        },
        orderBy: {
          count: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      if (products.length === 0) {
        return json({ success: true, shop, products: null });
      }
      const productsJSON = [];

      for (const productView of products) {
        try {
          const product = await admin.rest.resources.Product.find({
            session,
            id: productView.productId,
          });
          productsJSON.push({
            success: true,
            title: product.title,
            image: product.image.src,
            url: `https://${shop}/products/${product.handle}`,
            views: productView.count
          });
        } catch (e) {
          console.error(`Error fetching product: ${e}`);
        }
      }




      return { success: true, shop, productsData: productsJSON };
    } catch (e) {
      console.error(e);
      return json({ success: false, shop, message: 'Error while fetching products data.' });
    }

  } catch (error) {
    console.error(error);
    return json({ success: false, message: 'Something went wrong.', error });
  }
}






const Index = () => {
  const { success, message = '', productsData, shop } = useLoaderData()

  const productsArray = productsData?.map((product) => {
    return [<InlineStack blockAlign='center' gap={'100'}><Thumbnail source={product.image} size='small' /> <Link target='_blank' removeUnderline url={product.url} > {product.title}</Link> </InlineStack>, product.views]
  })

  const url = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=newAppsSection`



  return (
    <>
      {!success &&
        <Page><Banner
          title="Oh, no."
          action={{ content: 'Refresh Page', url: '/app/' }}
          tone="critical"

        >
          <p>
            {message}
          </p>
        </Banner>
        </Page>}

      {shop ?
        <Page >
          <Grid >

            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 9, xl: 9 }} >
              <BlockStack gap={200}>
                <Text as='h3' variant='headingMd' > Products Data </Text>

                <Card sectioned>
                  {productsData ?
                    <DataTable
                      verticalAlign='middle'
                      columnContentTypes={[
                        'text',
                        'numeric',

                      ]}
                      headings={[
                        'Product',
                        'Views',

                      ]}
                      rows={productsArray}
                    />
                    : <EmptyStateComponent />
                  }

                </Card>

              </BlockStack>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }} >
              <BlockStack gap={200}>
                <Text as='h3' variant='headingMd' > Quick Links </Text>
                <Card sectioned>
                  <BlockStack gap={200}>
                    <Button tone='success' variant='primary' url='/app/installation' > Installation</Button>
                    <Button tone='success' variant='primary' url='/app/settings'> Settings</Button>
                    <Button tone='success' variant='primary' url='/app/faq'> FAQ</Button>
                    <Button tone='success' variant='primary' url='/app/contact'> Contact</Button>
                  </BlockStack>

                </Card>
              </BlockStack>

            </Grid.Cell>


          </Grid>
        </Page>

        :

        <SkeletonExample />
      }
    </>
  )
}

export default Index