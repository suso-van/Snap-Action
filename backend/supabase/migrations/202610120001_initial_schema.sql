-- SnapAction initial database schema
-- Apply once to a Supabase project.
-- Screenshot binaries are not stored in PostgreSQL.

-- ============================================================
-- 1. RESOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    category TEXT NOT NULL CHECK (
        category IN (
            'ticket', 'travel', 'payment', 'receipt',
            'package', 'address', 'task', 'event',
            'contact', 'link', 'github', 'document',
            'other', 'unclear', 'none'
        )
    ),

    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',

    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0
        CHECK (confidence_score BETWEEN 0 AND 1),

    category_confidence JSONB,

    warnings JSONB NOT NULL DEFAULT '[]'::JSONB
        CHECK (jsonb_typeof(warnings) = 'array'),

    extracted_entities JSONB NOT NULL DEFAULT '[]'::JSONB
        CHECK (jsonb_typeof(extracted_entities) = 'array'),

    suggested_actions JSONB NOT NULL DEFAULT '[]'::JSONB
        CHECK (jsonb_typeof(suggested_actions) = 'array'),

    ocr_text TEXT,
    image_storage_key TEXT,

    is_saved_to_library BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[] NOT NULL DEFAULT '{}',

    -- Epoch milliseconds, matching the frontend data contract.
    timestamp_ms BIGINT NOT NULL DEFAULT (
        (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
    ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Supports ownership-safe composite foreign keys.
    UNIQUE (owner_id, id)
);


-- ============================================================
-- 2. ACTION RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.action_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    screenshot_id UUID NOT NULL,
    action_id TEXT NOT NULL,

    executed_at_ms BIGINT NOT NULL DEFAULT (
        (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
    ),

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'snoozed')),

    category TEXT CHECK (
        category IS NULL OR category IN (
            'ticket', 'travel', 'payment', 'receipt',
            'package', 'address', 'task', 'event',
            'contact', 'link', 'github', 'document',
            'other', 'unclear', 'none'
        )
    ),

    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    tracking_info JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent attaching another user's resource to this record.
    CONSTRAINT action_records_resource_owner_fk
        FOREIGN KEY (owner_id, screenshot_id)
        REFERENCES public.resources(owner_id, id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. REMINDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    resource_id UUID NOT NULL,
    title TEXT NOT NULL,

    scheduled_at TIMESTAMPTZ NOT NULL,
    time_zone TEXT NOT NULL,
    notification_preference TEXT NOT NULL DEFAULT 'default',

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active', 'completed', 'snoozed', 'cancelled'
            )
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT reminders_resource_owner_fk
        FOREIGN KEY (owner_id, resource_id)
        REFERENCES public.resources(owner_id, id)
        ON DELETE CASCADE
);


-- ============================================================
-- 4. USER SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
    owner_id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,

    auto_detect_actions BOOLEAN NOT NULL DEFAULT TRUE,
    require_confirmation TEXT NOT NULL DEFAULT 'high_impact_only',
    default_reminder_offset TEXT NOT NULL DEFAULT '1h',

    default_calendar TEXT NOT NULL DEFAULT 'google'
        CHECK (default_calendar IN ('google', 'apple', 'ics')),

    store_screenshots_locally BOOLEAN NOT NULL DEFAULT TRUE,
    cloud_sync BOOLEAN NOT NULL DEFAULT FALSE,
    haptic_feedback BOOLEAN NOT NULL DEFAULT TRUE,

    theme TEXT NOT NULL DEFAULT 'dark',
    device_frame TEXT NOT NULL DEFAULT 'mobile',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 5. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS resources_owner_timestamp_idx
    ON public.resources (owner_id, timestamp_ms DESC);

CREATE INDEX IF NOT EXISTS resources_owner_saved_idx
    ON public.resources (owner_id, is_saved_to_library);

CREATE INDEX IF NOT EXISTS resources_owner_archived_idx
    ON public.resources (owner_id, is_archived);

CREATE INDEX IF NOT EXISTS action_records_owner_resource_idx
    ON public.action_records (
        owner_id, screenshot_id, executed_at_ms DESC
    );

CREATE INDEX IF NOT EXISTS reminders_owner_schedule_idx
    ON public.reminders (owner_id, scheduled_at);

CREATE INDEX IF NOT EXISTS reminders_owner_status_idx
    ON public.reminders (owner_id, status);


-- ============================================================
-- 6. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS resources_set_updated_at
    ON public.resources;

CREATE TRIGGER resources_set_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS action_records_set_updated_at
    ON public.action_records;

CREATE TRIGGER action_records_set_updated_at
    BEFORE UPDATE ON public.action_records
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS reminders_set_updated_at
    ON public.reminders;

CREATE TRIGGER reminders_set_updated_at
    BEFORE UPDATE ON public.reminders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS user_settings_set_updated_at
    ON public.user_settings;

CREATE TRIGGER user_settings_set_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;


-- Remove anonymous table privileges explicitly.
REVOKE ALL ON TABLE
    public.resources,
    public.action_records,
    public.reminders,
    public.user_settings
FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
    public.resources,
    public.action_records,
    public.reminders,
    public.user_settings
TO authenticated;


-- ============================================================
-- 8. RESOURCES POLICIES
-- ============================================================

DROP POLICY IF EXISTS resources_select_own
    ON public.resources;
CREATE POLICY resources_select_own
    ON public.resources FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS resources_insert_own
    ON public.resources;
CREATE POLICY resources_insert_own
    ON public.resources FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS resources_update_own
    ON public.resources;
CREATE POLICY resources_update_own
    ON public.resources FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = owner_id)
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS resources_delete_own
    ON public.resources;
CREATE POLICY resources_delete_own
    ON public.resources FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = owner_id);


-- ============================================================
-- 9. ACTION RECORDS POLICIES
-- ============================================================

DROP POLICY IF EXISTS action_records_select_own
    ON public.action_records;
CREATE POLICY action_records_select_own
    ON public.action_records FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS action_records_insert_own
    ON public.action_records;
CREATE POLICY action_records_insert_own
    ON public.action_records FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS action_records_update_own
    ON public.action_records;
CREATE POLICY action_records_update_own
    ON public.action_records FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = owner_id)
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS action_records_delete_own
    ON public.action_records;
CREATE POLICY action_records_delete_own
    ON public.action_records FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = owner_id);


-- ============================================================
-- 10. REMINDERS POLICIES
-- ============================================================

DROP POLICY IF EXISTS reminders_select_own
    ON public.reminders;
CREATE POLICY reminders_select_own
    ON public.reminders FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS reminders_insert_own
    ON public.reminders;
CREATE POLICY reminders_insert_own
    ON public.reminders FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS reminders_update_own
    ON public.reminders;
CREATE POLICY reminders_update_own
    ON public.reminders FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = owner_id)
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS reminders_delete_own
    ON public.reminders;
CREATE POLICY reminders_delete_own
    ON public.reminders FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = owner_id);


-- ============================================================
-- 11. USER SETTINGS POLICIES
-- ============================================================

DROP POLICY IF EXISTS user_settings_select_own
    ON public.user_settings;
CREATE POLICY user_settings_select_own
    ON public.user_settings FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS user_settings_insert_own
    ON public.user_settings;
CREATE POLICY user_settings_insert_own
    ON public.user_settings FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS user_settings_update_own
    ON public.user_settings;
CREATE POLICY user_settings_update_own
    ON public.user_settings FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = owner_id)
    WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS user_settings_delete_own
    ON public.user_settings;
CREATE POLICY user_settings_delete_own
    ON public.user_settings FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = owner_id);
