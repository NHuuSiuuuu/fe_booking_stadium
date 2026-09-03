export type SenderRole = "user" | "admin";

export type Conversation = {
  id: number;
  user_id: number;
  stadium_id: number | null;
  status: "open" | "closed";
  last_message: string | null;
  last_message_at: string | null;
  user_unread_count: number;
  admin_unread_count: number;
  created_at: string;
  updated_at: string;
  user_fullname?: string | null;
  user_email?: string | null;
  user_phone?: string | null;
  stadium_name?: string | null;
  stadium_slug?: string | null;
};

export type ChatMessage = {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_role: SenderRole;
  content: string;
  read_at: string | null;
  created_at: string;
};
