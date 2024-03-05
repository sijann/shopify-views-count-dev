// app.product.js

import { json } from '@remix-run/node';
import db from '../db.server';

export const loader = async ({ request }) => {
    return handleGet(request);


};


export const action = async ({ request }) => {
    console.log("REQUESTTTTT--->")
    return handlePost(request);
}

async function handlePost(request) {
    const data = await request.json();

    const { storeId, productId } = data;

    let productView = await db.productView.findFirst({
        where: {
            storeId,
            productId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!productView || isDifferentTimeframe(productView.createdAt, new Date())) {
        // Create a new entry if no entry exists or if the last entry is for a different timeframe
        await db.productView.create({
            data: {
                storeId,
                productId,
                count: 1,
            },
        });

        productView = { count: 1 }; // Set count to 1 for the response
    } else {
        // Update the existing entry if it's for the same timeframe
        await db.productView.update({
            where: {
                id: productView.id,
            },
            data: {
                count: {
                    increment: 1,
                },
            },
        });

        productView.count++; // Increment count for the response
    }

    console.log("REQUESTTTTT--->")
    return new Response(JSON.stringify({ success: true, count: productView.count }), {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"

        },
    });
}


async function handleGet(request) {

    const url = new URL(request.url);
    const storeId = url.searchParams.get("storeId");
    const productId = url.searchParams.get("productId");
    const timeframe = url.searchParams.get("timeframe");


    if (!storeId || !productId) {
        return json({ success: false, message: 'storeId and productId is required' })
    }

    let startDate;
    let endDate = new Date();

    switch (timeframe) {
        case 'hour':
            startDate = new Date();
            startDate.setHours(startDate.getHours() - 1);
            break;
        case 'today':
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'week':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - startDate.getDay());
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            startDate = new Date();
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'custom':
            if (!from) {
                return new Response(JSON.stringify({ error: 'Custom timeframe requires start date (from)' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET',

                    },
                });
            }
            startDate = new Date(from);
            break;
        default:
            startDate = new Date(0);
            break;
    }

    const totalCount = await db.productView.aggregate({
        where: {
            storeId,
            productId,
            createdAt: {
                gte: startDate
            },
        },
        _sum: {
            count: true,
        },
    });

    return new Response(JSON.stringify({ totalCount: totalCount._sum.count }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
        },
    });
}


function isDifferentTimeframe(timestamp1, timestamp2) {
    return timestamp1.getDate() !== timestamp2.getDate()
        || timestamp1.getMonth() !== timestamp2.getMonth()
        || timestamp1.getFullYear() !== timestamp2.getFullYear();
}
