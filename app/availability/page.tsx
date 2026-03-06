"use client";

import React, { useEffect, useMemo, useState } from "react";
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

const GhostButton: React.FC<ButtonProps> = ({ children, className = "", ...props }) => (
  <button
    className={
      "border border-gray-300 text-gray-800 px-3 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`bg-white shadow-md rounded-2xl ${className}`}>{children}</div>;

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`p-6 ${className}`}>{children}</div>;

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

const WEEKDAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKEND: Day[] = ["Saturday", "Sunday"];

type UserRecord = { userId: string; availability: Record<Day, DayAvailability> };

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
  return { available: true, blocks: [{ start: "09:00", end: "17:00" }] };
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
      if (next[day].blocks.length === 0) next[day].blocks = [{ start: "09:00", end: "17:00" }];
    } else if (typeof d.start === "string" && typeof d.end === "string") {
      next[day] = {
        available: Boolean(d.available),
        blocks: [{ start: d.start, end: d.end }],
      };
    }
  }

  return next;
}

// --- Group Heatmap ---

const SLOT_MIN = 30;
const HEAT_START = 7 * 60;  // 7 AM
const HEAT_END = 22 * 60;   // 10 PM
const SLOTS = Array.from(
  { length: (HEAT_END - HEAT_START) / SLOT_MIN },
  (_, i) => HEAT_START + i * SLOT_MIN
);

function slotLabel(m: number): string {
  if (m % 60 !== 0) return "";
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}${h >= 12 ? "PM" : "AM"}`;
}

function filledSlots(blocks: TimeBlock[]): Set<number> {
  const out = new Set<number>();
  for (const b of blocks) {
    const s = minutesFromHHMM(b.start);
    const e = minutesFromHHMM(b.end);
    if (!Number.isFinite(s) || !Number.isFinite(e)) continue;
    for (let m = s; m < e; m += SLOT_MIN) out.add(m);
  }
  return out;
}

function buildHeatmap(records: UserRecord[]): Record<Day, Map<number, number>> {
  const result = Object.fromEntries(DAYS.map((d) => [d, new Map<number, number>()])) as Record<
    Day,
    Map<number, number>
  >;
  for (const { availability } of records) {
    const norm = normalizeIncoming(availability);
    for (const day of DAYS) {
      const d = norm[day];
      if (!d.available) continue;
      for (const slot of filledSlots(d.blocks)) {
        result[day].set(slot, (result[day].get(slot) ?? 0) + 1);
      }
    }
  }
  return result;
}

function GroupHeatmap({ records }: { records: UserRecord[] }) {
  const heatmap = useMemo(() => buildHeatmap(records), [records]);
  const maxCount = useMemo(() => {
    let max = 0;
    for (const day of DAYS)
      for (const v of heatmap[day].values()) if (v > max) max = v;
    return max;
  }, [heatmap]);

  const [tooltip, setTooltip] = useState<{ day: Day; slot: number; count: number } | null>(null);

  if (records.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400">
        No availability submitted yet. Be the first!
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        {records.length} participant{records.length !== 1 ? "s" : ""}:{" "}
        {records.map((r) => r.userId).join(", ")}
      </p>
      <div className="overflow-x-auto relative">
        <div className="flex">
          {/* Time labels */}
          <div className="flex flex-col mr-2" style={{ minWidth: 44 }}>
            <div style={{ height: 28 }} />
            {SLOTS.map((slot) => (
              <div key={slot} style={{ height: 20 }} className="flex items-center">
                <span className="text-xs text-gray-400 leading-none">{slotLabel(slot)}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((day) => (
            <div key={day} className="flex flex-col flex-1 min-w-0">
              <div style={{ height: 28 }} className="flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">{day.slice(0, 3)}</span>
              </div>
              {SLOTS.map((slot) => {
                const count = heatmap[day].get(slot) ?? 0;
                const opacity = maxCount > 0 ? count / maxCount : 0;
                const bg =
                  count > 0 ? `rgba(34,197,94,${0.15 + opacity * 0.85})` : "#f9fafb";
                return (
                  <div
                    key={slot}
                    style={{ height: 20, background: bg }}
                    className="border-b border-r border-gray-100 cursor-default"
                    onMouseEnter={() => count > 0 && setTooltip({ day, slot, count })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {tooltip && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-50">
            {tooltip.day} {toHHMM(tooltip.slot)}–{toHHMM(tooltip.slot + SLOT_MIN)}:{" "}
            {tooltip.count} available
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>0</span>
        {[0.15, 0.35, 0.55, 0.75, 1].map((o) => (
          <div
            key={o}
            style={{
              width: 18,
              height: 14,
              background: `rgba(34,197,94,${o})`,
              borderRadius: 3,
            }}
          />
        ))}
        <span>{maxCount}</span>
      </div>
    </div>
  );
}

// --- Name entry screen ---

function NameEntry({ onSet }: { onSet: (name: string) => void }) {
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("ws_user_name", trimmed);
    onSet(trimmed);
  }

  return (
    <motion.div
      className="max-w-sm mx-auto mt-24 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-center">What's your name?</h2>
          <p className="text-sm text-gray-500 text-center">
            So others can see your availability.
          </p>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="e.g. Alice"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <Button type="submit" disabled={!name.trim()}>
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Availability form ---

function AvailabilityForm({
  userId,
  onChangeName,
}: {
  userId: string;
  onChangeName: () => void;
}) {
  const [availability, setAvailability] = useState<Record<Day, DayAvailability>>(
    makeDefaultAvailability()
  );
  const [allRecords, setAllRecords] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const errors = useMemo(() => {
    const next: Partial<Record<Day, string[]>> = {};
    for (const day of DAYS) {
      const d = availability[day];
      if (!d.available) continue;
      const dayErrors: string[] = [];

      d.blocks.forEach((b, i) => {
        const s = minutesFromHHMM(b.start);
        const e = minutesFromHHMM(b.end);
        if (!Number.isFinite(s) || !Number.isFinite(e))
          dayErrors.push(`Block ${i + 1}: Invalid time.`);
        else if (e <= s) dayErrors.push(`Block ${i + 1}: End must be after start.`);
      });

      const sorted = [...d.blocks]
        .map((b) => ({ ...b, s: minutesFromHHMM(b.start), e: minutesFromHHMM(b.end) }))
        .filter((x) => Number.isFinite(x.s) && Number.isFinite(x.e))
        .sort((a, b) => a.s - b.s);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].s < sorted[i - 1].e) {
          dayErrors.push("Blocks overlap. Please adjust.");
          break;
        }
      }

      if (dayErrors.length) next[day] = dayErrors;
    }
    return next;
  }, [availability]);

  const hasErrors = Object.keys(errors).length > 0;

  function setDayAvailable(day: Day, available: boolean) {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], available } }));
  }

  function updateBlock(day: Day, index: number, patch: Partial<TimeBlock>) {
    setAvailability((prev) => {
      const blocks = prev[day].blocks.map((b, i) => (i === index ? { ...b, ...patch } : b));
      return { ...prev, [day]: { ...prev[day], blocks } };
    });
  }

  function addBlock(day: Day) {
    setAvailability((prev) => {
      const blocks = prev[day].blocks;
      const last = blocks[blocks.length - 1];
      const endMin = minutesFromHHMM(last?.end ?? "17:00");
      const startMin = Number.isFinite(endMin) ? Math.min(endMin + 60, 23 * 60) : 9 * 60;
      const end2Min = Math.min(startMin + 60, 24 * 60);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          available: true,
          blocks: [...blocks, { start: toHHMM(startMin), end: toHHMM(end2Min) }],
        },
      };
    });
  }

  function removeBlock(day: Day, index: number) {
    setAvailability((prev) => {
      const blocks = prev[day].blocks.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          blocks: blocks.length ? blocks : [{ start: "09:00", end: "17:00" }],
        },
      };
    });
  }

  function copyDayTo(targetDays: Day[], sourceDay: Day) {
    setAvailability((prev) => {
      const source = prev[sourceDay];
      const next = { ...prev };
      for (const d of targetDays)
        next[d] = { available: source.available, blocks: source.blocks.map((b) => ({ ...b })) };
      return next;
    });
  }

  function resetAll() {
    setAvailability(makeDefaultAvailability());
    setStatus("Reset to defaults.");
    setTimeout(() => setStatus(null), 1500);
  }

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
          fetch(`/api/availability?userId=${encodeURIComponent(userId)}`, { cache: "no-store" }),
          fetch("/api/availability?all=true", { cache: "no-store" }),
        ]);

        if (!ownRes.ok) throw new Error(`Load failed (${ownRes.status})`);
        const ownData = await ownRes.json();
        if (!cancelled && ownData?.availability)
          setAvailability(normalizeIncoming(ownData.availability));

        if (allRes.ok) {
          const allData = await allRes.json();
          if (!cancelled && Array.isArray(allData)) setAllRecords(allData as UserRecord[]);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (hasErrors) {
      setStatus("Fix the errors first.");
      return;
    }
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

  // Per-day people count from heatmap data (max slot count for that day)
  const peopleCounts = useMemo(() => {
    const heatmap = buildHeatmap(allRecords);
    return Object.fromEntries(
      DAYS.map((day) => {
        const max = Math.max(0, ...heatmap[day].values());
        return [day, max];
      })
    ) as Record<Day, number>;
  }, [allRecords]);

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 p-6 space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Own availability */}
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-semibold">Set Your Weekly Availability</h2>
              <button
                type="button"
                onClick={onChangeName}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Logged in as <strong>{userId}</strong> — change
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <GhostButton
                type="button"
                disabled={isLoading || isSaving}
                onClick={() => copyDayTo(WEEKDAYS, "Monday")}
              >
                Copy Monday → Weekdays
              </GhostButton>
              <GhostButton
                type="button"
                disabled={isLoading || isSaving}
                onClick={() => copyDayTo(WEEKEND, "Saturday")}
              >
                Copy Saturday → Weekend
              </GhostButton>
              <GhostButton type="button" disabled={isLoading || isSaving} onClick={resetAll}>
                Reset
              </GhostButton>
            </div>
          </div>

          {isLoading && (
            <div className="text-center text-sm text-gray-500">Loading saved availability…</div>
          )}

          {status && (
            <div
              className={`text-center text-sm ${
                status.toLowerCase().includes("failed") ? "text-red-600" : "text-green-700"
              }`}
            >
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {DAYS.map((day) => {
              const d = availability[day];
              const dayErrors = errors[day] ?? [];
              const count = peopleCounts[day] ?? 0;

              return (
                <div key={day} className="border rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-28 font-semibold">{day}</div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={d.available}
                          disabled={isLoading || isSaving}
                          onChange={(e) => setDayAvailable(day, e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">Available</span>
                      </label>
                    </div>

                    {count > 0 && (
                      <div className="text-sm text-gray-500">{count} people available</div>
                    )}
                  </div>

                  <div className={`mt-3 space-y-2 ${!d.available ? "opacity-50" : ""}`}>
                    {d.blocks.map((b, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-3">
                        <input
                          type="time"
                          step={900}
                          value={b.start}
                          disabled={!d.available || isLoading || isSaving}
                          onChange={(e) => updateBlock(day, idx, { start: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <input
                          type="time"
                          step={900}
                          value={b.end}
                          disabled={!d.available || isLoading || isSaving}
                          onChange={(e) => updateBlock(day, idx, { end: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        <GhostButton
                          type="button"
                          disabled={!d.available || isLoading || isSaving || d.blocks.length === 1}
                          onClick={() => removeBlock(day, idx)}
                        >
                          Remove
                        </GhostButton>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 pt-1">
                      <GhostButton
                        type="button"
                        disabled={!d.available || isLoading || isSaving}
                        onClick={() => addBlock(day)}
                      >
                        + Add time block
                      </GhostButton>
                      <span className="text-xs text-gray-500">(ex: mornings + evenings)</span>
                    </div>
                  </div>

                  {dayErrors.length > 0 && (
                    <ul className="mt-3 list-disc pl-6 text-sm text-red-600">
                      {dayErrors.map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button type="submit" disabled={isSaving || isLoading || hasErrors}>
                {isSaving ? "Saving..." : "Save Availability"}
              </Button>
              {hasErrors && !isSaving && !isLoading && (
                <span className="text-sm text-red-600">Fix errors above.</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Group heatmap */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Group Availability</h3>
          <GroupHeatmap records={allRecords} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Root page (handles name entry gate) ---

export default function AvailabilityPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("ws_user_name");
    if (stored) setUserId(stored);
  }, []);

  if (!mounted) return null;

  if (!userId) return <NameEntry onSet={setUserId} />;

  return (
    <AvailabilityForm
      userId={userId}
      onChangeName={() => {
        localStorage.removeItem("ws_user_name");
        setUserId(null);
      }}
    />
  );
}
