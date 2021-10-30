-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "prefixes" TEXT[],
    "disabledChannels" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildSettings_id_key" ON "GuildSettings"("id");
