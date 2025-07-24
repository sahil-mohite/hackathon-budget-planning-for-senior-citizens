// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            header: {
                app_title: "BudgetWise",
                app_title_full: "Your Smart Budget Assistant"
            },
            language: {
                select_placeholder: "Select language",
                select_title: "Select Your Language",
                current: "Current Language:",
                en: { name: "English", native: "English" },
                de: { name: "German", native: "Deutsch" },
                hi: { name: "Hindi", native: "हिन्दी" }
            },
            welcome: {
                title: "Welcome to BudgetWise Senior",
                description: "Manage your monthly budget effortlessly with voice assistance and AI-powered insights designed specifically for seniors.",
                get_started: "Get Started with Voice",
                quick_start: "Quick Start Tips",
                step1: "Click \"Voice Input\" and tell us about your monthly income and expenses",
                step2: "View your personalized dashboard with spending insights",
                step3: "Track your spending history and get AI-powered recommendations"
            },
            features: {
                voice: {
                    title: "Voice Control",
                    description: "Simply speak your expenses - no typing needed"
                },
                insights: {
                    title: "Smart Insights",
                    description: "AI-powered budget analysis and recommendations"
                },
                secure: {
                    title: "Secure & Private",
                    description: "Your financial data is protected and private"
                },
                language: {
                    title: "Multi-Language",
                    description: "Available in your preferred language"
                }
            },
            calculator: {
                title: "Budget Calculator",
                subtitle: "Enter your income and expenses to see your budget balance",
                income: {
                    title: "Monthly Income",
                    label: "Total Monthly Income ($)",
                    placeholder: "Enter your monthly income"
                },
                expenses: {
                    title: "Monthly Expenses",
                    name_placeholder: "Category name",
                    amount_placeholder: "Amount",
                    add: "Add Category"
                },
                calculate: "Calculate Budget",
                result: {
                    remaining: "Remaining Budget",
                    deficit: "Budget Deficit",
                    positive_note: "Great! You're within budget.",
                    negative_note: "Consider reducing expenses or increasing income."
                },
                default: {
                    housing: "Housing",
                    food: "Food",
                    utilities: "Utilities",
                    healthcare: "Healthcare",
                    transportation: "Transportation"
                }
            },
            help: {
                title: "Help & Support",
                subtitle: "Get help using BudgetWise Senior",
                voice_title: "How to Use Voice Input",
                voice_steps: [
                    "Click the microphone button",
                    "Speak clearly about your expenses",
                    'Example: "I spent $50 on groceries"',
                    "The AI will organize your data"
                ],
                dashboard_title: "Understanding Your Dashboard",
                dashboard_steps: [
                    "View spending by category",
                    "See trends with colored arrows",
                    "Track monthly savings",
                    "Monitor remaining budget"
                ]
            }


        },
    },
    hi: {
        translation: {
            header: {
                app_title: "बजटवाइज़",
                app_title_full: "आपका स्मार्ट बजट सहायक"
            },
            language: {
                select_placeholder: "भाषा चुनें",
                select_title: "अपनी भाषा चुनें",
                current: "वर्तमान भाषा:",
                en: { name: "अंग्रेज़ी", native: "English" },
                de: { name: "जर्मन", native: "Deutsch" },
                hi: { name: "हिंदी", native: "हिन्दी" }
            },
            welcome: {
                title: "बजटवाइज़ सीनियर में आपका स्वागत है",
                description: "बुजुर्गों के लिए डिज़ाइन की गई वॉयस सहायता और एआई-पावर्ड इनसाइट्स के साथ अपना मासिक बजट आसानी से प्रबंधित करें।",
                get_started: "वॉयस के साथ शुरू करें",
                quick_start: "त्वरित प्रारंभ युक्तियाँ",
                step1: "\"वॉयस इनपुट\" पर क्लिक करें और अपनी आय व खर्च बताएं",
                step2: "अपना वैयक्तिक डैशबोर्ड देखें जिसमें खर्च की जानकारी हो",
                step3: "अपने खर्च का इतिहास ट्रैक करें और AI से सुझाव पाएं"
            },
            features: {
                voice: {
                    title: "वॉयस कंट्रोल",
                    description: "सिर्फ बोलें, टाइपिंग की जरूरत नहीं"
                },
                insights: {
                    title: "स्मार्ट इनसाइट्स",
                    description: "एआई आधारित बजट विश्लेषण और सुझाव"
                },
                secure: {
                    title: "सुरक्षित और निजी",
                    description: "आपका वित्तीय डेटा पूरी तरह सुरक्षित है"
                },
                language: {
                    title: "बहुभाषी सुविधा",
                    description: "आपकी पसंदीदा भाषा में उपलब्ध"
                }
            },
            calculator: {
                title: "बजट कैलकुलेटर",
                subtitle: "अपनी आय और खर्च दर्ज करें और बजट शेष देखें",
                income: {
                    title: "मासिक आय",
                    label: "कुल मासिक आय (₹)",
                    placeholder: "अपनी मासिक आय दर्ज करें"
                },
                expenses: {
                    title: "मासिक खर्च",
                    name_placeholder: "श्रेणी का नाम",
                    amount_placeholder: "राशि",
                    add: "श्रेणी जोड़ें"
                },
                calculate: "बजट की गणना करें",
                result: {
                    remaining: "बचा हुआ बजट",
                    deficit: "बजट घाटा",
                    positive_note: "शानदार! आप बजट के भीतर हैं।",
                    negative_note: "खर्च कम करने या आय बढ़ाने पर विचार करें।"
                },
                default: {
                    housing: "आवास",
                    food: "खाद्य",
                    utilities: "यूटिलिटी सेवाएँ",
                    healthcare: "स्वास्थ्य सेवा",
                    transportation: "परिवहन"
                }
            },
            help: {
  title: "सहायता और समर्थन",
  subtitle: "बजटवाइज़ सीनियर का उपयोग करने में सहायता प्राप्त करें",
  voice_title: "वॉयस इनपुट का उपयोग कैसे करें",
  voice_steps: [
    "माइक्रोफ़ोन बटन पर क्लिक करें",
    "अपने खर्च के बारे में स्पष्ट रूप से बोलें",
    'उदाहरण: "मैंने ₹500 किराने पर खर्च किए"',
    "AI आपके डेटा को व्यवस्थित करेगा"
  ],
  dashboard_title: "अपने डैशबोर्ड को समझना",
  dashboard_steps: [
    "श्रेणी के अनुसार खर्च देखें",
    "रुझान रंगीन तीरों से देखें",
    "मासिक बचत ट्रैक करें",
    "शेष बजट की निगरानी करें"
  ]
}


        },
    },
    de: {
        translation: {
            header: {
                app_title: "BudgetWeise",
                app_title_full: "Ihr intelligenter Budget-Assistent"
            },
            language: {
                select_placeholder: "Sprache auswählen",
                select_title: "Wählen Sie Ihre Sprache",
                current: "Aktuelle Sprache:",
                en: { name: "Englisch", native: "English" },
                de: { name: "Deutsch", native: "Deutsch" },
                hi: { name: "Hindi", native: "hindi" }
            },
            welcome: {
                title: "Willkommen bei BudgetWise Senior",
                description: "Verwalten Sie Ihr Monatsbudget mühelos mit Sprachsteuerung und KI-basierten Einblicken – speziell für Senioren.",
                get_started: "Mit Sprache starten",
                quick_start: "Schnellstart-Tipps",
                step1: "Klicken Sie auf „Spracheingabe“ und erzählen Sie uns von Ihrem Einkommen und Ihren Ausgaben",
                step2: "Sehen Sie Ihr persönliches Dashboard mit Ausgabenanalysen",
                step3: "Verfolgen Sie Ihre Ausgabenhistorie und erhalten Sie KI-Empfehlungen"
            },
            features: {
                voice: {
                    title: "Sprachsteuerung",
                    description: "Einfach Ausgaben sprechen – kein Tippen nötig"
                },
                insights: {
                    title: "Intelligente Einblicke",
                    description: "KI-basierte Budgetanalyse und Empfehlungen"
                },
                secure: {
                    title: "Sicher & Privat",
                    description: "Ihre finanziellen Daten sind geschützt und privat"
                },
                language: {
                    title: "Mehrsprachig",
                    description: "Verfügbar in Ihrer bevorzugten Sprache"
                }
            },
            calculator: {
                title: "Budgetrechner",
                subtitle: "Geben Sie Ihr Einkommen und Ihre Ausgaben ein, um Ihr Budget zu berechnen",
                income: {
                    title: "Monatliches Einkommen",
                    label: "Gesamte monatliche Einnahmen (€)",
                    placeholder: "Geben Sie Ihr monatliches Einkommen ein"
                },
                expenses: {
                    title: "Monatliche Ausgaben",
                    name_placeholder: "Kategoriename",
                    amount_placeholder: "Betrag",
                    add: "Kategorie hinzufügen"
                },
                calculate: "Budget berechnen",
                result: {
                    remaining: "Verbleibendes Budget",
                    deficit: "Budgetdefizit",
                    positive_note: "Super! Sie sind im Budget.",
                    negative_note: "Reduzieren Sie Ausgaben oder erhöhen Sie das Einkommen."
                },
                default: {
                    housing: "Wohnen",
                    food: "Lebensmittel",
                    utilities: "Nebenkosten",
                    healthcare: "Gesundheitswesen",
                    transportation: "Transport"
                }
            },
            help: {
  title: "Hilfe & Unterstützung",
  subtitle: "Erhalten Sie Hilfe zur Nutzung von BudgetWise Senior",
  voice_title: "So verwenden Sie die Spracheingabe",
  voice_steps: [
    "Klicken Sie auf das Mikrofon-Symbol",
    "Sprechen Sie klar über Ihre Ausgaben",
    'Beispiel: "Ich habe 50 € für Lebensmittel ausgegeben"',
    "Die KI organisiert Ihre Daten"
  ],
  dashboard_title: "Das Dashboard verstehen",
  dashboard_steps: [
    "Ausgaben nach Kategorie anzeigen",
    "Trends mit farbigen Pfeilen erkennen",
    "Monatliche Ersparnisse verfolgen",
    "Verbleibendes Budget überwachen"
  ]
}


        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
