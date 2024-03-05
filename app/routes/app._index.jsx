import React from 'react'
import EmptyStateComponent from './EmptyState'
import { DataTable, LegacyCard, Link, Page } from '@shopify/polaris'
import { authenticate } from '../shopify.server';
import db from '../db.server'
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

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

    if (products.length === 0) return json({ success: true, products: null });

    const productsJSON = await Promise.all(products.map(async (productView) => {
      const product = await admin.rest.resources.Product.find({
        session: session,
        id: productView.productId,
      });
      return { title: product.title, url: `https://${shop}/products/${product.handle}`, views: productView.count }
    }));

    console.log(productsJSON, '---->json');

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
    return [<Link target='_blank' removeUnderline url={product.url} > {product.title}</Link>, product.views]
  })

  const url = `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=6b3abca8-2d33-43dd-a64e-90115c65c50d/views-count&target=newAppsSection`



  return (
    <Page title='Most viewed products' primaryAction={{ url: url, content: 'Install', target: '_blank' }}>


      <LegacyCard>
        {productsData ?
          <DataTable
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
    </Page>
  )
}

export default Index