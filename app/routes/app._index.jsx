import React, { useState } from 'react'
import EmptyStateComponent from './EmptyState'
import { Avatar, BlockStack, Button, DataTable, Grid, InlineStack, LegacyCard, Link, Page, Pagination, Thumbnail } from '@shopify/polaris'
import { authenticate } from '../shopify.server';
import db from '../db.server'
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import SkeletonExample from '../components/SkeletonPage';

export async function loader({ request }) {
  try {
    const { topic, session, admin } = await authenticate.admin(request);
    const { shop } = session;

    const storeId = shop;
    const page = 1;
    const pageSize = 20;

    if (!storeId) return json({ success: false, message: 'storeId is required.' })

    const products = await db.productView.findMany({
      where: {
        storeId,
      },
      orderBy: {
        count: 'desc',
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    if (products.length === 0) return json({ success: true, shop: shop, products: null });

    const productsJSON = await Promise.all(products.map(async (productView) => {
      const product = await admin.rest.resources.Product.find({
        session: session,
        id: productView.productId,
      });

      console.log(product.image.src);
      return { title: product.title, image: product.image.src, url: `https://${shop}/products/${product.handle}`, views: productView.count }
    }));


    return { shop: shop, productsData: productsJSON };
  } catch (error) {
    console.error('Error:', error);
    return json({ success: false, message: 'An error occurred.' });
  }
}





const Index = () => {



  const { productsData, shop } = useLoaderData()

  console.log(productsData)

  const productsArray = productsData?.map((product) => {
    return [<InlineStack blockAlign='center' gap={'100'}><Avatar source={product.image} size='xl' /> <Link target='_blank' removeUnderline url={product.url} > {product.title}</Link> </InlineStack>, product.views]
  })

  const url = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=newAppsSection`



  return (
    <>
      {shop ?


        <Page >
          <Grid >
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 9, xl: 9 }} >

              <LegacyCard title='Most Viewed Products'>
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

              </LegacyCard>

            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }} >
              <LegacyCard title="Quick Links" sectioned >
                <BlockStack gap={200}>
                  <Button url='/app/installation' > Installation</Button>
                  <Button url='/app/settings'> Settings</Button>
                  <Button url='/app/faq'> FAQ</Button>
                  <Button url='/app/contact'> Contact</Button>
                </BlockStack>

              </LegacyCard>

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