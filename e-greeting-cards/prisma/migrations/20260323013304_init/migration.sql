-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "design_config" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "sender_email" TEXT,
    "sender_name" TEXT NOT NULL,
    "custom_text" TEXT NOT NULL,
    "custom_styling" TEXT,
    "link_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "stripe_payment_id" TEXT,
    "amount_paid_cents" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed_at" TIMESTAMP(3),

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "recipient_email" TEXT NOT NULL,
    "email_sent_at" TIMESTAMP(3),
    "first_opened_at" TIMESTAMP(3),
    "open_count" INTEGER NOT NULL DEFAULT 0,
    "last_opened_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_opens" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "recipient_id" TEXT,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "referrer" TEXT,
    "device_type" TEXT,

    CONSTRAINT "card_opens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_link_token_key" ON "cards"("link_token");

-- CreateIndex
CREATE INDEX "cards_link_token_idx" ON "cards"("link_token");

-- CreateIndex
CREATE INDEX "cards_expires_at_idx" ON "cards"("expires_at");

-- CreateIndex
CREATE INDEX "recipients_card_id_idx" ON "recipients"("card_id");

-- CreateIndex
CREATE INDEX "card_opens_card_id_idx" ON "card_opens"("card_id");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_opens" ADD CONSTRAINT "card_opens_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_opens" ADD CONSTRAINT "card_opens_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
