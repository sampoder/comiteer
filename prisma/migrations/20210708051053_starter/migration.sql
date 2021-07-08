-- CreateTable
CREATE TABLE "Opportunities" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "address" TEXT,
    "longitude" INTEGER,
    "latitude" INTEGER,
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);
