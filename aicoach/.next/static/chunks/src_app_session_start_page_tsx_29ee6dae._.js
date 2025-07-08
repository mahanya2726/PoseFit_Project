(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_session_start_page_tsx_29ee6dae._.js", {

"[project]/src/app/session/start/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>StartExercisePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function StartExercisePage() {
    _s();
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [stream, setStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [timer, setTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recordedChunks, setRecordedChunks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [videoURL, setVideoURL] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sessionStarted, setSessionStarted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const songMap = {
        better: "/better-day-workout-beat.mp3",
        bouncy: "/bouncy-workout.mp3",
        order: "/order.mp3",
        workout1: "/sport-gym-workout -music-1.mp3",
        workout2: "/sport-gym-workout-music-2.mp3",
        metal: "/workout -metal.mp3",
        workout: "/workout.mp3"
    };
    const storedDuration = ("TURBOPACK compile-time truthy", 1) ? Number(localStorage.getItem("duration")) || 10 : ("TURBOPACK unreachable", undefined);
    const SESSION_DURATION = storedDuration;
    const exercise = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("exercise") || "squat" : ("TURBOPACK unreachable", undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StartExercisePage.useEffect": ()=>{
            async function initCamera() {
                try {
                    const camStream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    });
                    setStream(camStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = camStream;
                    }
                } catch (err) {
                    alert("Camera access is required to start the session.");
                }
            }
            initCamera();
        }
    }["StartExercisePage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StartExercisePage.useEffect": ()=>{
            if (stream && countdown !== null) {
                if (countdown === 0) {
                    setCountdown(null);
                    startSession();
                } else {
                    const timeout = setTimeout({
                        "StartExercisePage.useEffect.timeout": ()=>setCountdown({
                                "StartExercisePage.useEffect.timeout": (prev)=>prev !== null ? prev - 1 : null
                            }["StartExercisePage.useEffect.timeout"])
                    }["StartExercisePage.useEffect.timeout"], 1000);
                    return ({
                        "StartExercisePage.useEffect": ()=>clearTimeout(timeout)
                    })["StartExercisePage.useEffect"];
                }
            }
        }
    }["StartExercisePage.useEffect"], [
        countdown,
        stream
    ]);
    const startSession = ()=>{
        setSessionStarted(true);
        const chunks = [];
        if (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (e)=>{
                if (e.data.size > 0) chunks.push(e.data);
            };
            mediaRecorder.onstop = ()=>{
                const blob = new Blob(chunks, {
                    type: "video/webm"
                });
                const url = URL.createObjectURL(blob);
                setVideoURL(url);
                setRecordedChunks(chunks);
                sendToBackend(blob);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    audioRef.current = null;
                }
            };
            mediaRecorder.start();
            const selectedSong = localStorage.getItem("selectedSong") || "none";
            if (selectedSong !== "none" && songMap[selectedSong]) {
                const audio = new Audio(songMap[selectedSong]);
                audio.volume = 0.4;
                audioRef.current = audio;
                audio.play().catch((err)=>{
                    console.warn("Song failed to play:", err);
                });
            }
            let remaining = SESSION_DURATION;
            setTimer(remaining);
            const interval = setInterval(()=>{
                remaining--;
                setTimer(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                    mediaRecorder.stop();
                    stream.getTracks().forEach((track)=>track.stop());
                }
            }, 1000);
        }
    };
    const sendToBackend = async (blob)=>{
        const formData = new FormData();
        formData.append("video", blob, `${exercise}_video.webm`);
        try {
            const response = await fetch(`http://localhost:5000/upload-${exercise}`, {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            console.log("Server response:", result);
            if (exercise === "squat") {
                window.location.href = `/session/result?exercise=squat&total=${result.total_squats}&good=${result.good_squats}&bad=${result.bad_squats}`;
            } else if (exercise === "pushup") {
                window.location.href = `/session/result?exercise=pushup&total=${result.total_pushups}&good=${result.good_pushups}&bad=${result.bad_pushups}`;
            } else if (exercise === "lunges") {
                window.location.href = `/session/result?exercise=lunges&total=${result.total_lunges}&good=${result.good_lunges}&bad=${result.bad_lunges}`;
            } else if (exercise === "plank") {
                const warnings = encodeURIComponent(result.warnings?.join("; ") || "");
                window.location.href = `/session/result?exercise=plank&duration=${result.plank_duration_sec}&badframes=${result.bad_posture_frames}&warnings=${warnings}`;
            } else {
                alert("Unsupported exercise type!");
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Failed to send video to backend.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center min-h-screen p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4",
                children: [
                    "🏋️ Start Your ",
                    exercise.charAt(0).toUpperCase() + exercise.slice(1),
                    " Session"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/session/start/page.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            !sessionStarted && countdown !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-4xl font-bold text-blue-600",
                children: [
                    "Your time starts in ",
                    countdown,
                    "..."
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/session/start/page.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this),
            sessionStarted && timer !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-5xl font-bold text-red-600 mb-4",
                children: timer
            }, void 0, false, {
                fileName: "[project]/src/app/session/start/page.tsx",
                lineNumber: 162,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                ref: videoRef,
                autoPlay: true,
                playsInline: true,
                muted: true,
                className: "rounded shadow-md w-[90vw] h-[100vh] object-cover"
            }, void 0, false, {
                fileName: "[project]/src/app/session/start/page.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/session/start/page.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
_s(StartExercisePage, "r+o7yGa2Hi9LF/mPYVEipe8KibI=");
_c = StartExercisePage;
var _c;
__turbopack_context__.k.register(_c, "StartExercisePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_session_start_page_tsx_29ee6dae._.js.map