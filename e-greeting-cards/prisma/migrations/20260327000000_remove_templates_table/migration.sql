-- Remove FK constraint from cards to templates
ALTER TABLE "cards" DROP CONSTRAINT IF EXISTS "cards_template_id_fkey";

-- Drop templates table
DROP TABLE IF EXISTS "templates";
