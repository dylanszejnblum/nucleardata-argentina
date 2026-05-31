-- CreateTable
CREATE TABLE "uranium_project" (
    "id" SERIAL NOT NULL,
    "project_name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "province" TEXT,
    "province_code" TEXT,
    "status" TEXT,
    "status_label" TEXT,
    "mineral" TEXT NOT NULL DEFAULT 'Uranio',
    "controllers" JSONB,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uranium_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uranium_price" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "price_usd" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'USD/lb',
    "year" INTEGER,
    "month" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'siacam',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uranium_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uranium_trade" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "trade_type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "value_usd" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'siacam',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uranium_trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uranium_fact" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uranium_fact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uranium_project_project_name_key" ON "uranium_project"("project_name");

-- CreateIndex
CREATE INDEX "uranium_project_province_idx" ON "uranium_project"("province");

-- CreateIndex
CREATE INDEX "uranium_project_status_idx" ON "uranium_project"("status");

-- CreateIndex
CREATE INDEX "uranium_price_date_idx" ON "uranium_price"("date");

-- CreateIndex
CREATE UNIQUE INDEX "uranium_price_source_date_key" ON "uranium_price"("source", "date");

-- CreateIndex
CREATE INDEX "uranium_trade_year_trade_type_idx" ON "uranium_trade"("year", "trade_type");

-- CreateIndex
CREATE UNIQUE INDEX "uranium_fact_key_key" ON "uranium_fact"("key");
