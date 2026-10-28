import React, { useState, useMemo } from "react";
import { useData } from "../components/DataContext"; // Adjust path if necessary
import { useNavigate } from "react-router-dom";
// STRONGER TIME FORMATTER TO HANDLE ISO STRINGS AND WEIRD DATA
const formatTimeAMPM = (timeVal) => {
  if (timeVal == null || timeVal === "") return "NO"; // Fallback
  let timeStr = String(timeVal).trim();
  if (timeStr.includes("T")) {
    timeStr = timeStr.split("T")[1].substring(0, 5);
  }

  if (
    timeStr.toLowerCase().includes("am") ||
    timeStr.toLowerCase().includes("pm")
  ) {
    return timeStr;
  }

  if (timeStr.includes(":")) {
    const [hourString, minuteString] = timeStr.split(":");
    if (hourString != null && minuteString != null) {
      let hours = parseInt(hourString, 10);
      const minutes = minuteString.substring(0, 2);
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      return `${hours}:${minutes} ${ampm}`;
    }
  }

  return timeStr;
};

// --- TRANSLATIONS DICTIONARY ---
const translations = {
  EN: {
    title: "Leela Bazar",
    freeService:
      "Leela Bazar Service is free. We provide fast satta Matka results for all markets. Check your daily lucky numbers and live updates here.",
    goldenAnk: "Golden Ank",
    finalAnk: "Final Ank",
    warning:
      "Kalyan Matka, Matka Chart, Bombay Matka, Satta King & Live Updates available here. Check our page daily for fast results.",
    liveResult: "LIVE RESULT",
    fastestResult: "Fastest Live Result Found Here",
    loading: "Loading...",
    dataLoading: "Loading...",
    open: "Open",
    close: "Close",
    jodiChart: "Jodi Chart",
    panelChart: "Panel Chart",
    notice: "★ NOTICE ★",
    noticeText:
      "The result shown here is for entertainment only. You will be responsible for any kind of loss.",
    fastestService: "WORLD & INDIA MOST FASTEST SATTA RESULT SERVICE",
    disclaimerTitle: "⚠ Disclaimer",
    disclaimerText:
      "This is a non-commercial website. All information available here is based on the internet, numerology, and astrology for information purposes only. We are not directly or indirectly associated with any illegal satta matka/gambling operations. If betting is illegal in your region, please use this site at your own risk.",
    thanks: "Thank You",
    terms: "Terms & Conditions",
    service: "Service",
    footer: "Leela Bazar © 2025 | Fastest Satta Matka Results",
  },
  HI: {
    title: "लीला बाज़ार",
    freeService:
      "लीला बाज़ार सेवा मुफ़्त है। हम सभी बाज़ारों के लिए तेज़ सट्टा मटका परिणाम प्रदान करते हैं। अपने दैनिक लकी नंबर और लाइव अपडेट यहां देखें।",
    goldenAnk: "गोल्डन अंक",
    finalAnk: "फाइनल अंक",
    warning:
      "कल्याण मटका, मटका चार्ट, बॉम्बे मटका, सट्टा किंग & लाइव अपडेट यहाँ उपलब्ध। फास्ट रिजल्ट देखने के लिए हमारा पेज रोज़ चेक करें।",
    liveResult: "लाइव रिजल्ट",
    fastestResult: "सबसे तेज़ लाइव रिजल्ट यहीं मिलेगा",
    loading: "लोड हो रहा है...",
    dataLoading: "डेटा लोड हो रहा है...",
    open: "ओपन",
    close: "क्लोज़",
    jodiChart: "जोड़ी चार्ट",
    panelChart: "पैनल चार्ट",
    notice: "★ सूचना ★",
    noticeText:
      "यहां दिखाया गया रिजल्ट केवल मनोरंजन के लिए है। किसी भी प्रकार के नुकसान के लिए आप स्वयं जिम्मेदार होंगे।",
    fastestService: "विश्व और भारत की सबसे तेज़ सट्टा रिजल्ट सेवा",
    disclaimerTitle: "⚠ डिस्क्लेमर ( Disclaimer )",
    disclaimerText:
      "यह एक नॉन-कमर्शियल (गैर-व्यावसायिक) वेबसाइट है। यहाँ उपलब्ध सभी जानकारी इंटरनेट, न्यूमरोलॉजी और ज्योतिष के आधार पर केवल जानकारी (Information Purpose) के लिए प्रदर्शित की जाती है। हम सट्टा मटका / जुआ / बेटिंग / गैम्बलिंग के किसी भी अवैध कार्य से सीधा या अप्रत्यक्ष रूप से जुड़े नहीं हैं और न ही किसी प्रकार का सट्टा मटका संचालन करते हैं। यदि आपके देश या राज्य में सट्टा मटका अवैध है, तो कृपया अपने जोखिम और समझ के अनुसार ही इस वेबसाइट का उपयोग करें।",
    thanks: "धन्यवाद ।",
    terms: "नियम एवं शर्तें",
    service: "सेवाएं",
    footer: "लीला बाज़ार © 2025 | सबसे तेज़ सट्टा मटका रिजल्ट",
  },
};

export default function Home() {
  const { data, loading, refetch } = useData();
  const navigate = useNavigate();

  // --- NEW STATES FOR DARK MODE AND LANGUAGE ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("HI"); // Default to Hindi

  const t = translations[language]; // Quick reference for active language strings

  // Helper function to translate and format Market Names
  const getMarketName = (name, language) => {
    if (!name) return language === "HI" ? "मार्केट नाम" : "MARKET NAME";

    // Force English name to always be UPPERCASE
    const cleanName = name.trim().toUpperCase();

    // If the language is English, just return the uppercase name
    if (language === "EN") return cleanName;

    // Hindi Translations Map
    const hindiNames = {
      "KALYAN": "कल्याण",
      "SYNDICATE NIGHT": "सिंडिकेट नाइट",
      "LEELA BAZAR": "लीला बाज़ार",
      "RAJDHANI NIGHT": "राजधानी नाइट",
      "SHAKTIMAAN": "शक्तिमान",
      "MORNING SYNDICATE": "मॉर्निंग सिंडिकेट",
      "KALYAN MORNING": "कल्याण मॉर्निंग",
    };

    // Return the Hindi name if it exists, otherwise fallback to the English uppercase name
    return hindiNames[cleanName] || cleanName;
  };
  // --- DYNAMIC THEME CLASSES ---
  const theme = {
    bg: isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black",
    header: isDarkMode
      ? "bg-gray-800 border-b border-gray-700"
      : "bg-orange-200",
    textPrimary: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-800",
    card: isDarkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200",
    marketCard: isDarkMode
      ? "bg-gray-800 border-gray-600"
      : "bg-orange-100 border-orange-200",
    noticeBox: isDarkMode
      ? "bg-gray-800 border-orange-500 text-orange-200"
      : "bg-orange-300 border-orange-400 text-black",
    warningBox: isDarkMode
      ? "bg-gray-800 border-red-500 text-gray-200"
      : "bg-orange-700 border-orange-400 text-white",
    footer: isDarkMode
      ? "bg-gray-800 text-gray-400"
      : "bg-gray-200 text-gray-600",
  };

  const { goldenAnk, finalAnk, uniqueData } = useMemo(() => {
    let gAnk = "***";
    let fAnk = "***";
    let filteredList = [];

    // Helper to format Golden/Final string safely allowing '0' values
    const formatSafeAnk = (row) => {
      if (!row) return "***";
      const j = row.Jodi != null && row.Jodi !== "" ? row.Jodi : "";
      const m = row.Marks != null && row.Marks !== "" ? row.Marks : "";
      const p = row.Pennel != null && row.Pennel !== "" ? row.Pennel : "";
      return `${j} - ${m} - ${p}`;
    };

    if (data && data.length > 0) {
      const goldenRow = data.find(
        (item) => item.Name && item.Name.toLowerCase() === "golden",
      );
      const finalRow = data.find(
        (item) => item.Name && item.Name.toLowerCase() === "final",
      );

      gAnk = goldenRow ? formatSafeAnk(goldenRow) : data[0]?.GoldenAnk || "***";
      fAnk = finalRow ? formatSafeAnk(finalRow) : data[0]?.FinalAnk || "***";

      filteredList = data.reverse().filter((item, index, self) => {
        if (!item.Name) return false;
        const nameLower = item.Name.toLowerCase();
        if (nameLower === "golden" || nameLower === "final") return false;
        return index === self.findIndex((t) => t.Name === item.Name);
      });
    }

    return { goldenAnk: gAnk, finalAnk: fAnk, uniqueData: filteredList };
  }, [data]);

  return (
    <div
      className={`${theme.bg} min-h-screen select-none font-sans transition-colors duration-100`}
    >
      {/* Refresh Button */}
      <button
        title="Refresh Data"
        onClick={() => refetch(true)}
        className="fixed bottom-3 z-50 right-4 bg-blue-900 mb-4 text-blue-700 px-3 py-3 rounded-full shadow-lg hover:bg-blue-800 transition transform flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-6 h-6 text-white ${loading ? "animate-spin" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>

      {/* HEADER */}
      <header
        className={`${theme.header} z-40 mx-1.5 left-0 w-[97vw] md:w-[98vw] mt-2 shadow-md rounded-b-xl transition-colors duration-300`}
      >
        <div className="p-2 ">
          <div className="flex justify-between items-center">
            {/* LEFT PROFILE BUTTON */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <img
                src="Logo.png"
                alt="Logo"
                className="w-11 h-11 rounded-full shadow-md"
              />
              <p
                className={`font-extrabold font-arial text-2xl md:text-3xl ${theme.textPrimary}`}
              >
                {t.title}
              </p>
            </div>

            {/* RIGHT SIDE: TOGGLES (Language & Theme) */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
                className={`font-bold px-3 py-2 rounded-lg shadow-sm text-sm border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-orange-300 text-orange-700"}`}
              >
                {language === "EN" ? "हिन्दी" : "ENG"}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${isDarkMode ? "bg-gray-700 border-gray-600 text-yellow-400" : "bg-white border-orange-300 text-gray-800"}`}
              >
                {isDarkMode ? (
                  // Sun Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                ) : (
                  // Moon Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="md:flex md:justify-center">
        {/* NOTICE */}
        <div
          className={`${theme.noticeBox} mt-2 mx-2 p-3 font-sans text-justify md:w-full text-center rounded-lg text-[13px] md:text-[16px] leading-5 border transition-colors duration-300`}
        >
          {t.freeService}
        </div>

        {/* GOLDEN & FINAL ANK */}
        <div
          className={`mx-2 mt-2 p-2 rounded-2xl md:w-full shadow-lg border ${theme.card} transition-colors duration-300`}
        >
          <div className="flex items-center justify-between">
            {/* GOLDEN ANK */}
            <div className="text-left">
              <b className={`text-base font-bold ${theme.textPrimary}`}>
                {t.goldenAnk}
              </b>
              <p 
                className={`font-extrabold text-pink-600 transition-all duration-300 ${
                  loading ? "text-sm animate-pulse mt-1" : "text-2xl"
                }`}
              >
                {loading ? t.loading : goldenAnk}
              </p>
            </div>

            {/* FINAL ANK */}
            <div className="text-right">
              <b className={`text-base font-bold ${theme.textPrimary}`}>
                {t.finalAnk}
              </b>
              <p 
                className={`font-extrabold text-pink-600 transition-all duration-300 ${
                  loading ? "text-sm animate-pulse mt-1" : "text-2xl"
                }`}
              >
                {loading ? t.loading : finalAnk}
              </p>
            </div>
          </div>
        </div>
        {/* WARNING BOX */}
        <div
          className={`${theme.warningBox} font-normal px-3 py-2 mx-2 mt-2 md:w-full text-justify text-center rounded-lg text-[13px] md:text-[16px] leading-5 border transition-colors duration-300`}
        >
          {t.warning}
        </div>
      </section>

      {/* LIVE RESULT HEADER */}
      <section className="bg-blue-900 text-white py-2 mx-2 rounded-2xl mt-2 text-lg font-bold shadow flex items-center justify-center gap-3">
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-green-100 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
        <span>{t.liveResult}</span>
      </section>

      {/* FASTEST UPDATE TEXT */}
      <div className="justify-center flex mt-2">
        <b className={`text-lg font-extrabold ${theme.textSecondary}`}>
          {t.fastestResult}
        </b>
      </div>

    {/* DYNAMIC CONTENT AREA */}
      <main className="mb-3 mt-4 mx-2">
        <div className="flex flex-wrap gap-4 w-full mx-auto">
          {loading && uniqueData.length === 0 ? (
            [
              "LEELA BAZAR",
              "SYNDICATE NIGHT",
              "MORNING SYNDICATE",
              "KALYAN",
              "SHAKTIMAAN",
              "RAJDHANI NIGHT"
            ].map((dummyName, index) => (
              <div
                key={`skeleton-${index}`}
                className={`${theme.marketCard} rounded-2xl shadow-md p-2 w-full md:w-[32.5%] text-center border transition-colors duration-300 animate-pulse`}
              >
                <div>
                  {/* Keep the actual market name visible while loading */}
                  <h3 className={`text-2xl font-extrabold uppercase text-gray-700`}>
                    {getMarketName(dummyName, language)}
                  </h3>

                  {/* Pulsing Number Blocks */}
                  <div className="text-2xl font-extrabold my-2 tracking-widest flex justify-center gap-3">
                    <div className="bg-gray-300/50 w-8 h-8 rounded"></div>
                    <span className="text-gray-300/50">-</span>
                    <div className="bg-gray-300/50 w-12 h-8 rounded"></div>
                    <span className="text-gray-300/50">-</span>
                    <div className="bg-gray-300/50 w-10 h-8 rounded"></div>
                  </div>

                  {/* Pulsing Timing Blocks */}
                  <div className={`flex justify-center gap-4 text-sm font-semibold mt-1`}>
                    <div className="bg-gray-300/50 w-16 h-4 rounded"></div>
                    <p className="text-orange-200">|</p>
                    <div className="bg-gray-300/50 w-16 h-4 rounded"></div>
                  </div>
                </div>

                {/* Pulsing Buttons */}
                <div className="mt-3 flex gap-3">
                  <div className="flex-1 bg-green-500/40 h-8 rounded-xl shadow-sm"></div>
                  <div className="flex-1 bg-blue-500/40 h-8 rounded-xl shadow-sm"></div>
                </div>
              </div>
            ))
          ) : (
            /* --- ACTUAL DATA RENDER --- */
            uniqueData.reverse().map((item, index) => (
              <div
                key={item.Id || index}
                className={`${theme.marketCard} rounded-2xl shadow-md p-2 w-full md:w-[32.5%] text-center border transition-colors duration-300`}
              >
                <div>
                  <h3
                    className={`text-2xl font-extrabold uppercase ${theme.textPrimary}`}
                  >
                    {getMarketName(item.Name, language)}
                  </h3>

                  <div className="text-2xl font-extrabold my-2 tracking-widest flex justify-center gap-3">
                    {/* SAFELY RENDER '0' VALUES IN JODI */}
                    <span style={{ color: item.Bcolor || "#db2777" }}>
                      {item.Jodi != null && item.Jodi !== "" ? item.Jodi : "**"}
                    </span>
                    <span className={theme.textSecondary}>-</span>
                    
                    {/* SAFELY RENDER '0' VALUES IN MARKS */}
                    <span style={{ color: item.Ccolor || "#db2777" }}>
                      {item.Marks != null && item.Marks !== "" ? item.Marks : "***"}
                    </span>
                    <span className={theme.textSecondary}>-</span>
                    
                    {/* SAFELY RENDER '0' VALUES IN PENNEL */}
                    <span style={{ color: item.Acolor || "#db2777" }}>
                      {item.Pennel != null && item.Pennel !== "" ? item.Pennel : "***"}
                    </span>
                  </div>

                  {/* Timing */}
                  <div
                    className={`flex justify-center gap-4 text-sm font-semibold mt-1 ${theme.textSecondary}`}
                  >
                    <p>
                      {t.open}: {formatTimeAMPM(item.Time)}
                    </p>
                    <p className="text-orange-400">|</p>
                    <p>
                      {t.close}: {formatTimeAMPM(item.End)}
                    </p>
                  </div>
                </div>

                {/* BOTTOM BUTTON AREA */}
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => navigate(`/Details/${item.Name}`)}
                    className="flex-1 bg-green-600 text-white font-bold py-1 rounded-xl shadow-md hover:bg-green-700 transition flex justify-center items-center gap-1 text-sm md:text-base"
                  >
                    {t.jodiChart} <i className="fa-solid fa-chart-line"></i>
                  </button>

                  <button
                    onClick={() => navigate(`/Details/${item.Name}`)}
                    className="flex-1 bg-blue-600 text-white font-bold py-1 rounded-xl shadow-md hover:bg-blue-700 transition flex justify-center items-center gap-1 text-sm md:text-base"
                  >
                    {t.panelChart} <i className="fa-solid fa-table-list"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <section className="justify-center mx-2 mt-6">
        {/* NOTICE */}
        <div
          className={`${theme.noticeBox} rounded-2xl  text-center text-sm font-bold py-2 border-b transition-colors duration-300`}
        >
          {t.notice}
          <p className="font-serif text-[12px] leading-4 mt-1 p-1">
            {t.noticeText}
          </p>
        </div>

        {/* TITLE BAR */}
        <div className="bg-pink-600 rounded-2xl text-white text-center py-2 px-1 text-sm font-bold mt-2">
          {t.fastestService}
        </div>

        {/* KEYWORDS TEXT */}
        <div
          className={`${theme.noticeBox} text-justify mt-2 p-2 font-serif text-center rounded-lg text-[13px] md:text-[16px] leading-5 border transition-colors duration-300`}
        >
          Leela Bazar in, Leela Bazar satta, Leela Bazar Leela Bazar, indian
          satta matka, kalyan matkà result today, matka Leelabazar, matka result
          live, matka satta result today, leelabazarsatamatka in, Leela Bazar
          com, Leela Bazar net, satta leela bazar, satta matka king, sattamatkà,
          sattamatkà result, sattamatta in, sattmatka sattmatka, star matka,
          tara matka, tara satta matka, world matka, indian matka, matka live,
          kalyan guessing, satta fix, kalyan final ank, Leela Bazar matka, Leela
          Bazar com, sata mata com, सट्टा मटका, sattamatkà 143, golden matka,
          satta matta matka 143, satta fast, kalyan open, satta 143, Leela Bazar
          143 guessing, Leela Bazar satta, golden satta matka, satta bajar
        </div>

        {/* DISCLAIMER */}
        <div
          className={`${theme.warningBox} mt-2 p-3 font-serif text-justify text-center rounded-lg text-[13px] md:text-[16px] leading-5 border transition-colors duration-300`}
        >
          <p className="font-extrabold items-center text-center mb-2">
            {t.disclaimerTitle}
          </p>
          {t.disclaimerText}
          <p className="font-extrabold text-right mt-4">{t.thanks}</p>
          <p className="font-extrabold text-right mb-2">{t.title}</p>
        </div>

        <div
          className={`text-base flex justify-between font-bold mb-8 mx-2 mt-4 cursor-pointer ${theme.textPrimary}`}
        >
          <p>{t.terms}</p>
          <p>{t.service}</p>
        </div>
      </section>

      <footer
        className={`p-4 pb-8 text-center text-sm mt-4 rounded-t-3xl transition-colors duration-300 ${theme.footer}`}
      >
        {t.footer}
      </footer>
    </div>
  );
}
