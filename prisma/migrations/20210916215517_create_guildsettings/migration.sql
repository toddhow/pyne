/*
  Warnings:

  - You are about to drop the `Guild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Guild";

-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "prefixes" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildSettings.id_unique" ON "GuildSettings"("id");
