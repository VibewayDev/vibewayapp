/*
  # Fix group_rooms INSERT policy — replace always-true WITH CHECK

  ## Problem
  The policy "Authenticated users can create group rooms" used WITH CHECK (true),
  allowing any authenticated user to insert a row with any created_by value,
  including rows owned by other users.

  ## Changes
  1. Tables modified
     - `group_rooms`: add `created_by uuid references auth.users(id)` if missing
  2. Security
     - DROP insecure INSERT policy (WITH CHECK always true)
     - CREATE new INSERT policy that enforces auth.uid() = created_by
       so users can only create rooms attributed to themselves
*/

-- 1. Ensure created_by column exists and references auth.users
ALTER TABLE public.group_rooms
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- 2. Drop the insecure policy
DROP POLICY IF EXISTS "Authenticated users can create group rooms" ON public.group_rooms;

-- 3. Create the scoped policy
CREATE POLICY "Users create own group rooms"
  ON public.group_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
