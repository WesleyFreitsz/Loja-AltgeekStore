-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "minPurchase" REAL NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerCpfCnpj" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressNumber" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "totalValue" REAL NOT NULL,
    "discountValue" REAL NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "asaasPaymentId" TEXT,
    "asaasInvoiceUrl" TEXT,
    "pixPayload" TEXT,
    "pixEncodedImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("address", "addressNumber", "asaasInvoiceUrl", "asaasPaymentId", "createdAt", "customerCpfCnpj", "customerEmail", "customerName", "customerPhone", "id", "paymentMethod", "pixEncodedImage", "pixPayload", "postalCode", "province", "status", "totalValue", "updatedAt", "userId") SELECT "address", "addressNumber", "asaasInvoiceUrl", "asaasPaymentId", "createdAt", "customerCpfCnpj", "customerEmail", "customerName", "customerPhone", "id", "paymentMethod", "pixEncodedImage", "pixPayload", "postalCode", "province", "status", "totalValue", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_asaasPaymentId_key" ON "Order"("asaasPaymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON "Favorite"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
