/*
  Warnings:

  - You are about to alter the column `productId` on the `ProductView` table. The data in that column could be lost. The data in that column will be cast from `String` to `BigInt`.
  - You are about to alter the column `storeId` on the `ProductView` table. The data in that column could be lost. The data in that column will be cast from `String` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_ProductView" ("count", "id", "productId", "storeId") SELECT "count", "id", "productId", "storeId" FROM "ProductView";
DROP TABLE "ProductView";
ALTER TABLE "new_ProductView" RENAME TO "ProductView";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
