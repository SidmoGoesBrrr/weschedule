"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// --- UI primitives ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => (
  <button
    className={
      "bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

// --- Types ---

type TimeBlock = { start: string; end: string };
type DayAvailability = { available: boolean; blocks: TimeBlock[] };

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
type Day = (typeof DAYS)[number];

type UserRecord = { userId: string; availability: Record<Day, DayAvailability>; createdAt?: string };

// --- Helpers ---

function minutesFromHHMM(t: string): number {
  const [hh, mm] = t.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return NaN;
  return hh * 60 + mm;
}

function toHHMM(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function defaultDay(): DayAvailability {
  return { available: false, blocks: [] };
}

function makeDefaultAvailability(): Record<Day, DayAvailability> {
  return DAYS.reduce((acc, day) => {
    acc[day] = defaultDay();
    return acc;
  }, {} as Record<Day, DayAvailability>);
}

function normalizeIncoming(input: unknown): Record<Day, DayAvailability> {
  const defaults = makeDefaultAvailability();
  if (!input || typeof input !== "object") return defaults;
  const raw = input as Record<string, unknown>;
  const next = { ...defaults };

  for (const day of DAYS) {
    const d = raw[day] as any;
    if (!d) continue;

    if (Array.isArray(d.blocks)) {
      next[day] = {
        available: Boolean(d.available),
        blocks: d.blocks
          .filter((b: any) => b && typeof b.start === "string" && typeof b.end === "string")
          .map((b: any) => ({ start: b.start, end: b.end })),
      };
    } else if (typeof d.start === "string" && typeof d.end === "string") {
      next[day] = {
        available: Boolean(d.available),
        blocks: [{ start: d.start, end: d.end }],
      };
    }
  }

  return next;
}

// --- Grid constants ---

const SLOT_MIN = 30;
const HEAT_START = 7 * 60;  // 7 AM
const HEAT_END = 22 * 60;   // 10 PM
const SLOTS = Array.from(
  { length: (HEAT_END - HEAT_START) / SLOT_MIN },
  (_, i) => HEAT_START + i * SLOT_MIN
);

const SLOT_HEIGHT = 20;
const COLUMN_WIDTH = 72;
const LABEL_WIDTH = 56;

// --- Grid helpers ---

function slotsToBlocks(slots: Set<number>): TimeBlock[] {
  if (slots.size === 0) return [];
  const sorted = [...slots].sort((a, b) => a - b);
  const blocks: TimeBlock[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + SLOT_MIN) {
      prev = sorted[i];
    } else {
      blocks.push({ start: toHHMM(start), end: toHHMM(prev + SLOT_MIN) });
      start = sorted[i];
      prev = sorted[i];
    }
  }
  blocks.push({ start: toHHMM(start), end: toHHMM(prev + SLOT_MIN) });
  return blocks;
}

function blocksToSlots(blocks: TimeBlock[]): Set<number> {
  const out = new Set<number>();
  for (const b of blocks) {
    const s = minutesFromHHMM(b.start);
    const e = minutesFromHHMM(b.end);
    if (!Number.isFinite(s) || !Number.isFinite(e)) continue;
    for (let m = s; m < e; m += SLOT_MIN) out.add(m);
  }
  return out;
}

function filledSlots(blocks: TimeBlock[]): Set<number> {
  return blocksToSlots(blocks);
}

function formatSlotTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return min === 0 ? `${h12}:00 ${ampm}` : `${h12}:30`;
}

// --- SingleDayGrid (user's own availability) ---

interface SingleDayGridProps {
  day: Day;
  availability: Record<Day, DayAvailability>;
  onChange: (next: Record<Day, DayAvailability>) => void;
  disabled?: boolean;
}

function SingleDayGrid({ day, availability, onChange, disabled = false }: SingleDayGridProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<number>>(() =>
    availability[day].available ? blocksToSlots(availability[day].blocks) : new Set()
  );

  const prevRef = useRef<{ day: Day; availability: Record<Day, DayAvailability> }>({
    day,
    availability,
  });
  useEffect(() => {
    if (prevRef.current.day === day && prevRef.current.availability === availability) return;
    prevRef.current = { day, availability };
    setSelectedSlots(
      availability[day].available ? blocksToSlots(availability[day].blocks) : new Set()
    );
  }, [day, availability]);

  const dragState = useRef<{
    active: boolean;
    adding: boolean;
    touched: Set<number>;
  } | null>(null);

  function commitSlots(next: Set<number>) {
    setSelectedSlots(next);
    const blocks = slotsToBlocks(next);
    onChange({
      ...availability,
      [day]: {
        available: next.size > 0,
        blocks,
      },
    });
  }

  function handleSlotMouseDown(slot: number) {
    if (disabled) return;
    const current = new Set(selectedSlots);
    const adding = !current.has(slot);
    if (adding) current.add(slot);
    else current.delete(slot);
    dragState.current = { active: true, adding, touched: new Set([slot]) };
    commitSlots(current);
  }

  function handleSlotMouseEnter(slot: number) {
    if (!dragState.current?.active || disabled) return;
    if (dragState.current.touched.has(slot)) return;
    dragState.current.touched.add(slot);
    const current = new Set(selectedSlots);
    if (dragState.current.adding) current.add(slot);
    else current.delete(slot);
    commitSlots(current);
  }

  function handleMouseUp() {
    if (dragState.current) dragState.current.active = false;
  }

  return (
    <div
      className="select-none flex"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Time labels */}
      <div className="flex flex-col" style={{ width: LABEL_WIDTH, flexShrink: 0 }}>
        {SLOTS.map((slot) => (
          <div key={slot} style={{ height: SLOT_HEIGHT, position: "relative" }}>
            {slot % 60 === 0 && (
              <span
                className="absolute text-xs text-gray-400 leading-none"
                style={{ top: -7, right: 6, whiteSpace: "nowrap" }}
              >
                {formatSlotTime(slot)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Single column */}
      <div className="flex flex-col border-l border-gray-300" style={{ width: COLUMN_WIDTH }}>
        {SLOTS.map((slot) => {
          const isSelected = selectedSlots.has(slot);
          const isHourBoundary = slot % 60 === 0;
          return (
            <div
              key={slot}
              onMouseDown={() => handleSlotMouseDown(slot)}
              onMouseEnter={() => handleSlotMouseEnter(slot)}
              style={{
                height: SLOT_HEIGHT,
                backgroundColor: isSelected
                  ? "rgba(22,163,74,0.75)"
                  : "rgba(254,202,202,0.45)",
                borderTop: isHourBoundary ? "1px solid #9ca3af" : "1px dotted #e5e7eb",
                cursor: disabled ? "not-allowed" : "crosshair",
                transition: "background-color 50ms",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// --- SingleDayHeatmap (group) ---

function buildSlotUsers(records: UserRecord[]): Record<Day, Map<number, string[]>> {
  const result = Object.fromEntries(
    DAYS.map((d) => [d, new Map<number, string[]>()])
  ) as Record<Day, Map<number, string[]>>;

  for (const { userId, availability } of records) {
    const norm = normalizeIncoming(availability);
    for (const day of DAYS) {
      const d = norm[day];
      if (!d.available) continue;
      for (const slot of filledSlots(d.blocks)) {
        const arr = result[day].get(slot) ?? [];
        arr.push(userId);
        result[day].set(slot, arr);
      }
    }
  }
  return result;
}

function SingleDayHeatmap({
  day,
  records,
}: {
  day: Day;
  records: UserRecord[];
}) {
  const slotUsers = useMemo(() => buildSlotUsers(records), [records]);
  const dayData = slotUsers[day];
  const total = records.length;

  const maxCount = useMemo(() => {
    let max = 0;
    for (const v of dayData.values()) if (v.length > max) max = v.length;
    return max;
  }, [dayData]);

  const [tooltip, setTooltip] = useState<{
    slot: number;
    users: string[];
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  if (records.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-gray-400"
        style={{ height: SLOTS.length * SLOT_HEIGHT }}
      >
        No availability yet
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex">
        {/* Time labels */}
        <div className="flex flex-col" style={{ width: LABEL_WIDTH, flexShrink: 0 }}>
          {SLOTS.map((slot) => (
            <div key={slot} style={{ height: SLOT_HEIGHT, position: "relative" }}>
              {slot % 60 === 0 && (
                <span
                  className="absolute text-xs text-gray-400 leading-none"
                  style={{ top: -7, right: 6, whiteSpace: "nowrap" }}
                >
                  {formatSlotTime(slot)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Single column */}
        <div className="flex flex-col border-l border-gray-300" style={{ width: COLUMN_WIDTH }}>
          {SLOTS.map((slot, idx) => {
            const users = dayData.get(slot) ?? [];
            const count = users.length;
            const opacity = maxCount > 0 ? count / maxCount : 0;
            const bg =
              count > 0 ? `rgba(22,163,74,${0.12 + opacity * 0.88})` : "#f9fafb";
            const isHourBoundary = slot % 60 === 0;
            return (
              <div
                key={slot}
                style={{
                  height: SLOT_HEIGHT,
                  background: bg,
                  borderTop: isHourBoundary ? "1px solid #9ca3af" : "1px dotted #e5e7eb",
                  cursor: count > 0 ? "default" : "default",
                  position: "relative",
                }}
                onMouseEnter={() => {
                  if (count > 0) {
                    setTooltip({ slot, users, y: idx * SLOT_HEIGHT });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </div>
      </div>

      {tooltip && (
        <div
          className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1.5 pointer-events-none z-50 shadow-lg"
          style={{
            top: tooltip.y,
            left: LABEL_WIDTH + COLUMN_WIDTH + 8,
            minWidth: 120,
            maxWidth: 200,
          }}
        >
          <div className="font-semibold mb-0.5">
            {toHHMM(tooltip.slot)}–{toHHMM(tooltip.slot + SLOT_MIN)}
          </div>
          <div className="text-gray-300">
            {tooltip.users.length}/{total} available
          </div>
          <div className="mt-1 text-gray-200">{tooltip.users.join(", ")}</div>
        </div>
      )}
    </div>
  );
}

// --- Name entry screen ---

function NameEntry({ onSet }: { onSet: (name: string, password: string) => void }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId: trimmedName });
      if (password) params.set("password", password);
      const res = await fetch(`/api/availability?${params}`, { cache: "no-store" });
      if (res.status === 401) {
        setError("Wrong password. Try again.");
        return;
      }
      localStorage.setItem("ws_user_name", trimmedName);
      if (password) localStorage.setItem("ws_user_password", password);
      onSet(trimmedName, password);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="max-w-sm mx-auto mt-24 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center">Sign In</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 w-28 shrink-0">Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              className="flex-1 border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 w-28 shrink-0">Password (optional):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={64}
              className="flex-1 border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" disabled={!name.trim() || loading} className="mt-1">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <div className="text-xs text-gray-500 text-center space-y-0.5 pt-1">
          <p>Your name and password are tied to this schedule only.</p>
          <p>First time here? Pick any name and password.</p>
          <p>Coming back? Sign in with the same details.</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Day tab selector ---

function DayTabs({
  selected,
  onSelect,
}: {
  selected: Day;
  onSelect: (d: Day) => void;
}) {
  return (
    <div className="flex gap-1 justify-center flex-wrap">
      {DAYS.map((day) => (
        <button
          key={day}
          onClick={() => onSelect(day)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            selected === day
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {day.slice(0, 3)}
        </button>
      ))}
    </div>
  );
}

// --- Invite Modal ---

function InviteModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? window.location.href : "";

  function copyLink() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Invite Someone</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Share this link so others can add their availability to the group schedule.
        </p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-4">
          <span className="flex-1 text-sm text-gray-700 truncate select-all">{link}</span>
        </div>

        <Button
          onClick={copyLink}
          className="w-full text-sm py-2.5"
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Anyone with this link can open the page, enter their name, and set their availability.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- Availability form ---

function AvailabilityForm({
  userId,
  password,
  onChangeName,
}: {
  userId: string;
  password: string;
  onChangeName: () => void;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Day>("Monday");
  const [availability, setAvailability] = useState<Record<Day, DayAvailability>>(
    makeDefaultAvailability()
  );
  const [allRecords, setAllRecords] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function fetchAll() {
    const res = await fetch("/api/availability?all=true", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setAllRecords(data as UserRecord[]);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setStatus(null);
      try {
        const [ownRes, allRes] = await Promise.all([
          fetch(`/api/availability?userId=${encodeURIComponent(userId)}${password ? `&password=${encodeURIComponent(password)}` : ""}`, { cache: "no-store" }),
          fetch("/api/availability?all=true", { cache: "no-store" }),
        ]);

        if (!ownRes.ok) throw new Error(`Load failed (${ownRes.status})`);
        const ownData = await ownRes.json();
        if (!cancelled && ownData?.availability)
          setAvailability(normalizeIncoming(ownData.availability));

        if (allRes.ok) {
          const allData = await allRes.json();
          if (!cancelled && Array.isArray(allData)) {
            setAllRecords(allData as UserRecord[]);
            // Mark as host if no one has saved yet (first person on this page)
            if (allData.length === 0 && !localStorage.getItem("ws_host_id")) {
              localStorage.setItem("ws_host_id", userId);
            }
          }
        }
      } catch (e: unknown) {
        if (!cancelled)
          setStatus(`Load failed: ${e instanceof Error ? e.message : "Unknown error"}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleSave() {
    setStatus(null);
    try {
      setIsSaving(true);
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, availability }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any)?.error ?? `Save failed (${res.status})`);
      }
      setStatus("Saved ✅");
      setTimeout(() => setStatus(null), 2000);
      await fetchAll();
    } catch (e: unknown) {
      setStatus(`Save failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  }

  // Count available/total for heatmap legend
  const { minAvail, maxAvail } = useMemo(() => {
    const slotUsers = buildSlotUsers(allRecords);
    const dayData = slotUsers[selectedDay];
    let min = Infinity;
    let max = 0;
    for (const v of dayData.values()) {
      if (v.length < min) min = v.length;
      if (v.length > max) max = v.length;
    }
    return {
      minAvail: dayData.size === 0 ? 0 : min,
      maxAvail: max,
    };
  }, [allRecords, selectedDay]);

  const total = allRecords.length;

  const isHost = localStorage.getItem("ws_host_id") === userId;

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-8 px-4 pb-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Availability</h1>
        <div className="flex items-center gap-3">
          {status && (
            <span
              className={`text-sm ${
                status.toLowerCase().includes("failed") ? "text-red-600" : "text-green-700"
              }`}
            >
              {status}
            </span>
          )}
          {isHost && (
            <button
              type="button"
              onClick={() => setShowInvite(true)}
              className="text-sm px-4 py-1.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition"
            >
              Invite
            </button>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="text-sm px-4 py-1.5"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <button
            type="button"
            onClick={onChangeName}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            {userId} — change
          </button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="mb-6">
        <DayTabs selected={selectedDay} onSelect={setSelectedDay} />
      </div>

      {isLoading && (
        <div className="text-center text-sm text-gray-500 py-8">
          Loading saved availability…
        </div>
      )}

      {!isLoading && (
        <div className="flex gap-12 justify-center flex-wrap">
          {/* Left: user's availability */}
          <div>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-gray-800 text-center">
                {userId}&apos;s Availability
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-gray-500">
                <span>Unavailable</span>
                <div
                  style={{
                    width: 18,
                    height: 14,
                    background: "rgba(254,202,202,0.65)",
                    border: "1px solid #fca5a5",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 18,
                    height: 14,
                    background: "rgba(22,163,74,0.75)",
                    borderRadius: 2,
                  }}
                />
                <span>Available</span>
              </div>
              <p className="text-xs text-gray-400 text-center mt-1">
                Click and Drag to Toggle
              </p>
            </div>

            <SingleDayGrid
              day={selectedDay}
              availability={availability}
              onChange={setAvailability}
              disabled={isLoading || isSaving}
            />
          </div>

          {/* Right: group heatmap */}
          <div>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-gray-800 text-center">
                Group&apos;s Availability
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-gray-500">
                <span>{minAvail}/{total}</span>
                {[0.12, 0.32, 0.54, 0.76, 1].map((o) => (
                  <div
                    key={o}
                    style={{
                      width: 18,
                      height: 14,
                      background: `rgba(22,163,74,${o})`,
                      borderRadius: 2,
                    }}
                  />
                ))}
                <span>{maxAvail}/{total}</span>
              </div>
              <p className="text-xs text-gray-400 text-center mt-1">
                Mouseover to See Who Is Available
              </p>
            </div>

            <SingleDayHeatmap day={selectedDay} records={allRecords} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// --- Root page ---

export default function AvailabilityPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("ws_user_name");
    const storedPwd = localStorage.getItem("ws_user_password") ?? "";
    if (storedName) {
      setUserId(storedName);
      setUserPassword(storedPwd);
    }
  }, []);

  if (!mounted) return null;

  if (!userId)
    return (
      <NameEntry
        onSet={(name, pwd) => {
          setUserId(name);
          setUserPassword(pwd);
        }}
      />
    );

  return (
    <AvailabilityForm
      userId={userId}
      password={userPassword}
      onChangeName={() => {
        localStorage.removeItem("ws_user_name");
        localStorage.removeItem("ws_user_password");
        setUserId(null);
        setUserPassword("");
      }}
    />
  );
}
