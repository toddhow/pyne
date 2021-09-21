-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prefix" TEXT NOT NULL DEFAULT '*',

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild.id_unique" ON "Guild"("id");
