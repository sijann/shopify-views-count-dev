-- AlterTable
ALTER TABLE "ProductView" ADD COLUMN "timeframe" TEXT;

-- CreateTable
CREATE TABLE "AllViews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
