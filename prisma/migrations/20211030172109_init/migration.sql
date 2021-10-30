-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "prefixes" TEXT[],
    "disabledChannels" TEXT[],

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("id")
);
