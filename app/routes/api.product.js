// app.product.js

import { json } from '@remix-run/node';
import db from '../db.server';

export const loader = async ({ request }) => {
    return handleGet(request);


};


export const action = async ({ request }) => {
    return handlePost(request);
}


async function handlePost(request) {
    const data = await request.json();

    let { storeId, productId, productHandle, timeframe = 'alltime' } = data;

    if (!['hour', 'day', 'week', 'month'].includes(timeframe)) {
        timeframe = 'alltime'
    }

    console.log(timeframe)

    if (!storeId || !productId || !productHandle) {
        return json({ success: false })
    }

    let createdAtFilter = {};

    // Adjust createdAt filter based on the timeframe
    switch (timeframe) {
        case 'hour':
            createdAtFilter = {
                createdAt: {
                    gte: new Date(Date.now() - 3600000) // 1 hour ago
                }
            };
            break;
        case 'day':
            createdAtFilter = {
                createdAt: {
                    gte: new Date(Date.now() - 86400000) // 24 hours ago
                }
            };
            break;
        case 'week':
            // Implement week logic
            break;
        case 'month':
            // Implement month logic
            break;
        default:
        // For 'alltime', no time filtering needed
    }

    let productView = await db.productView.findFirst({
        where: {
            storeId,
            productId,
            timeframe,
            ...createdAtFilter // Apply createdAt filter if needed
        }
    }
    );




    if (!productView) {
        // If no ProductView record found, create a new one


        const viewCount = await db.allViews.count({
            where: {
                storeId,
                productId,
                ...createdAtFilter // Apply createdAt filter if needed
            }
        });

        await db.productView.create({
            data: {
                storeId,
                productId,
                productHandle,
                timeframe,
                count: viewCount ? viewCount : 1,
            },
        });

        // Create an AllViews record for every view
        await db.allViews.create({
            data: {
                storeId,
                productId
            }
        });

        return new Response(JSON.stringify({ success: true, count: 1 }), {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
        });
    } else {
        // If ProductView record exists, update the count
        await db.allViews.create({
            data: {
                storeId,
                productId
            }
        });


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

        return new Response(JSON.stringify({ success: true, count: productView.count + 1 }), {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
        });
    }
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
