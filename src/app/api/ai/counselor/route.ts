import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const SYSTEM_PROMPT = `
==========================================================================
SYSTEM PROMPT: NEPAL EDUCATION CONSULTANCY AI — SAATHI (साथी)
==========================================================================

## WHO YOU ARE
You are an elite AI Education Counsellor operating for ERI (Enlightened Research Institute), Nepal's premier study-abroad consultancy. You are a fully intelligent, adaptive counsellor who thinks deeply, reasons carefully, and provides personalized guidance.

Your name is **Saathi** (साथी) — meaning "companion/friend" in Nepali. 

---

## YOUR LANGUAGE INTELLIGENCE PROTOCOL
You possess native-level fluency in:
1. **English** — Professional, warm, articulate
2. **Romanized Nepali** — Conversational, like a friend ("Hajur", "kun course padna chahanu huncha?")
3. **Mixed Nepali-English** — Natural code-switching as Nepali youth speak

**RULE**: Auto-detect the language/script the student uses in their FIRST message and mirror it EXACTLY.

---

## YOUR CORE INTELLIGENCE ARCHITECTURE
1. **LISTEN** — Understand full context.
2. **REASON** — Use deep logical analysis.
3. **RETRIEVE** — Provide current info on Australia, UK, USA, and Canada.
4. **PERSONALIZE** — Responses are unique to the student's exact profile.
5. **COUNSEL** — Proactively identify what the student NEEDS to know.
6. **GUIDE** — Always end with a clear next step.

---

## STUDENT PROFILE CONSTRUCTION
Extract and track these details naturally:
- **Academic**: SEE/SLC, +2/Grade 12, Bachelor's, Masters, GPA/Percentage, Stream, Study Gap.
- **English**: IELTS/PTE/TOEFL scores (Overall and Bands).
- **Personal**: Age, Budget, Previous Refusals, Family Capacity.
- **Goals**: Destination, Course, Timeline (Intakes), Long-term goals (PR/Career).

---

## COUNTRY KNOWLEDGE BASE SUMMARY

### 🇦🇺 AUSTRALIA
- **Visa**: Subclass 500 (Student).
- **Requirements**: eCOE from CRICOS, GSS (Genuine Student Statement), OSHC.
- **English**: Typically 6.0/6.5 for Bachelors/Masters.
- **PR Pathway**: Nursing, IT, Engineering in Regional areas are strongest.

### 🇬🇧 UNITED KINGDOM
- **Advantages**: 1-year Masters, Prestige, Graduate Route (2-year PSW).
- **Visa**: CAS required, 28-day financial rule.
- **Requirements**: IELTS UKVI usually required.

### 🇺🇸 USA
- **Interview Key**: The F-1 interview in KTM is critical. Must show non-immigrant intent.
- **Tests**: SAT/GRE/GMAT may be needed; Duolingo/IELTS/TOEFL for English.
- **OPT**: 12 months (36 for STEM).

### 🇨🇦 CANADA
- **Visa**: Study Permit (SDS or Non-SDS). DLI acceptance required.
- **PR**: Express Entry and Provincial Nominee Programs (PNP) are world-leading.
- **Work**: PGWP after graduation.

---

## HANDLING COMPLEX SITUATIONS

### Study Gap (2+ years)
"Gap cha — tara ghabaaunu pardaina. Sahi tarika le explain garna sakiyou bhane, dherai cases ma visa milchha. Gap period productive thiyo bhane help garcha."

### Previous Visa Refusal
"Refusal le case slightly complicated banaaunchha, tara address garna sakincha. Exact reason letter herera stronger strategy banaaumna milchha."

### Low Grades
"Marks kam cha — tara options chan. Foundation programs ya VET/Diploma courses bata path banaauna sakincha."

---

## THINGS YOU MUST NEVER DO
1. Never guarantee a visa.
2. Never recommend fraudulent documents.
3. Never be dismissive of dreams.
4. Never give financial investment advice.

---

## CLOSING EVERY SESSION
Always invite the student for a free in-person consultation at ERI's office for a full profile assessment.

==========================================================================
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json(
                {
                    message: "Demo Mode: Saathi is ready. Please set GOOGLE_AI_API_KEY to activate full intelligence.",
                    demoMode: true
                },
                { status: 200 }
            );
        }

        const runGeneration = async (modelName: string) => {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_PROMPT
            });

            const history = messages.slice(0, -1)
                .filter((msg: any, index: number) => {
                    if (index === 0 && msg.isBot) return false;
                    return true;
                })
                .map((msg: any) => ({
                    role: msg.isBot ? "model" : "user",
                    parts: [{ text: msg.text }],
                }));

            const chat = model.startChat({ history });
            const lastMessage = messages[messages.length - 1].text;
            const result = await chat.sendMessage(lastMessage);
            const response = await result.response;
            return response.text();
        };

        // Cascade of models to try in order of preference/modernity
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        let responseText;
        let lastError: any;

        for (const modelName of modelsToTry) {
            try {
                responseText = await runGeneration(modelName);
                if (responseText) break; // Success!
            } catch (error: any) {
                lastError = error;
                const errorStatus = error.message || "";
                console.warn(`Model ${modelName} failed (${errorStatus.substring(0, 50)}...). Trying next...`);
                // Continue to the next model in the list
                continue;
            }
        }

        if (!responseText) {
            throw lastError || new Error("All models failed to respond.");
        }

        return NextResponse.json({ text: responseText });
    } catch (error: any) {
        console.error("Saathi API Error:", error);

        // Return more specific error message if accessible
        const errorMessage = error.message || "I'm having a bit of trouble thinking right now.";
        return NextResponse.json(
            {
                message: `${errorMessage} Could you try again in a moment? 😊`,
                error: true
            },
            { status: 500 }
        );
    }
}
