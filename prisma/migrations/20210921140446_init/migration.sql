-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(20) NOT NULL,
    "answers" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivated_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);
