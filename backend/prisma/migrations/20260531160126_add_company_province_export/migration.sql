-- CreateTable
CREATE TABLE "company" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "logo_url" TEXT,
    "stock_ticker" TEXT,
    "stock_exchange" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "commodities" TEXT[],
    "provinces" TEXT[],
    "project_count_oil_gas" INTEGER NOT NULL DEFAULT 0,
    "project_count_mining" INTEGER NOT NULL DEFAULT 0,
    "oil_production_m3" DOUBLE PRECISION,
    "gas_production_m3" DOUBLE PRECISION,
    "boe_total" DOUBLE PRECISION,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "province_export" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "province_name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "value_annual_usd" DOUBLE PRECISION NOT NULL,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "province_export_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_type_idx" ON "company"("type");

-- CreateIndex
CREATE INDEX "company_is_public_idx" ON "company"("is_public");

-- CreateIndex
CREATE INDEX "province_export_slug_idx" ON "province_export"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "province_export_slug_sector_product_name_key" ON "province_export"("slug", "sector", "product_name");
