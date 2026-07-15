-- Sets super_admin role for the specified email
-- Run: psql -d $DATABASE_URL -f this_file.sql
-- Or paste into Supabase SQL Editor
UPDATE sadean.users SET role = 'super_admin' WHERE email = 'daniadhisaputro@gmail.com';
