-- CreateTable
CREATE TABLE "country_capitals" (
    "id" SERIAL NOT NULL,
    "country" VARCHAR(40) NOT NULL,
    "capital" VARCHAR(40),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_capitals.country_unique" ON "country_capitals"("country");
