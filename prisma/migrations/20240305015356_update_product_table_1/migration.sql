/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductView` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_ProductView" ("id", "productId", "storeId", "viewCount") SELECT "id", "productId", "storeId", "viewCount" FROM "ProductView";
DROP TABLE "ProductView";
ALTER TABLE "new_ProductView" RENAME TO "ProductView";
CREATE UNIQUE INDEX "ProductView_storeId_key" ON "ProductView"("storeId");
CREATE UNIQUE INDEX "ProductView_productId_key" ON "ProductView"("productId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
