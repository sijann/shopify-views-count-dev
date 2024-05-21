/*
  Warnings:

  - Made the column `timeframe` on table `ProductView` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productHandle" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProductView" ("count", "createdAt", "id", "productHandle", "productId", "storeId", "timeframe") SELECT "count", "createdAt", "id", "productHandle", "productId", "storeId", "timeframe" FROM "ProductView";
DROP TABLE "ProductView";
ALTER TABLE "new_ProductView" RENAME TO "ProductView";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
