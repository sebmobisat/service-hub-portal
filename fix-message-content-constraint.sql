-- Fix message_content constraint for AI-only templates
-- This allows message_content to be NULL for template_type = 'ai'

-- Step 1: Remove the NOT NULL constraint from message_content column
ALTER TABLE public.communication_templates 
ALTER COLUMN message_content DROP NOT NULL;

-- Step 2: Update existing AI-only templates to have NULL message_content
-- (Only if they are pure AI templates that should not have manual content)
UPDATE public.communication_templates 
SET message_content = NULL 
WHERE template_type = 'ai' 
  AND prompt IS NOT NULL 
  AND message_content IS NOT NULL;

-- Step 3: Add a check constraint to ensure message_content is present when needed
ALTER TABLE public.communication_templates 
ADD CONSTRAINT check_message_content_for_type 
CHECK (
  (template_type = 'ai' AND message_content IS NULL) OR 
  (template_type IN ('manual', 'hybrid') AND message_content IS NOT NULL)
);

-- Step 4: Update the comment to reflect the new constraint
COMMENT ON COLUMN public.communication_templates.message_content IS 'Contenuto del messaggio con placeholder (NULL per template AI-only)';

-- Step 5: Verify the changes
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'communication_templates' 
  AND column_name = 'message_content';

-- Step 6: Show existing constraints
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.communication_templates'::regclass;

-- Step 7: Show updated templates
SELECT 
  id, name, template_type, 
  CASE WHEN prompt IS NULL THEN 'NO' ELSE 'YES' END as has_prompt,
  CASE WHEN message_content IS NULL THEN 'NO' ELSE 'YES' END as has_content
FROM public.communication_templates 
ORDER BY template_type, name;
