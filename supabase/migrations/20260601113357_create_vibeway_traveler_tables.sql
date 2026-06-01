/*
  # vibeway traveler tables

  1. New Tables
    - `traveler_profiles`
      - `id` (uuid, PK, links to auth.users)
      - `username` (text, unique)
      - `avatar_color` (text, gradient class or hex)
      - `mood_status` (text, editable status text)
      - `visibility` (text enum: public | enigma | off)
      - `transport_mode` (text: bus | metro | train | tram | ferry | car)
      - `current_route` (text, optional route label)
      - `lat` (float8, simulated latitude)
      - `lng` (float8, simulated longitude)
      - `last_seen` (timestamptz)
      - `created_at` (timestamptz)

    - `private_messages`
      - `id` (uuid, PK)
      - `sender_id` (uuid, FK → traveler_profiles)
      - `receiver_id` (uuid, FK → traveler_profiles)
      - `content` (text)
      - `created_at` (timestamptz)
      - `read` (bool)

    - `group_rooms`
      - `id` (uuid, PK)
      - `route_key` (text, unique label for this route/room)
      - `transport_mode` (text)
      - `created_at` (timestamptz)

    - `group_messages`
      - `id` (uuid, PK)
      - `room_id` (uuid, FK → group_rooms)
      - `sender_id` (uuid, FK → traveler_profiles)
      - `content` (text)
      - `is_sos` (bool, default false)
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Authenticated users can read public traveler profiles
    - Users can only update/delete their own profile
    - Users can read/send messages they are part of
*/

-- traveler_profiles
CREATE TABLE IF NOT EXISTS traveler_profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       text UNIQUE NOT NULL,
  avatar_color   text NOT NULL DEFAULT 'from-amber-500 to-orange-600',
  mood_status    text NOT NULL DEFAULT 'En camino...',
  visibility     text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','enigma','off')),
  transport_mode text NOT NULL DEFAULT 'bus',
  current_route  text,
  lat            float8,
  lng            float8,
  last_seen      timestamptz DEFAULT now(),
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE traveler_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are visible to authenticated users"
  ON traveler_profiles FOR SELECT
  TO authenticated
  USING (visibility IN ('public','enigma'));

CREATE POLICY "Users can insert own profile"
  ON traveler_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON traveler_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- private_messages
CREATE TABLE IF NOT EXISTS private_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   uuid NOT NULL REFERENCES traveler_profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES traveler_profiles(id) ON DELETE CASCADE,
  content     text NOT NULL,
  read        bool NOT NULL DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own private messages"
  ON private_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send private messages"
  ON private_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark messages as read"
  ON private_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- group_rooms
CREATE TABLE IF NOT EXISTS group_rooms (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_key      text UNIQUE NOT NULL,
  transport_mode text NOT NULL DEFAULT 'bus',
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE group_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view group rooms"
  ON group_rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create group rooms"
  ON group_rooms FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- group_messages
CREATE TABLE IF NOT EXISTS group_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    uuid NOT NULL REFERENCES group_rooms(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES traveler_profiles(id) ON DELETE CASCADE,
  content    text NOT NULL,
  is_sos     bool NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view group messages"
  ON group_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can send group messages"
  ON group_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_private_messages_sender    ON private_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_private_messages_receiver  ON private_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_room        ON group_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_traveler_last_seen         ON traveler_profiles(last_seen);
