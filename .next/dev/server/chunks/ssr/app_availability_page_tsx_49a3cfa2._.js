module.exports = [
"[project]/app/availability/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvailabilityPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
const Button = ({ children, className = "", ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed " + className,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const GhostButton = ({ children, className = "", ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "border border-gray-300 text-gray-800 px-3 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed " + className,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const Card = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white shadow-md rounded-2xl ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 38,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
const CardContent = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-6 ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 43,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];
const WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
const WEEKEND = [
    "Saturday",
    "Sunday"
];
// --- Helpers ---
function minutesFromHHMM(t) {
    const [hh, mm] = t.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return NaN;
    return hh * 60 + mm;
}
function toHHMM(m) {
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
function defaultDay() {
    return {
        available: true,
        blocks: [
            {
                start: "09:00",
                end: "17:00"
            }
        ]
    };
}
function makeDefaultAvailability() {
    return DAYS.reduce((acc, day)=>{
        acc[day] = defaultDay();
        return acc;
    }, {});
}
function normalizeIncoming(input) {
    const defaults = makeDefaultAvailability();
    if (!input || typeof input !== "object") return defaults;
    const raw = input;
    const next = {
        ...defaults
    };
    for (const day of DAYS){
        const d = raw[day];
        if (!d) continue;
        if (Array.isArray(d.blocks)) {
            next[day] = {
                available: Boolean(d.available),
                blocks: d.blocks.filter((b)=>b && typeof b.start === "string" && typeof b.end === "string").map((b)=>({
                        start: b.start,
                        end: b.end
                    }))
            };
            if (next[day].blocks.length === 0) next[day].blocks = [
                {
                    start: "09:00",
                    end: "17:00"
                }
            ];
        } else if (typeof d.start === "string" && typeof d.end === "string") {
            next[day] = {
                available: Boolean(d.available),
                blocks: [
                    {
                        start: d.start,
                        end: d.end
                    }
                ]
            };
        }
    }
    return next;
}
// --- Group Heatmap ---
const SLOT_MIN = 30;
const HEAT_START = 7 * 60; // 7 AM
const HEAT_END = 22 * 60; // 10 PM
const SLOTS = Array.from({
    length: (HEAT_END - HEAT_START) / SLOT_MIN
}, (_, i)=>HEAT_START + i * SLOT_MIN);
function slotLabel(m) {
    if (m % 60 !== 0) return "";
    const h = Math.floor(m / 60);
    return `${h % 12 || 12}${h >= 12 ? "PM" : "AM"}`;
}
function filledSlots(blocks) {
    const out = new Set();
    for (const b of blocks){
        const s = minutesFromHHMM(b.start);
        const e = minutesFromHHMM(b.end);
        if (!Number.isFinite(s) || !Number.isFinite(e)) continue;
        for(let m = s; m < e; m += SLOT_MIN)out.add(m);
    }
    return out;
}
function buildHeatmap(records) {
    const result = Object.fromEntries(DAYS.map((d)=>[
            d,
            new Map()
        ]));
    for (const { availability } of records){
        const norm = normalizeIncoming(availability);
        for (const day of DAYS){
            const d = norm[day];
            if (!d.available) continue;
            for (const slot of filledSlots(d.blocks)){
                result[day].set(slot, (result[day].get(slot) ?? 0) + 1);
            }
        }
    }
    return result;
}
function GroupHeatmap({ records }) {
    const heatmap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildHeatmap(records), [
        records
    ]);
    const maxCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        let max = 0;
        for (const day of DAYS)for (const v of heatmap[day].values())if (v > max) max = v;
        return max;
    }, [
        heatmap
    ]);
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    if (records.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-center text-sm text-gray-400",
            children: "No availability submitted yet. Be the first!"
        }, void 0, false, {
            fileName: "[project]/app/availability/page.tsx",
            lineNumber: 176,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 mb-3",
                children: [
                    records.length,
                    " participant",
                    records.length !== 1 ? "s" : "",
                    ":",
                    " ",
                    records.map((r)=>r.userId).join(", ")
                ]
            }, void 0, true, {
                fileName: "[project]/app/availability/page.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col mr-2",
                                style: {
                                    minWidth: 44
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 28
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/availability/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 13
                                    }, this),
                                    SLOTS.map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: 20
                                            },
                                            className: "flex items-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-400 leading-none",
                                                children: slotLabel(slot)
                                            }, void 0, false, {
                                                fileName: "[project]/app/availability/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this)
                                        }, slot, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/availability/page.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this),
                            DAYS.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: 28
                                            },
                                            className: "flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold text-gray-600",
                                                children: day.slice(0, 3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/availability/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 15
                                        }, this),
                                        SLOTS.map((slot)=>{
                                            const count = heatmap[day].get(slot) ?? 0;
                                            const opacity = maxCount > 0 ? count / maxCount : 0;
                                            const bg = count > 0 ? `rgba(34,197,94,${0.15 + opacity * 0.85})` : "#f9fafb";
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: 20,
                                                    background: bg
                                                },
                                                className: "border-b border-r border-gray-100 cursor-default",
                                                onMouseEnter: ()=>count > 0 && setTooltip({
                                                        day,
                                                        slot,
                                                        count
                                                    }),
                                                onMouseLeave: ()=>setTooltip(null)
                                            }, slot, false, {
                                                fileName: "[project]/app/availability/page.tsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    ]
                                }, day, true, {
                                    fileName: "[project]/app/availability/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-50",
                        children: [
                            tooltip.day,
                            " ",
                            toHHMM(tooltip.slot),
                            "–",
                            toHHMM(tooltip.slot + SLOT_MIN),
                            ":",
                            " ",
                            tooltip.count,
                            " available"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/availability/page.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mt-3 text-xs text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "0"
                    }, void 0, false, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    [
                        0.15,
                        0.35,
                        0.55,
                        0.75,
                        1
                    ].map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: 18,
                                height: 14,
                                background: `rgba(34,197,94,${o})`,
                                borderRadius: 3
                            }
                        }, o, false, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: maxCount
                    }, void 0, false, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/availability/page.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 183,
        columnNumber: 5
    }, this);
}
// --- Name entry screen ---
function NameEntry({ onSet }) {
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    function submit(e) {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        localStorage.setItem("ws_user_name", trimmed);
        onSet(trimmed);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "max-w-sm mx-auto mt-24 p-6",
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-center",
                        children: "What's your name?"
                    }, void 0, false, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 273,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 text-center",
                        children: "So others can see your availability."
                    }, void 0, false, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 274,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: submit,
                        className: "flex flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. Alice",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                maxLength: 32,
                                className: "border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400",
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/app/availability/page.tsx",
                                lineNumber: 278,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                type: "submit",
                                disabled: !name.trim(),
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/app/availability/page.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/availability/page.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/availability/page.tsx",
                lineNumber: 272,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/availability/page.tsx",
            lineNumber: 271,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
// --- Availability form ---
function AvailabilityForm({ userId, onChangeName }) {
    const [availability, setAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(makeDefaultAvailability());
    const [allRecords, setAllRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const errors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const next = {};
        for (const day of DAYS){
            const d = availability[day];
            if (!d.available) continue;
            const dayErrors = [];
            d.blocks.forEach((b, i)=>{
                const s = minutesFromHHMM(b.start);
                const e = minutesFromHHMM(b.end);
                if (!Number.isFinite(s) || !Number.isFinite(e)) dayErrors.push(`Block ${i + 1}: Invalid time.`);
                else if (e <= s) dayErrors.push(`Block ${i + 1}: End must be after start.`);
            });
            const sorted = [
                ...d.blocks
            ].map((b)=>({
                    ...b,
                    s: minutesFromHHMM(b.start),
                    e: minutesFromHHMM(b.end)
                })).filter((x)=>Number.isFinite(x.s) && Number.isFinite(x.e)).sort((a, b)=>a.s - b.s);
            for(let i = 1; i < sorted.length; i++){
                if (sorted[i].s < sorted[i - 1].e) {
                    dayErrors.push("Blocks overlap. Please adjust.");
                    break;
                }
            }
            if (dayErrors.length) next[day] = dayErrors;
        }
        return next;
    }, [
        availability
    ]);
    const hasErrors = Object.keys(errors).length > 0;
    function setDayAvailable(day, available) {
        setAvailability((prev)=>({
                ...prev,
                [day]: {
                    ...prev[day],
                    available
                }
            }));
    }
    function updateBlock(day, index, patch) {
        setAvailability((prev)=>{
            const blocks = prev[day].blocks.map((b, i)=>i === index ? {
                    ...b,
                    ...patch
                } : b);
            return {
                ...prev,
                [day]: {
                    ...prev[day],
                    blocks
                }
            };
        });
    }
    function addBlock(day) {
        setAvailability((prev)=>{
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
                    blocks: [
                        ...blocks,
                        {
                            start: toHHMM(startMin),
                            end: toHHMM(end2Min)
                        }
                    ]
                }
            };
        });
    }
    function removeBlock(day, index) {
        setAvailability((prev)=>{
            const blocks = prev[day].blocks.filter((_, i)=>i !== index);
            return {
                ...prev,
                [day]: {
                    ...prev[day],
                    blocks: blocks.length ? blocks : [
                        {
                            start: "09:00",
                            end: "17:00"
                        }
                    ]
                }
            };
        });
    }
    function copyDayTo(targetDays, sourceDay) {
        setAvailability((prev)=>{
            const source = prev[sourceDay];
            const next = {
                ...prev
            };
            for (const d of targetDays)next[d] = {
                available: source.available,
                blocks: source.blocks.map((b)=>({
                        ...b
                    }))
            };
            return next;
        });
    }
    function resetAll() {
        setAvailability(makeDefaultAvailability());
        setStatus("Reset to defaults.");
        setTimeout(()=>setStatus(null), 1500);
    }
    async function fetchAll() {
        const res = await fetch("/api/availability?all=true", {
            cache: "no-store"
        });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setAllRecords(data);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            setStatus(null);
            try {
                const [ownRes, allRes] = await Promise.all([
                    fetch(`/api/availability?userId=${encodeURIComponent(userId)}`, {
                        cache: "no-store"
                    }),
                    fetch("/api/availability?all=true", {
                        cache: "no-store"
                    })
                ]);
                if (!ownRes.ok) throw new Error(`Load failed (${ownRes.status})`);
                const ownData = await ownRes.json();
                if (!cancelled && ownData?.availability) setAvailability(normalizeIncoming(ownData.availability));
                if (allRes.ok) {
                    const allData = await allRes.json();
                    if (!cancelled && Array.isArray(allData)) setAllRecords(allData);
                }
            } catch (e) {
                if (!cancelled) setStatus(`Load failed: ${e instanceof Error ? e.message : "Unknown error"}`);
            } finally{
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return ()=>{
            cancelled = true;
        };
    }, [
        userId
    ]);
    async function handleSubmit(e) {
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    availability
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                throw new Error(err?.error ?? `Save failed (${res.status})`);
            }
            setStatus("Saved ✅");
            setTimeout(()=>setStatus(null), 2000);
            await fetchAll();
        } catch (e) {
            setStatus(`Save failed: ${e instanceof Error ? e.message : "Unknown error"}`);
        } finally{
            setIsSaving(false);
        }
    }
    // Per-day people count from heatmap data (max slot count for that day)
    const peopleCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const heatmap = buildHeatmap(allRecords);
        return Object.fromEntries(DAYS.map((day)=>{
            const max = Math.max(0, ...heatmap[day].values());
            return [
                day,
                max
            ];
        }));
    }, [
        allRecords
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "max-w-4xl mx-auto mt-10 p-6 space-y-8",
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between flex-wrap gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-semibold",
                                            children: "Set Your Weekly Availability"
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 496,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: onChangeName,
                                            className: "text-xs text-gray-400 hover:text-gray-600 underline",
                                            children: [
                                                "Logged in as ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: userId
                                                }, void 0, false, {
                                                    fileName: "[project]/app/availability/page.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 30
                                                }, this),
                                                " — change"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 497,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/availability/page.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GhostButton, {
                                            type: "button",
                                            disabled: isLoading || isSaving,
                                            onClick: ()=>copyDayTo(WEEKDAYS, "Monday"),
                                            children: "Copy Monday → Weekdays"
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 507,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GhostButton, {
                                            type: "button",
                                            disabled: isLoading || isSaving,
                                            onClick: ()=>copyDayTo(WEEKEND, "Saturday"),
                                            children: "Copy Saturday → Weekend"
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 514,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GhostButton, {
                                            type: "button",
                                            disabled: isLoading || isSaving,
                                            onClick: resetAll,
                                            children: "Reset"
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 521,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/availability/page.tsx",
                                    lineNumber: 506,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 494,
                            columnNumber: 11
                        }, this),
                        isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-sm text-gray-500",
                            children: "Loading saved availability…"
                        }, void 0, false, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 528,
                            columnNumber: 13
                        }, this),
                        status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `text-center text-sm ${status.toLowerCase().includes("failed") ? "text-red-600" : "text-green-700"}`,
                            children: status
                        }, void 0, false, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 532,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-6",
                            children: [
                                DAYS.map((day)=>{
                                    const d = availability[day];
                                    const dayErrors = errors[day] ?? [];
                                    const count = peopleCounts[day] ?? 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-2xl p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-center justify-between gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-28 font-semibold",
                                                                children: day
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/availability/page.tsx",
                                                                lineNumber: 551,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: d.available,
                                                                        disabled: isLoading || isSaving,
                                                                        onChange: (e)=>setDayAvailable(day, e.target.checked)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/availability/page.tsx",
                                                                        lineNumber: 553,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm text-gray-700",
                                                                        children: "Available"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/availability/page.tsx",
                                                                        lineNumber: 559,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/availability/page.tsx",
                                                                lineNumber: 552,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/availability/page.tsx",
                                                        lineNumber: 550,
                                                        columnNumber: 21
                                                    }, this),
                                                    count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-500",
                                                        children: [
                                                            count,
                                                            " people available"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/availability/page.tsx",
                                                        lineNumber: 564,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/availability/page.tsx",
                                                lineNumber: 549,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `mt-3 space-y-2 ${!d.available ? "opacity-50" : ""}`,
                                                children: [
                                                    d.blocks.map((b, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "time",
                                                                    step: 900,
                                                                    value: b.start,
                                                                    disabled: !d.available || isLoading || isSaving,
                                                                    onChange: (e)=>updateBlock(day, idx, {
                                                                            start: e.target.value
                                                                        }),
                                                                    className: "border rounded px-2 py-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/availability/page.tsx",
                                                                    lineNumber: 571,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-gray-500",
                                                                    children: "to"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/availability/page.tsx",
                                                                    lineNumber: 579,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "time",
                                                                    step: 900,
                                                                    value: b.end,
                                                                    disabled: !d.available || isLoading || isSaving,
                                                                    onChange: (e)=>updateBlock(day, idx, {
                                                                            end: e.target.value
                                                                        }),
                                                                    className: "border rounded px-2 py-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/availability/page.tsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GhostButton, {
                                                                    type: "button",
                                                                    disabled: !d.available || isLoading || isSaving || d.blocks.length === 1,
                                                                    onClick: ()=>removeBlock(day, idx),
                                                                    children: "Remove"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/availability/page.tsx",
                                                                    lineNumber: 588,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/app/availability/page.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 23
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 pt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GhostButton, {
                                                                type: "button",
                                                                disabled: !d.available || isLoading || isSaving,
                                                                onClick: ()=>addBlock(day),
                                                                children: "+ Add time block"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/availability/page.tsx",
                                                                lineNumber: 599,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-gray-500",
                                                                children: "(ex: mornings + evenings)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/availability/page.tsx",
                                                                lineNumber: 606,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/availability/page.tsx",
                                                        lineNumber: 598,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/availability/page.tsx",
                                                lineNumber: 568,
                                                columnNumber: 19
                                            }, this),
                                            dayErrors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "mt-3 list-disc pl-6 text-sm text-red-600",
                                                children: dayErrors.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: msg
                                                    }, i, false, {
                                                        fileName: "[project]/app/availability/page.tsx",
                                                        lineNumber: 613,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/availability/page.tsx",
                                                lineNumber: 611,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, day, true, {
                                        fileName: "[project]/app/availability/page.tsx",
                                        lineNumber: 548,
                                        columnNumber: 17
                                    }, this);
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                            type: "submit",
                                            disabled: isSaving || isLoading || hasErrors,
                                            children: isSaving ? "Saving..." : "Save Availability"
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 622,
                                            columnNumber: 15
                                        }, this),
                                        hasErrors && !isSaving && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-red-600",
                                            children: "Fix errors above."
                                        }, void 0, false, {
                                            fileName: "[project]/app/availability/page.tsx",
                                            lineNumber: 626,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/availability/page.tsx",
                                    lineNumber: 621,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 541,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/availability/page.tsx",
                    lineNumber: 493,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/availability/page.tsx",
                lineNumber: 492,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: "Group Availability"
                        }, void 0, false, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 636,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GroupHeatmap, {
                            records: allRecords
                        }, void 0, false, {
                            fileName: "[project]/app/availability/page.tsx",
                            lineNumber: 637,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/availability/page.tsx",
                    lineNumber: 635,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/availability/page.tsx",
                lineNumber: 634,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 486,
        columnNumber: 5
    }, this);
}
function AvailabilityPage() {
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const stored = localStorage.getItem("ws_user_name");
        if (stored) setUserId(stored);
    }, []);
    if (!mounted) return null;
    if (!userId) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NameEntry, {
        onSet: setUserId
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 658,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AvailabilityForm, {
        userId: userId,
        onChangeName: ()=>{
            localStorage.removeItem("ws_user_name");
            setUserId(null);
        }
    }, void 0, false, {
        fileName: "[project]/app/availability/page.tsx",
        lineNumber: 661,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_availability_page_tsx_49a3cfa2._.js.map