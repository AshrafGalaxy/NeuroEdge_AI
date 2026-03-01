import { Storage } from "@plasmohq/storage"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"]
}

const storage = new Storage()
const DYSLEXIA_STYLE_ID = "neuro-assist-dyslexia"
const READER_OVERLAY_ID = "neuro-assist-reader-overlay"
const ADHD_STYLE_ID = "neuro-assist-adhd-ruler"

try {
    storage.watch({
        dyslexiaMode: async (c) => {
            const scope = await storage.get<boolean>("globalScope");
            if (scope === false && document.visibilityState !== "visible") return;
            toggleDyslexiaMode(c.newValue)
        },
        dyslexiaFont: async () => {
            const scope = await storage.get<boolean>("globalScope");
            if (scope === false && document.visibilityState !== "visible") return;
            updateDyslexiaStyle()
        },
        dyslexiaWeight: async () => {
            const scope = await storage.get<boolean>("globalScope");
            if (scope === false && document.visibilityState !== "visible") return;
            updateDyslexiaStyle()
        },
        adhdMode: async (c) => {
            const scope = await storage.get<boolean>("globalScope");
            if (scope === false && document.visibilityState !== "visible") return;
            toggleBionicReading(c.newValue)
        },
        readabilityMode: async (c) => {
            const scope = await storage.get<boolean>("globalScope");
            if (scope === false && document.visibilityState !== "visible") return;
            toggleReadabilityMode(c.newValue)
        }
    })
} catch (e) {
    console.warn("Storage watch failed, context may be invalid:", e);
}

window.addEventListener("load", async () => {
    try {
        if (!chrome?.runtime?.id) return;

        // Phase 3: Kill Ghost Audio
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        // Phase 9: Global Scope Local Preference Check
        const scope = await storage.get<boolean>("globalScope");
        // If not explicitly Local (false), default is Global
        if (scope !== false) {
            if (await storage.get<boolean>("dyslexiaMode")) toggleDyslexiaMode(true)
            if (await storage.get<boolean>("adhdMode")) toggleBionicReading(true)
            if (await storage.get<boolean>("readabilityMode")) toggleReadabilityMode(true)
        }

        // Phase 4: Smart Session Resume
        const sessionKey = `session_${window.location.href}`;
        const session = await storage.get<any>(sessionKey);
        if (session && (session.scrollY > 0 || (session.textPairs && session.textPairs.length > 0))) {
            showResumeToast(session, sessionKey);
        }
    } catch (e) {
        console.warn("Could not load storage on boot", e);
    }
})

// Phase 4 State
let activeSessionPairs: { original: string, simplified: string }[] = [];

window.addEventListener("beforeunload", () => {
    if (activeSessionPairs.length > 0 || window.scrollY > 0) {
        storage.set(`session_${window.location.href}`, {
            scrollY: window.scrollY,
            textPairs: activeSessionPairs
        });
    }
});

function showResumeToast(session: any, sessionKey: string) {
    const toast = document.createElement("div");
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 9999999;
        background: #111827; border: 1px solid #374151; color: white;
        padding: 16px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        display: flex; flex-direction: column; gap: 12px; font-family: system-ui, sans-serif;
    `
    toast.innerHTML = `
        <div style="font-weight: 600; font-size: 14px;">Resume your previous reading session?</div>
        <div style="display: flex; gap: 8px;">
            <button id="neuro-resume-yes" style="flex: 1; background: #10b981; color: white; border: none; border-radius: 6px; padding: 6px; font-weight: 600; cursor: pointer; font-size: 13px;">Yes</button>
            <button id="neuro-resume-no" style="flex: 1; background: #374151; color: white; border: none; border-radius: 6px; padding: 6px; font-weight: 600; cursor: pointer; font-size: 13px;">Start Fresh</button>
        </div>
    `;
    document.body.appendChild(toast);

    document.getElementById("neuro-resume-yes")!.onclick = async () => {
        window.scrollTo({ top: session.scrollY, behavior: 'smooth' });

        if (session.textPairs && session.textPairs.length > 0) {
            session.textPairs.forEach((pair: any) => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                    acceptNode: (n) => n.nodeValue?.includes(pair.original) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
                });
                const node = walker.nextNode();
                if (node && node.parentNode) {
                    const span = document.createElement("span");
                    span.innerHTML = node.nodeValue!.replace(pair.original, `<span style="background: linear-gradient(to right, #ecfdf5, #d1fae5); color: #064e3b; padding: 4px 8px; border-radius: 8px; font-weight: 600; border-bottom: 2px solid #10b981;"> ${pair.simplified} </span>`);
                    node.parentNode.replaceChild(span, node);
                    activeSessionPairs.push(pair);
                }
            });
        }
        toast.remove();
        await storage.remove(sessionKey);
    };

    document.getElementById("neuro-resume-no")!.onclick = async () => {
        toast.remove();
        await storage.remove(sessionKey);
    };
}

// -----------------------------------------------------------------------------
// FEATURE A: BIONIC READING + READING RULER (ADHD Focus)
// -----------------------------------------------------------------------------
function toggleBionicReading(enable: boolean) {
    if (enable) {
        applyBionicReading()

        if (!document.getElementById(ADHD_STYLE_ID)) {
            const style = document.createElement("style")
            style.id = ADHD_STYLE_ID
            style.textContent = `
                article p, article li, article h1, article h2, article h3, article h4,
                main p, main li, main h1, main h2, main h3, main h4 {
                    opacity: 0.6;
                    transition: opacity 0.25s ease-in-out;
                }
                article p:hover, article li:hover, article h1:hover, article h2:hover, article h3:hover, article h4:hover,
                main p:hover, main li:hover, main h1:hover, main h2:hover, main h3:hover, main h4:hover {
                    opacity: 1.0 !important;
                }
            `
            document.head.appendChild(style)
        }
    } else {
        window.location.reload()
    }
}

function applyBionicReading() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            const parent = node.parentElement;
            if (!node.nodeValue?.trim() || !parent ||
                ['STYLE', 'SCRIPT', 'NOSCRIPT', 'CODE', 'PRE', 'BUTTON'].includes(parent.tagName) ||
                parent.closest('.neuro-bionic') || parent.closest('#' + READER_OVERLAY_ID)) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const textNodes: Node[] = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
        textNodes.push(currentNode);
        currentNode = walker.nextNode();
    }

    textNodes.forEach(node => {
        const text = node.nodeValue;
        if (!text?.trim() || !node.parentNode) return;

        const words = text.split(/(\s+)/);
        const span = document.createElement('span');
        span.className = 'neuro-bionic';

        // Prevent CSS transition bleeding onto our bionic spans
        span.style.cssText = "transition: none !important; animation: none !important;";

        words.forEach(word => {
            if (!word.trim() || word.length === 1) {
                span.appendChild(document.createTextNode(word));
                return;
            }
            const mid = Math.ceil(word.length / 2);
            const b = document.createElement('b');
            b.style.cssText = 'font-weight: 900 !important; color: inherit; transition: none !important;';
            b.textContent = word.substring(0, mid);

            const lightSpan = document.createElement('span');
            lightSpan.style.cssText = 'font-weight: 400 !important; opacity: 0.85 !important; transition: none !important;';
            lightSpan.textContent = word.substring(mid);

            span.appendChild(b);
            span.appendChild(lightSpan);
        });
        node.parentNode.replaceChild(span, node);
    });
}

// -----------------------------------------------------------------------------
// FEATURE B: DYSLEXIC TYPOGRAPHY OVERHAUL (DYNAMIC)
// -----------------------------------------------------------------------------
let isDyslexiaActive = false;

async function updateDyslexiaStyle() {
    if (!isDyslexiaActive) return;

    // Default fallback values
    const font = await storage.get<any>("dyslexiaFont") || "Lexend";
    const weight = await storage.get<any>("dyslexiaWeight") || 400;

    let styleEl = document.getElementById(DYSLEXIA_STYLE_ID);
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = DYSLEXIA_STYLE_ID;
        document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');
      
      * {
        animation: none !important;
        transition: none !important;
      }

      body, article, main, p, h1, h2, h3, h4, span, div, a, li { 
        font-family: '${font}', 'OpenDyslexic', sans-serif !important; 
        font-weight: ${weight} !important;
        letter-spacing: 0.12em !important; 
        word-spacing: 0.16em !important;
        line-height: 1.8 !important; 
        color: #333333 !important;
      }
      
      body, article, main, .post-content { 
        background-color: #FAF8F5 !important; 
      }
    `;
}

function toggleDyslexiaMode(enable: boolean) {
    isDyslexiaActive = enable;
    if (enable) {
        updateDyslexiaStyle();
    } else {
        document.getElementById(DYSLEXIA_STYLE_ID)?.remove();
    }
}

// -----------------------------------------------------------------------------
// FEATURE C: THE ULTIMATE READER OVERLAY
// -----------------------------------------------------------------------------
function toggleReadabilityMode(enable: boolean) {
    if (enable) {
        if (document.getElementById(READER_OVERLAY_ID)) return
        const mainContent = document.querySelector('article') || document.querySelector('main') || document.querySelector('.post-content') || document.body;

        const overlay = document.createElement('div');
        overlay.id = READER_OVERLAY_ID;
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: #faf9f6 !important; z-index: 999999 !important; overflow-y: auto;
            padding: 60px 20px; box-sizing: border-box; backdrop-filter: blur(10px); color: #111827 !important;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 800px; margin: 0 auto; background: white; padding: 50px 80px;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); color: #1a1a1a;
            font-size: 1.15rem; line-height: 1.8; font-family: system-ui, -apple-system, sans-serif;
        `;

        const contentClone = mainContent.cloneNode(true) as HTMLElement;
        contentClone.querySelectorAll('aside, nav, iframe, script, .ad, .banner, style').forEach(n => n.remove());

        const header = document.createElement('div');
        header.innerHTML = '<h3 style="color:#10b981; font-weight:700; margin-bottom: 30px; letter-spacing:1px; text-transform:uppercase; font-size:14px;">✨ Neuro-Assist Reader View Active</h3>';

        container.appendChild(header);
        container.appendChild(contentClone);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    } else {
        document.getElementById(READER_OVERLAY_ID)?.remove();
        document.body.style.overflow = '';
    }
}

// -----------------------------------------------------------------------------
// FEATURE D: EDGE AI SIMPLIFIER + PREMIUM TTS
// -----------------------------------------------------------------------------
document.addEventListener("mouseup", (e) => {
    const containerId = "neuro-assist-floating-container"
    // Escape clause: Ignore clicks on the floating UI itself
    if ((e.target as HTMLElement)?.closest(`#${containerId}`)) {
        return;
    }

    const selection = window.getSelection()?.toString().trim()
    document.getElementById(containerId)?.remove()

    if (selection && selection.length > 15) {
        const container = document.createElement("div")
        container.id = containerId

        // Removed transition from left/top positioning so it snaps instantly to cursor without sliding
        container.style.cssText = `
            position: absolute !important; top: ${e.pageY - 60}px !important; left: ${e.pageX}px !important;
            z-index: 9999999 !important; display: flex !important; gap: 8px !important;
            transition: none !important; animation: none !important;
            background-color: #ffffff !important; padding: 6px !important; border-radius: 14px !important;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2) !important; color: #111827 !important;
        `

        // Keyframe for subtle pop-in
        const popStyles = document.createElement('style');
        popStyles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(popStyles);

        // --- BUTTON 1: THE LOCAL AMD SIMPLIFIER ---
        const btnSimplify = document.createElement("button")
        btnSimplify.innerHTML = "✨ Simplify (Edge AI)"
        btnSimplify.style.cssText = `
            background: linear-gradient(135deg, #10b981, #059669);
            color: white; border: 1px solid #047857; border-radius: 12px;
            padding: 8px 16px; font-weight: 700; cursor: pointer;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); font-family: inherit;
            font-size: 14px; display: flex; align-items: center; white-space: nowrap;
        `
        btnSimplify.onmousedown = (ev) => { ev.stopPropagation(); ev.preventDefault(); }
        btnSimplify.onmouseup = (ev) => { ev.stopPropagation(); ev.preventDefault(); }
        btnSimplify.onclick = async (ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            const currentSelection = selection; // Capture text immediately

            if (btnSimplify.disabled) return;

            const originalHTML = btnSimplify.innerHTML;
            btnSimplify.innerHTML = `<svg style="display:inline; animation:spin 1s linear infinite; margin-right:4px; height:16px; width:16px; color:white;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style="opacity:0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity:0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing locally...`
            btnSimplify.style.background = "linear-gradient(135deg, #6366f1, #4f46e5)"
            btnSimplify.style.borderColor = "#4338ca"
            btnSimplify.style.pointerEvents = "none"
            btnSimplify.disabled = true;

            const restoreButton = () => {
                btnSimplify.innerHTML = originalHTML;
                btnSimplify.style.background = "linear-gradient(135deg, #10b981, #059669)";
                btnSimplify.style.borderColor = "#047857";
                btnSimplify.style.pointerEvents = "auto";
                btnSimplify.disabled = false;
            }

            try {
                if (!chrome?.runtime?.id) throw new Error("Extension context invalidated");

                const data = await new Promise<any>((resolve, reject) => {
                    chrome.runtime.sendMessage({ action: "simplify", text: currentSelection }, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(response);
                        }
                    });
                });

                if (data && data.simplified_text) {
                    const range = window.getSelection()?.getRangeAt(0)
                    if (range) {
                        range.deleteContents()
                        const resultSpan = document.createElement("span")
                        resultSpan.style.cssText = `
                            background: linear-gradient(to right, #ecfdf5, #d1fae5); color: #064e3b;
                            padding: 4px 8px; border-radius: 8px; font-weight: 600;
                            border-bottom: 2px solid #10b981; box-shadow: 0 2px 4px rgba(16,185,129,0.1);
                        `
                        resultSpan.innerText = " " + data.simplified_text + " "
                        range.insertNode(resultSpan)

                        // Phase 2: Simplification History
                        try {
                            const history = await storage.get<any[]>("simplificationHistory") || [];
                            history.unshift({
                                original: currentSelection,
                                simplified: data.simplified_text,
                                url: window.location.href,
                                timestamp: Date.now()
                            });
                            await storage.set("simplificationHistory", history.slice(0, 10));
                        } catch (e) { console.warn("Could not save history", e) }

                        // Phase 4: Track session text
                        activeSessionPairs.push({ original: currentSelection, simplified: data.simplified_text });
                    }
                } else if (data && data.error) {
                    throw new Error("Local LLM Offline");
                }
                setTimeout(() => container.remove(), 2500)
            } catch (err) {
                console.error("Simplification error:", err);
                btnSimplify.innerText = "❌ Processing Failed"
                btnSimplify.style.background = "#ef4444"
                btnSimplify.style.borderColor = "#dc2626"
                setTimeout(() => {
                    restoreButton();
                }, 3000)
            }
        }

        // --- BUTTON 2: THE PREMIUM TEXT-TO-SPEECH ---
        const ttsControls = document.createElement("div")
        ttsControls.style.cssText = `
            display: flex; gap: 2px; background: #111827 !important; border-radius: 12px; padding: 4px;
            border: 1px solid #374151; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); align-items: center;
        `

        const btnPlay = document.createElement("button")
        btnPlay.innerHTML = "▶️"
        btnPlay.style.cssText = "background: transparent; color: white; border: none; cursor: pointer; padding: 4px 8px; font-size: 14px; border-radius: 6px; transition: background 0.1s;"
        btnPlay.onmouseover = () => btnPlay.style.background = "#374151"
        btnPlay.onmouseout = () => btnPlay.style.background = "transparent"

        const btnPause = document.createElement("button")
        btnPause.innerHTML = "⏸️"
        btnPause.style.cssText = "background: transparent; color: white; border: none; cursor: pointer; padding: 4px 8px; font-size: 14px; border-radius: 6px; transition: background 0.1s;"
        btnPause.onmouseover = () => btnPause.style.background = "#374151"
        btnPause.onmouseout = () => btnPause.style.background = "transparent"

        const btnStop = document.createElement("button")
        btnStop.innerHTML = "⏹️"
        btnStop.style.cssText = "background: transparent; color: white; border: none; cursor: pointer; padding: 4px 8px; font-size: 14px; border-radius: 6px; transition: background 0.1s;"
        btnStop.onmouseover = () => btnStop.style.background = "#374151"
        btnStop.onmouseout = () => btnStop.style.background = "transparent"

        ttsControls.appendChild(btnPlay)
        ttsControls.appendChild(btnPause)
        ttsControls.appendChild(btnStop)

        function blockEvents(btn: HTMLButtonElement) {
            btn.onmousedown = (ev) => { ev.stopPropagation(); ev.preventDefault(); }
            btn.onmouseup = (ev) => { ev.stopPropagation(); ev.preventDefault(); }
        }
        [btnPlay, btnPause, btnStop].forEach(blockEvents);

        let containerSpan: HTMLSpanElement | null = null;

        btnPlay.onclick = (ev) => {
            ev.stopPropagation()
            ev.preventDefault()

            if (!('speechSynthesis' in window)) {
                alert("Browser unsupported for TTS");
                return;
            }

            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                return;
            }
            if (window.speechSynthesis.speaking) return;

            // Extract native text selection and wrap it to inject dynamic <mark> tags
            const range = window.getSelection()?.getRangeAt(0);
            if (range && !containerSpan) {
                containerSpan = document.createElement("span");
                containerSpan.style.cssText = "color: inherit; background: transparent;";
                containerSpan.textContent = selection;
                range.deleteContents();
                range.insertNode(containerSpan);
            }

            const utterance = new SpeechSynthesisUtterance(selection);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            utterance.onboundary = (event) => {
                if (event.name === 'word' && containerSpan) {
                    const before = selection.substring(0, event.charIndex);
                    // Approximate word length extraction
                    const substr = selection.substring(event.charIndex);
                    const match = substr.match(/^\\S+/);
                    const wordLen = match ? match[0].length : (event.charLength || 1);

                    const word = selection.substring(event.charIndex, event.charIndex + wordLen);
                    const after = selection.substring(event.charIndex + wordLen);

                    containerSpan.innerHTML = `${before}<mark style="background-color: #fef08a !important; color: #111827 !important; border-radius: 2px !important; padding: 0 2px !important;">${word}</mark>${after}`;
                }
            };

            utterance.onend = () => {
                if (containerSpan) {
                    containerSpan.innerHTML = selection; // strip highlights
                }
                setTimeout(() => container.remove(), 2000);
            };

            window.speechSynthesis.speak(utterance);
        }

        btnPause.onclick = (ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            window.speechSynthesis.pause();
        }

        btnStop.onclick = (ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            window.speechSynthesis.cancel();
            if (containerSpan) {
                containerSpan.innerHTML = selection; // strip highlights
            }
        }

        container.appendChild(btnSimplify)
        container.appendChild(ttsControls)
        document.body.appendChild(container)
    }
})
