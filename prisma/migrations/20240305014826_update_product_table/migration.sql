-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProductView" ("createdAt", "id", "productId", "storeId", "viewCount") SELECT "createdAt", "id", "productId", "storeId", "viewCount" FROM "ProductView";
DROP TABLE "ProductView";
ALTER TABLE "new_ProductView" RENAME TO "ProductView";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
