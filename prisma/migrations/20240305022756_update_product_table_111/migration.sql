/*
  Warnings:

  - You are about to drop the column `viewCount` on the `ProductView` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProductView" ("id", "productId", "storeId") SELECT "id", "productId", "storeId" FROM "ProductView";
DROP TABLE "ProductView";
ALTER TABLE "new_ProductView" RENAME TO "ProductView";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
