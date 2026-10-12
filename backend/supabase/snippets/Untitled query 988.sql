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