'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";

import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'


// Generic Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...props }: any) => (
  <button
    {...props}
    className={`border px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${props.className || ""}`}
  >
    {children}
  </button>
);

// Card components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-2xl ${className}`}>{children}</div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Availability types
interface DayAvailability {
  start: string;
  end: string;
  available: boolean;
}

export default function AvailabilityPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const socketRef = useRef<Socket | null>(null);
  const roomIdRef = useRef<string>("availability-default");
  const currentUserNameRef = useRef<string>("Unknown User");
  const currentUserEmailRef = useRef<string>("");

  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
    days.reduce((acc, day) => {
      acc[day] = { start: "09:00", end: "17:00", available: true };
      return acc;
    }, {} as Record<string, DayAvailability>)
  );

  const [groupAvailability] = useState<Record<string, number>>({
    Monday: 4,
    Tuesday: 6,
    Wednesday: 5,
    Thursday: 7,
    Friday: 3,
    Saturday: 2,
    Sunday: 1,
  });

  const handleChange = (day: string, field: keyof DayAvailability, value: any) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };


  //availability submitting
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting availability:", availability);
    alert("Availability submitted!");
  };

  //message states thing
  type ChatMessage = { id: string; text: string; isOutgoing: boolean; senderName: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageValue, setMessageValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadIdentityFromCookie = async () => {
    const meResponse = await fetch("/api/auth/me");
    if (!meResponse.ok) {
      return false;
    }

    const mePayload = await meResponse.json();
    const email = typeof mePayload?.user?.email === "string" ? mePayload.user.email.trim() : "";
    const name = typeof mePayload?.user?.name === "string" ? mePayload.user.name.trim() : "";

    if (!email || !name) {
      return false;
    }

    currentUserEmailRef.current = email;
    currentUserNameRef.current = name;
    return true;
  };

  //message submitting
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageValue.trim();

    if (!text) {
      return;
    }

    if (!currentUserEmailRef.current || !currentUserNameRef.current || currentUserNameRef.current === "Unknown User") {
      const identityReady = await loadIdentityFromCookie();
      if (!identityReady) {
        console.warn("Unable to resolve logged-in user from cookies.");
        // Allow users to chat even without auth cookies; persistence may fail.
        currentUserNameRef.current = "Anonymous";
      }
    }

    const localId = `local-${Date.now()}`;
    setMessages((prev) => [...prev, { id: localId, text, isOutgoing: true, senderName: currentUserNameRef.current }]);
    setMessageValue('');

    socketRef.current?.emit("chat message", {
      text,
      senderName: currentUserNameRef.current,
    });

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          roomId: roomIdRef.current,
          email: currentUserEmailRef.current,
        }),
      });

      if (!response.ok) {
        console.warn("Message was sent live but could not be saved.");
      }
    } catch (error) {
      console.warn("Message was sent live but could not be persisted.", error);
    }
  };

  // Load stored messages once.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      roomIdRef.current = url.searchParams.get("room")?.trim() || url.pathname;
    }

    const loadMessages = async () => {
      try {
        await loadIdentityFromCookie();

        const params = new URLSearchParams({ roomId: roomIdRef.current });
        const response = await fetch(`/api/messages?${params.toString()}`);
        if (!response.ok) {
          console.warn("Messages are temporarily unavailable.");
          return;
        }

        const payload = await response.json();
        const loadedMessages = Array.isArray(payload?.messages)
          ? payload.messages.map((msg: { id: string; content: string; sender?: string; sender_name?: string }) => ({
            id: msg.id,
            text: msg.content,
            isOutgoing: false,
            senderName: msg.sender ?? msg.sender_name ?? "Unknown User",
          }))
          : [];

        setMessages(loadedMessages);
      } catch (error) {
        console.warn("Unable to load messages right now.", error);
      }
    };

    void loadMessages();
  }, []);

  // Socket channel for live relay between users.
  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      query: {
        roomId: roomIdRef.current,
      },
    });

    socketRef.current.on("chat message", (payload: { id?: string; text: string; senderName?: string } | string) => {
      const text = typeof payload === "string" ? payload : payload.text;
      const id = typeof payload === "string" ? `remote-${Date.now()}` : payload.id ?? `remote-${Date.now()}`;
      const senderName = typeof payload === "string" ? "Unknown User" : payload.senderName ?? "Unknown User";
      setMessages((prev) => [...prev, { id, text, isOutgoing: false, senderName }]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Keep scroll at bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full overflow-auto"
      >
        <ResizablePanel defaultSize={25} >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={75}>
              <motion.div
                className="max-w-xl mx-auto mt-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >

                <Card>
                  <CardContent className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                      Set Your Weekly Availability
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {days.map((day) => (
                        <div
                          key={day}
                          className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"
                        >
                          <span className="w-24 font-medium">{day}</span>
                          {availability[day].available ? (
                            <>
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={availability[day].start}
                                  onChange={(e) => handleChange(day, "start", e.target.value)}
                                  className="border rounded-md px-2 py-1 text-sm"
                                />
                                <span>-</span>
                                <input
                                  type="time"
                                  value={availability[day].end}
                                  onChange={(e) => handleChange(day, "end", e.target.value)}
                                  className="border rounded-md px-2 py-1 text-sm"
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={() => handleChange(day, "available", false)}
                                className="text-xs"
                              >
                                Mark Unavailable
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => handleChange(day, "available", true)}
                              className="text-xs"
                            >
                              Set Available
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button type="submit" className="w-full mt-4">
                        Submit Availability
                      </Button>
                    </form>

                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-semibold mb-2">Group Availability (Example)</h3>
                      <ul className="text-sm space-y-1">
                        {days.map((day) => (
                          <li key={day}>
                            <span className="font-medium">{day}:</span>{" "}
                            {groupAvailability[day]} people available
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={25} maxSize={50}>
              <div className="flex min-w-0 flex-col h-full bg-main p-6">
                <div className="font-base flex min-w-0 flex-col h-full">
                  <ScrollArea className="rounded-base min-w-0 flex-1 mt-5 mb-4 items-center text-main-foreground border-2 border-border bg-white p-4 shadow-shadow">
                    <div className="min-w-0 w-full overflow-x-hidden">
                      <ul id="messages" className="min-w-0 w-full space-y-2 mb-4 px-2 py-1">
                        {messages.map((msg) => (
                          <li
                            key={msg.id}
                            className={`border-2 border-border w-full max-w-full break-words [overflow-wrap:anywhere] whitespace-pre-wrap p-2 rounded p-4 shadow-shadow ${msg.isOutgoing ? 'bg-sky-200 border-sky-400' : 'bg-slate-100 border-slate-300'
                              }`}
                          >
                            <p className="text-xs font-semibold mb-1 opacity-80">{msg.isOutgoing ? "You" : msg.senderName}</p>
                            {msg.text}
                          </li>
                        ))}
                        <div ref={messagesEndRef} />
                      </ul>
                    </div>
                  </ScrollArea>
                  <div className="flex-shrink-0">
                    <form onSubmit={handleMessageSubmit} id="form" action="" className="flex gap-2 mb-4">
                      <Input
                        id="input"
                        className="flex-1 p-4 shadow-shadow"
                        type="text"
                        placeholder="Enter Your Message..."
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                          }
                        }}
                      />
                      <Button className="border-2 border-border text-white bg-sky-400/90 p-4 shadow-shadow" type="submit">
                        Send
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}