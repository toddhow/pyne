-- AlterTable
ALTER TABLE "GuildSettings" ADD COLUMN     "disabledChannels" TEXT[];

-- CreateTable
CREATE TABLE "StaffMembers" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffMembers.id_unique" ON "StaffMembers"("id");
