-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "disabledChannels" TEXT[],
    "modRoles" TEXT[],
    "prefixes" TEXT[],

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("id")
);
