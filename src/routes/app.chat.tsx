import { createFileRoute } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "Chat with Kupa" },
      {
        name: "description",
        content:
          "Talk it through with Kupa — a calm AI companion for everyday money worries, built for students and gig workers.",
      },
      { property: "og:title", content: "Chat with Kupa" },
      {
        property: "og:description",
        content: "A kind, practical money chat. No judgement, no jargon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const starters = [
  "I overspent this week and feel guilty",
  "Help me build a small budget for the break",
  "What's one tiny money win I can do today?",
  "I get anxious whenever I open my bank app",
];

type ChatMessage = { _id: string; role: string; content: string };
type ChatItem = { _id: string; title: string };

function TypingDots() {
  const dots = [0, 0.12, 0.24];
  return (
    <span className="flex items-center gap-1 px-1 py-1" aria-label="Kupa is typing">
      {dots.map((delay, i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-plum/50"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay }}
        />
      ))}
    </span>
  );
}

function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const chats = useQuery(api.chats.list) as ChatItem[] | undefined;
  const messages = useQuery(
    api.messages.list,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  ) as ChatMessage[] | undefined;
  const sendMessage = useAction(api.chat.send);
  const createChat = useMutation(api.chats.create);
  const renameChat = useMutation(api.chats.rename);
  const removeChat = useMutation(api.chats.remove);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const endedRef = useRef<HTMLDivElement | null>(null);
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  const hasChats = chats !== undefined && chats.length > 0;
  const noChatsYet = chats !== undefined && chats.length === 0;

  useEffect(() => {
    if (hasChats && !chats.some((c) => c._id === selectedChatId)) {
      const first = chats[0];
      if (first) {
        setSelectedChatId(first._id);
      }
    }
  }, [chats, hasChats, selectedChatId]);

  useEffect(() => {
    if (renamingId) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renamingId]);

  useEffect(() => {
    endedRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const selectedChat = chats?.find((c) => c._id === selectedChatId) ?? null;
  const all: ChatMessage[] = messages ?? [];
  const lastMessage = all[all.length - 1];
  const showPending =
    pending !== null && pending !== (lastMessage?.content ?? null) && selectedChatId !== null;

  const handleNewChat = async () => {
    try {
      const id = await createChat({});
      setSelectedChatId(id);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't start a new chat just now.");
    }
  };

  const startRename = (chat: ChatItem) => {
    if (confirmingDelete === chat._id) {
      setConfirmingDelete(null);
    }
    setRenamingId(chat._id);
    setRenameValue(chat.title === "New chat" ? "" : chat.title);
  };

  const commitRename = async (chatId: string) => {
    const title = renameValue.trim();
    setRenamingId(null);
    if (!title) return;
    try {
      await renameChat({ chatId, title });
    } catch (error) {
      console.error(error);
      toast.error("Couldn't rename that chat.");
    }
  };

  const handleDelete = async (chatId: string) => {
    try {
      await removeChat({ chatId });
      if (selectedChatId === chatId) {
        const rest = (chats ?? []).filter((c) => c._id !== chatId);
        setSelectedChatId(rest[0]?._id ?? null);
      }
      setConfirmingDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete that chat.");
    }
  };

  const submit = async (text: string) => {
    if (!selectedChatId) return;
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setDraft("");
    setPending(trimmed);
    try {
      await sendMessage({ chatId: selectedChatId, message: trimmed });
      if (selectedChat?.title === "New chat") {
        await renameChat({
          chatId: selectedChatId,
          title: trimmed.slice(0, 40),
        });
      }
    } catch (error) {
      console.error(error);
      setDraft(trimmed);
      toast.error("Kupa couldn't reply just now. Please try again.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="Chat with Kupa"
        subtitle="Talk it out — money feels lighter with company."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card flex flex-col overflow-hidden rounded-[2rem] md:flex-row md:h-[calc(100vh-18rem)] md:min-h-[28rem]"
      >
        <aside className="flex w-full shrink-0 flex-col border-b border-border/60 md:w-72 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <button
              onClick={handleNewChat}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="size-4" />
              New chat
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {noChatsYet ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No chats yet. Start your first conversation with Kupa.
              </p>
            ) : (
              <ul className="space-y-1">
                {chats?.map((chat) => {
                  const active = chat._id === selectedChatId;
                  const renaming = renamingId === chat._id;
                  const confirming = confirmingDelete === chat._id;
                  return (
                    <li key={chat._id}>
                      {confirming ? (
                        <div className="flex items-center gap-1 rounded-xl bg-secondary px-2 py-1.5 text-xs text-muted-foreground">
                          <span className="min-w-0 flex-1 truncate">Delete “{chat.title}”?</span>
                          <button
                            onClick={() => handleDelete(chat._id)}
                            className="grid size-6 shrink-0 place-items-center rounded-lg text-red-500 transition-colors hover:bg-red-500/10"
                            aria-label="Confirm delete"
                          >
                            <Check className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmingDelete(null)}
                            className="grid size-6 shrink-0 place-items-center rounded-lg transition-colors hover:bg-border/60"
                            aria-label="Cancel delete"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : renaming ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            commitRename(chat._id);
                          }}
                          className="flex items-center gap-1 rounded-xl bg-secondary px-2 py-1.5"
                        >
                          <Input
                            ref={renameInputRef}
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => commitRename(chat._id)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.preventDefault();
                                setRenamingId(null);
                              }
                            }}
                            maxLength={48}
                            className="h-7 min-w-0 flex-1 rounded-lg bg-background px-2 text-xs"
                            aria-label="Chat name"
                          />
                          <button
                            type="submit"
                            className="grid size-6 shrink-0 place-items-center rounded-lg text-primary transition-colors hover:bg-border/60"
                            aria-label="Save name"
                          >
                            <Check className="size-3.5" />
                          </button>
                        </form>
                      ) : (
                        <div
                          className={`group flex items-center gap-1 rounded-xl px-2 py-2 transition-colors ${
                            active ? "bg-secondary" : "hover:bg-secondary/60"
                          }`}
                        >
                          <button
                            onClick={() => setSelectedChatId(chat._id)}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                            <span
                              className={`truncate text-sm ${
                                active ? "font-medium text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {chat.title}
                            </span>
                          </button>
                          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => startRename(chat)}
                              className="grid size-6 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-border/60 hover:text-foreground"
                              aria-label={`Rename ${chat.title}`}
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button
                              onClick={() => setConfirmingDelete(chat._id)}
                              className="grid size-6 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                              aria-label={`Delete ${chat.title}`}
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <section className="flex min-h-[24rem] flex-1 flex-col md:min-h-0">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
            <span className="grid size-11 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Bot className="size-5 text-primary-foreground" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight tracking-tight">
                {selectedChatId ? (selectedChat?.title ?? "Loading…") : "Chat with Kupa"}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-primary" />
                Online — gentle guidance, not financial advice
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {selectedChatId === null ? (
              <motion.div
                key="no-chat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto flex max-w-xl flex-col items-center pt-10 text-center"
              >
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="grid size-16 place-items-center rounded-[1.5rem] bg-gradient-primary shadow-glow"
                >
                  <MessageSquare className="size-7 text-primary-foreground" />
                </motion.span>
                <h2 className="mt-5 font-display text-2xl tracking-tight">No chat open</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start a new chat or pick one from the list to keep the conversation going.
                </p>
                <Button variant="hero" className="mt-6 rounded-full" onClick={handleNewChat}>
                  <Plus className="size-4" />
                  Start a new chat
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages === undefined ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className={`h-12 w-2/3 animate-pulse rounded-3xl bg-secondary/70 ${
                          i === 0 ? "rounded-bl-lg" : "ml-auto rounded-br-lg"
                        }`}
                      />
                    ))}
                    <div className="flex items-end gap-2">
                      <span className="grid size-8 place-items-center rounded-xl bg-gradient-primary">
                        <Sparkles className="size-4 text-primary-foreground" />
                      </span>
                      <div className="rounded-3xl rounded-bl-lg bg-secondary/70 px-4 py-3">
                        <TypingDots />
                      </div>
                    </div>
                  </motion.div>
                ) : all.length === 0 && !pending ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto flex max-w-xl flex-col items-center pt-8 text-center"
                  >
                    <motion.span
                      animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="grid size-16 place-items-center rounded-[1.5rem] bg-gradient-primary shadow-glow"
                    >
                      <Sparkles className="size-7 text-primary-foreground" />
                    </motion.span>
                    <h2 className="mt-5 font-display text-2xl tracking-tight">Hey, I'm Kupa</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Money stress is heavy to carry alone. Tell me what's on your mind — even just
                      "today was hard" is a great place to start.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {starters.map((s, i) => (
                        <motion.button
                          key={s}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          onClick={() => submit(s)}
                          disabled={pending !== null}
                          className="rounded-full border border-blush/60 bg-secondary/60 px-4 py-2 text-xs font-medium text-plum transition-all hover:-translate-y-0.5 hover:bg-secondary"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="thread"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {all.map((m) => (
                      <div
                        key={m._id}
                        className={`flex items-end gap-2 ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {m.role !== "user" && (
                          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-primary">
                            <Sparkles className="size-4 text-primary-foreground" />
                          </span>
                        )}
                        <div
                          className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 text-sm ${
                            m.role === "user"
                              ? "bg-gradient-primary text-primary-foreground rounded-br-lg"
                              : "bg-secondary/70 rounded-bl-lg"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}

                    {showPending && (
                      <motion.div
                        key="pending-user"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end justify-end gap-2"
                      >
                        <div className="max-w-[80%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-gradient-primary px-4 py-2.5 text-sm text-primary-foreground">
                          {pending}
                        </div>
                      </motion.div>
                    )}

                    {pending !== null && (
                      <motion.div
                        key="pending-kupa"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end gap-2"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-primary">
                          <Sparkles className="size-4 text-primary-foreground" />
                        </span>
                        <div className="rounded-3xl rounded-bl-lg bg-secondary/70 px-4 py-3">
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}

                    <div ref={endedRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(draft);
            }}
            className="flex items-center gap-2 border-t border-border/60 px-5 py-4"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={selectedChatId ? "Message Kupa…" : "Start a chat to message Kupa"}
              aria-label="Message Kupa"
              disabled={pending !== null || selectedChatId === null}
              className="h-12 rounded-full border-input bg-secondary/50 px-5"
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              aria-label={pending ? "Waiting for Kupa" : "Send message"}
              disabled={!draft.trim() || pending !== null || selectedChatId === null}
              className="size-12 shrink-0 rounded-2xl"
            >
              {pending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </Button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
