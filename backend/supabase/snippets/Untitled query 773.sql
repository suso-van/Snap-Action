SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'resources',
    'action_records',
    'reminders',
    'user_settings'
  )
ORDER BY table_name;
SELECT
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'resources',
    'action_records',
    'reminders',
    'user_settings'
  )
ORDER BY tablename, policyname;