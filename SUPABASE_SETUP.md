# Supabase Setup for Self-Deletion

To allow users to delete their own accounts directly from the client (without sending an email), you need to create a secure PostgreSQL function in your Supabase project.

### Instructions

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Copy and paste the following SQL code:

```sql
-- Create a secure function that allows users to delete their own account
create or replace function delete_own_account()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete the user from auth.users (this cascades to other tables if set up)
  delete from auth.users where id = auth.uid();
end;
$$;
```

4. Click **Run**.

Once this function is created, the "Delete Account" button in your Dashboard will work immediately!
