"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

// Helper untuk membersihkan URL
const getSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

const SOCKET_URL = getSocketUrl();

export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  sender: {
    fullName: string;
    profilePicture: string | null;
  };
}

export interface Conversation {
  id: string;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  participants: {
    user: {
      id: string;
      fullName: string;
      profilePicture: string | null;
    };
  }[];
}

interface RecipientData {
  id: string;
  fullName: string;
  profilePicture: string | null;
}

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;

  isInboxOpen: boolean;
  toggleInbox: () => void;
  openInbox: () => void;

  activeConversation: Conversation | null;
  closeChatWindow: () => void;

  conversations: Conversation[];
  messages: Message[];
  unreadCount: number;

  openChatWith: (
    recipient: RecipientData,
    initialMessage?: string
  ) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  refreshConversations: () => Promise<Conversation[]>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [messagesCache, setMessagesCache] = useState<Record<string, Message[]>>(
    {}
  );

  const activeConversationRef = useRef(activeConversation);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // 1. Setup Socket
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setMessagesCache({});
      }
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket Connected");
      setIsConnected(true);

      // Re-fetch jika sedang membuka chat
      if (
        activeConversationRef.current &&
        activeConversationRef.current.id !== "new"
      ) {
        newSocket.emit("getHistory", activeConversationRef.current.id);
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listener: Pesan Masuk (Real-time)
    newSocket.on("newMessage", (message: Message) => {
      const chatId = message.conversationId;

      setMessagesCache((prevCache) => {
        const currentMessages = prevCache[chatId] || [];

        if (currentMessages.some((m) => m.id === message.id)) return prevCache;

        // Hapus pesan optimistic yang cocok
        const filtered = currentMessages.filter(
          (m) => !(m.id.startsWith("temp-") && m.content === message.content)
        );

        return {
          ...prevCache,
          [chatId]: [...filtered, message],
        };
      });

      if (activeConversationRef.current?.id !== chatId) {
        fetchConversations();
      }
    });

    // Listener: History (PERBAIKAN DUPLIKASI DI SINI)
    newSocket.on("messageHistory", (history: Message[]) => {
      if (!history || history.length === 0) return;

      const chatId = history[0].conversationId;

      setMessagesCache((prevCache) => {
        const currentMessages = prevCache[chatId] || [];

        // 1. Ambil pesan yang masih berstatus 'pending' (temp-)
        let pendingMessages = currentMessages.filter((m) =>
          m.id.startsWith("temp-")
        );

        // 2. FILTER PENTING: Buang pesan pending yang SUDAH ADA di history server
        // Ini mencegah duplikasi saat reload/reopen chat
        pendingMessages = pendingMessages.filter((tempMsg) => {
          const existsInHistory = history.some(
            (histMsg) =>
              histMsg.content === tempMsg.content &&
              histMsg.senderId === tempMsg.senderId
          );
          return !existsInHistory; // Keep only if NOT in history
        });

        // 3. Gabung dan urutkan
        const combined = [...history, ...pendingMessages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // 4. Deduplikasi final by ID (Safety net)
        const uniqueMessages = Array.from(
          new Map(combined.map((m) => [m.id, m])).values()
        );

        return {
          ...prevCache,
          [chatId]: uniqueMessages,
        };
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // 2. Fetch Inbox
  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return [];
      const res = await fetch("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
        return data.data as Conversation[];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch conversations", error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchConversations();
  }, [isAuthenticated, fetchConversations]);

  // --- ACTIONS ---

  const toggleInbox = () => {
    if (!isInboxOpen) fetchConversations();
    setIsInboxOpen(!isInboxOpen);
  };

  const openInbox = () => {
    setIsInboxOpen(true);
    fetchConversations();
  };

  const closeChatWindow = () => {
    setActiveConversation(null);
  };

  const openChatWith = async (
    recipient: RecipientData,
    initialMessage?: string
  ) => {
    if (!user) return;
    setIsInboxOpen(false);

    let existing = conversations.find((c) =>
      c.participants.some((p) => p.user.id === recipient.id)
    );

    if (!existing) {
      const freshConversations = await fetchConversations();
      existing = freshConversations.find((c) =>
        c.participants.some((p) => p.user.id === recipient.id)
      );
    }

    if (existing) {
      setActiveConversation(existing);

      // Selalu minta history terbaru saat membuka chat
      if (socket && socket.connected) {
        socket.emit("getHistory", existing.id);
      }
    } else {
      setMessagesCache((prev) => ({ ...prev, new: [] }));
      const draftConversation: Conversation = {
        id: "new",
        participants: [
          { user: { ...recipient } },
          {
            user: {
              id: user.id,
              fullName: user.fullName,
              profilePicture: user.profilePicture,
            },
          },
        ],
      };
      setActiveConversation(draftConversation);

      if (initialMessage) {
        setTimeout(() => sendMessage(initialMessage), 100);
      }
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeConversation || !user) return;

    const chatId = activeConversation.id;
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const optimisticMsg: Message = {
      id: tempId,
      content,
      senderId: user.id,
      conversationId: chatId,
      createdAt: new Date().toISOString(),
      sender: {
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    };

    setMessagesCache((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), optimisticMsg],
    }));

    try {
      const recipient = activeConversation.participants.find(
        (p) => p.user.id !== user.id
      )?.user;
      if (!recipient) throw new Error("Recipient not found");

      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: recipient.id,
          initialMessage: content,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const realConvId = data.data.id;

        if (activeConversation.id === "new") {
          await fetchConversations();

          // Migrasi pesan dari 'new' ke ID asli
          setMessagesCache((prev) => {
            const draftMsgs = prev["new"] || [];
            const migratedMsgs = draftMsgs.map((m) => ({
              ...m,
              conversationId: realConvId,
            }));
            const newState = { ...prev };
            delete newState["new"];
            newState[realConvId] = [
              ...(prev[realConvId] || []),
              ...migratedMsgs,
            ];
            return newState;
          });

          setActiveConversation((prev) =>
            prev ? { ...prev, id: realConvId } : null
          );

          // Panggil history untuk memastikan sinkronisasi
          if (socket) socket.emit("getHistory", realConvId);
        }
      } else {
        throw new Error(data.error || "Failed to send");
      }
    } catch (error) {
      console.error("Gagal mengirim pesan", error);
      setMessagesCache((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).filter((m) => m.id !== tempId),
      }));
    }
  };

  const activeMessages = activeConversation
    ? messagesCache[activeConversation.id] || []
    : [];

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        isInboxOpen,
        toggleInbox,
        openInbox,
        activeConversation,
        closeChatWindow,
        conversations,
        messages: activeMessages,
        unreadCount,
        openChatWith,
        sendMessage,
        refreshConversations: fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
