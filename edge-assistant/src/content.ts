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
        dyslexiaMode: (c) => toggleDyslexiaMode(c.newValue),
        adhdMode: (c) => toggleBionicReading(c.newValue),
        readabilityMode: (c) => toggleReadabilityMode(c.newValue)
    })
} catch (e) {
    console.warn("Storage watch failed, context may be invalid:", e);
}

window.addEventListener("load", async () => {
    try {
        if (!chrome?.runtime?.id) return;
        if (await storage.get("dyslexiaMode")) toggleDyslexiaMode(true)
        if (await storage.get("adhdMode")) toggleBionicReading(true)
        if (await storage.get("readabilityMode")) toggleReadabilityMode(true)
    } catch (e) {
        console.warn("Could not load storage on boot", e);
    }
})

// -----------------------------------------------------------------------------
// FEATURE A: BIONIC READING + READING RULER (ADHD Focus)
// -----------------------------------------------------------------------------
function toggleBionicReading(enable: boolean) {
    if (enable) {
        applyBionicReading()

        // Reading Ruler CSS
        if (!document.getElementById(ADHD_STYLE_ID)) {
            const style = document.createElement("style")
            style.id = ADHD_STYLE_ID
            style.textContent = `
                article p, article li, article h1, article h2, article h3, article h4,
                main p, main li, main h1, main h2, main h3, main h4 {
                    opacity: 0.4;
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

        words.forEach(word => {
            if (!word.trim() || word.length === 1) {
                span.appendChild(document.createTextNode(word));
                return;
            }
            const mid = Math.ceil(word.length / 2);
            const b = document.createElement('b');
            b.style.fontWeight = '900';
            b.style.color = 'inherit';
            b.textContent = word.substring(0, mid);

            const lightSpan = document.createElement('span');
            lightSpan.style.fontWeight = '400';
            lightSpan.style.opacity = '0.85';
            lightSpan.textContent = word.substring(mid);

            span.appendChild(b);
            span.appendChild(lightSpan);
        });
        node.parentNode.replaceChild(span, node);
    });
}

// -----------------------------------------------------------------------------
// FEATURE B: DYSLEXIC TYPOGRAPHY OVERHAUL
// -----------------------------------------------------------------------------
function toggleDyslexiaMode(enable: boolean) {
    if (enable) {
        if (document.getElementById(DYSLEXIA_STYLE_ID)) return
        const style = document.createElement("style")
        style.id = DYSLEXIA_STYLE_ID
        style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap');
      
      * {
        transition: none !important;
        animation: none !important;
      }

      body, article, main, p, h1, h2, h3, h4, span, div, a, li { 
        font-family: 'Lexend', 'OpenDyslexic', sans-serif !important; 
        letter-spacing: 0.12em !important; 
        word-spacing: 0.16em !important;
        line-height: 1.8 !important; 
      }
      
      body { 
        background-color: #FDF6E3 !important; 
        color: #333333 !important; 
      }
    `
        document.head.appendChild(style)
    } else {
        document.getElementById(DYSLEXIA_STYLE_ID)?.remove()
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
            background-color: #faf9f6; z-index: 2147483646; overflow-y: auto;
            padding: 60px 20px; box-sizing: border-box; backdrop-filter: blur(10px);
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
// FEATURE D: EDGE AI SIMPLIFIER (The AMD Hardware Flex)
// -----------------------------------------------------------------------------
document.addEventListener("mouseup", (e) => {
    const selection = window.getSelection()?.toString().trim()
    const btnId = "neuro-assist-simplify-btn"
    document.getElementById(btnId)?.remove()

    if (selection && selection.length > 15) {
        const btn = document.createElement("button")
        btn.id = btnId
        btn.innerHTML = "✨ Simplify (Edge AI)"
        btn.style.cssText = `
            position: absolute; top: ${e.pageY - 50}px; left: ${e.pageX}px;
            z-index: 2147483647; background: linear-gradient(135deg, #10b981, #059669);
            color: white; border: 1px solid #047857; border-radius: 12px;
            padding: 8px 16px; font-weight: 700; cursor: pointer;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); font-family: inherit;
            font-size: 14px; transition: all 0.2s ease-out; display: flex; align-items: center;
        `

        btn.onmouseover = () => btn.style.transform = 'translateY(-2px)';
        btn.onmouseout = () => btn.style.transform = 'translateY(0)';

        btn.addEventListener("click", async () => {
            btn.innerText = "⏳ Processing locally..."
            btn.style.background = "linear-gradient(135deg, #6366f1, #4f46e5)"
            btn.style.borderColor = "#4338ca"
            btn.style.pointerEvents = "none"

            try {
                if (!chrome?.runtime?.id) {
                    throw new Error("Extension context invalidated");
                }
                chrome.runtime.sendMessage({ action: "simplify", text: selection }, (data) => {
                    if (chrome.runtime.lastError) {
                        btn.innerText = "❌ Please refresh page"
                        btn.style.background = "#ef4444"
                        console.warn("Message channel closed or context invalid:", chrome.runtime.lastError);
                        setTimeout(() => btn.remove(), 2500)
                        return;
                    }

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
                        }
                    } else if (data && data.error) {
                        btn.innerText = "❌ Local LLM Offline"
                        btn.style.background = "#ef4444"
                    }
                    setTimeout(() => btn.remove(), 2500)
                })
            } catch (err) {
                btn.innerText = "❌ Please refresh page"
                btn.style.background = "#ef4444"
                console.warn("Extension context invalidated:", err);
                setTimeout(() => btn.remove(), 2500)
            }
        })
        document.body.appendChild(btn)
    }
})
