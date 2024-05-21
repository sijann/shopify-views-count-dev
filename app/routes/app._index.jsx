import React, { useState } from 'react'
import { Banner, BlockStack, Button, Card, DataTable, Divider, Grid, InlineStack, Link, Page, Text, Thumbnail } from '@shopify/polaris'
import { authenticate } from '../shopify.server';
import db from '../db.server'
import { json } from '@remix-run/node';
import { redirect, useLoaderData, useNavigate } from '@remix-run/react';
import SkeletonExample from '../components/SkeletonPage';
import EmptyStateComponent from '../components/EmptyStateComponent';
import QuickLinks from '../components/QuickLinks';

export async function loader({ request }) {
  try {
    // Authenticate admin and extract session and admin objects
    const { session, admin } = await authenticate.admin(request);
    const { shop } = session;

    // Check if shop is available
    if (!shop) {
      return json({ success: false, shop: null, message: 'Shop is required.' });
    }

    const storeId = shop;

    // Parse page number from request URL
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;

    const pageSize = 10; // Define page size

    try {
      // Retrieve products and total count from the database
      const [products, totalProducts] = await Promise.all([
        db.productView.findMany({
          where: {
            storeId,
          },
          orderBy: {
            count: 'desc',
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        db.productView.count({
          where: {
            storeId,
          },
        }),
      ]);

      // Check if products are empty for the first page
      if (products.length === 0 && page === 1) {
        return json({ success: true, shop, products: null });
      }

      const productsJSON = [];

      // Iterate through products and fetch additional details
      for (const productView of products) {
        try {
          const product = await admin.rest.resources.Product.find({
            session,
            id: productView.productId,
          });
          productsJSON.push({
            title: product.title,
            image: product.image.src,
            url: `https://${shop}/products/${product.handle}`,
            views: productView.count
          });
        } catch (e) {
          console.error(`Error fetching product: ${e}`);
        }
      }

      // Return success response with products data and total count
      return {
        success: true,
        shop,
        page,
        perPage: pageSize,
        totalProducts,
        productsData: productsJSON
      };

    } catch (e) {
      // Handle database error
      console.error('Error while fetching products data:', e);
      return json({ success: false, shop, message: 'Error while fetching products data.' });
    }

  } catch (error) {
    // Handle authentication error
    console.error('Authentication error:', error);
    return json({ success: false, message: 'Something went wrong.', error });
  }
}




const Index = () => {
  const { success, message = '', productsData, shop, page, perPage = 1, totalProducts = 0 } = useLoaderData()

  console.log(totalProducts, '---totalproducts---')

  let hasNextPage = true;
  if (page * perPage >= totalProducts) hasNextPage = false

  const productsArray = productsData?.map((product) => {
    return [<InlineStack blockAlign='center' gap={'100'}><Thumbnail source={product.image} size='small' /> <Link target='_blank' removeUnderline url={product.url} > {product.title}</Link> </InlineStack>, product.views]
  })

  const url = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=newAppsSection`

  const navigate = useNavigate();




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
          <BlockStack gap={400}>
            <Text as='h2' variant='headingMd'>Home</Text>
            <Divider borderWidth='025' borderColor='border-tertiary' />
            <Grid >
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 9, xl: 9 }} >
                <BlockStack gap={200}>


                  {productsData ?
                    <BlockStack gap={200}>

                      <Text as='h3' variant='headingMd' > Products Data </Text>
                      <Card sectioned>
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
                          pagination={{

                            label: `${page}/${Math.ceil(totalProducts / perPage)}`,
                            hasPrevious: page > 1,
                            onPrevious: () => {
                              navigate(`/app?page=${page - 1}`)

                            },
                            hasNext: hasNextPage,
                            onNext: () => {
                              navigate(`/app?page=${page + 1}`)

                            },
                          }}
                        />
                      </Card>

                    </BlockStack>
                    : <EmptyStateComponent />
                  }



                </BlockStack>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 3, xl: 3 }} >
                <QuickLinks />
              </Grid.Cell>


            </Grid>
          </BlockStack>

        </Page>

        :

        <SkeletonExample />
      }
    </>
  )
}

export default Index