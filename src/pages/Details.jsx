import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../components/DataContext"; // Adjust path if needed

export default function Details() {
  const { marketName } = useParams(); // Gets the name from the previous page
  const navigate = useNavigate();
  const { data, loading } = useData();

  // 1. DYNAMIC DAYS CONFIGURATION based on Market Name
  const daysConfig = useMemo(() => {
    const name = (marketName || "").toLowerCase();

    // Default base days (Mon-Fri)
    let daysList = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    if (name.includes("rajdhani night")) {
      // 5 Days (Mon-Fri) - Do nothing, already set
    } else if (name.includes("kalyan")) {
      // 6 Days (Mon-Sat)
      daysList.push("SATURDAY");
    } else {
      // 7 Days (Mon-Sun) - For Leela Bazar, Morning Syndicate, Shaktimaan, etc.
      daysList.push("SATURDAY", "SUNDAY");
    }

    return daysList;
  }, [marketName]);

  // 2. DATA PROCESSING: Filter, Sort, and Group by Week
  const weeklyData = useMemo(() => {
    if (!data || data.length === 0) return {};

    // ADDED .trim() TO BOTH SIDES TO FIX GOOGLE SHEETS SPACING ISSUES
    const filtered = data
      .filter(
        (r) =>
          r.Name &&
          r.Name.toLowerCase().trim() ===
            (marketName || "").toLowerCase().trim(),
      )
      .sort((a, b) => new Date(a.Date) - new Date(b.Date));

    const weeks = {};

    filtered.forEach((r) => {
      if (!r.Date || !r.Day) return;
      const d = new Date(r.Date);
      if (isNaN(d)) return;

      // Find the Monday of this record's week
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));

      const weekStartStr = monday.toISOString().slice(0, 10); // YYYY-MM-DD

      if (!weeks[weekStartStr]) {
        weeks[weekStartStr] = {};
      }
      // Store the record under its specific day
      weeks[weekStartStr][r.Day.toUpperCase()] = r;
    });

    return weeks;
  }, [data, marketName]);

  // Helper to calculate end date of the week based on column count
  const getEndDateStr = (startStr) => {
    const d = new Date(startStr);
    d.setDate(d.getDate() + (daysConfig.length - 1));
    return d.toISOString().slice(0, 10);
  };

  return (
    <div className="bg-gray-100 w-[100vw] md:w-full overflow-hiiden min-h-[100dvh] font-sans select-none pb-10">
      {/* HEADER */}
      <header className="bg-white shadow-md  p-1 px-2 sticky top-0 z-50">
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center text-blue-600 hover:bg-orange-100 transition shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        
          <h1 className="font-extrabold text-xl md:text-2xl text-black uppercase tracking-wide">
            {marketName || "MARKET CHART"}
          </h1>
            <img
            src="/public/Logo.png"
            className="w-9 h-9 rounded-full shadow-sm"
          />
        </div>
      </header>

      <main className="max-w-6xl md:max-w-full bg-black p-0.5 mx-auto mt-1">
        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center bg-white fixed justify-center h-[100vh] w-full left-0 top-0 gap-3">
            <div className="h-10 w-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-pink-600 animate-pulse text-lg">
              Preparing Chart Data...
            </p>
          </div>
        ) : Object.keys(weeklyData).length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center border border-gray-200 mt-10">
            <i className="fa-solid fa-folder-open text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500 font-bold">
              No records found for {marketName}.
            </p>
          </div>
        ) : (
          /* DATA TABLE (Scrollable horizontally on very small screens) */
          <div className="w-full overflow-x-hidden bg-black pr-1 shadow-lg border border-gray-800">
            <div className="min-w-[600px] md:min-w-full">
              {/* TABLE HEADERS */}
              <div className="flex w-[99vw] bg-yellow-300 text-black text-xs md:text-sm font-extrabold text-center border-b-2 border-black">
                {/* Date Column */}
                <div className="w-[17%] md:w-[120px] flex items-center justify-center p-2 border-r-2 border-black">
                  DATE
                </div>
                {/* Day Columns */}
                <div
                  className="flex-1 grid border-black"
                  style={{
                    gridTemplateColumns: `repeat(${daysConfig.length}, minmax(0, 1fr))`,
                  }}
                >
                  {daysConfig.map((day, idx) => (
                    <div
                      key={day}
                      className={`p-2 ${idx !== 0 ? "border-l-2  border-black" : ""}`}
                    >
                      {day.substring(0, 3)} {/* Displays MON, TUE, etc. */}
                    </div>
                  ))}
                </div>
              </div>

              {/* TABLE BODY */}
              <div className="bg-white">
                {Object.keys(weeklyData)
                  .sort()
                  .map((startStr) => {
                    const weekData = weeklyData[startStr];
                    const endStr = getEndDateStr(startStr);

                    return (
                      <div
                        key={startStr}
                        className="flex max-w-[98vw] overflow-hiiden border-b-2 border-black text-center group hover:bg-orange-50 transition-colors"
                      >
                        {/* Left Date Column */}
                        <div className="w-auto md:w-[120px] h-10 font-black flex flex-col justify-center text-[10px] md:text-[12px] p-1 border-r-2 border-black bg-gray-50">
                          <span>{startStr}</span>
                          <span className="text-pink-600 mt-[-3px]">TO</span>
                          <span className=" mt-[-3px]">{endStr}</span>
                        </div>

                        {/* Right Grid (Days) */}
                        <div
                          className="flex-1 grid"
                          style={{
                            gridTemplateColumns: `repeat(${daysConfig.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {daysConfig.map((day, idx) => {
                            const r = weekData[day];

                            // If no data exists for this specific day
                            if (!r) {
                              return (
                                <div
                                  key={day}
                                  className={`flex items-center justify-center text-red-500 font-bold ${idx !== 0 ? "border-l-2 border-black" : ""}`}
                                >
                                  **
                                </div>
                              );
                            }

                            // If data exists, render the split structure
                            return (
                              <div
                                key={day}
                                className={`flex items-center justify-center gap-1 px-[1px] ${idx !== 0 ? "border-l border-black" : ""}`}
                              >
                                {/* Left / Jodi (Stacked vertically) */}
                                <div className="font-extrabold font-black text-[11px] leading-[11px] flex flex-col text-center">
                                  {r.Jodi != null && r.Jodi !== ""
                                    ? String(r.Jodi)
                                        .split("")
                                        .map((char, i) => (
                                          <span key={i}>{char}</span>
                                        ))
                                    : ""}
                                </div>

                                {/* Middle / Marks (Large Text) */}
                                {/* Changed from {r.Marks || ""} to safely render "0" */}
                                <div
                                  className="text-[18px] font-black min-w-[19px] text-center"
                                  style={{ color: r.Bcolor || "#000" }}
                                >
                                  {r.Marks != null && r.Marks !== "" ? String(r.Marks) : ""}
                                </div>

                                {/* Right / Pennel (Stacked vertically) */}
                                <div className="font-extrabold font-black text-[11px] leading-[11px] flex flex-col text-center">
                                  {r.Pennel != null && r.Pennel !== ""
                                    ? String(r.Pennel)
                                        .split("")
                                        .map((char, i) => (
                                          <span key={i}>{char}</span>
                                        ))
                                    : ""}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
