const data = [
  { Id: "MORNING SYNDICATE" },
  { Id: "KALYAN MORNING" },
  { Id: "SYNDICATE NIGHT" },
  { Id: "LEELA BAZAR" },
  { Id: "RAJDHANI NIGHT" },
].reverse();

// Render
document.getElementById("gameList").innerHTML = data
  .map(
    (r) => `
<div class="flex justify-between items-center bg-orange-100 px-2 py-2 border-t border-orange-300 mb-8">
  
  <button class="bg-blue-900 text-white px-3 py-1 rounded-full text-xs shadow">
    Jodi
  </button>

  <div class="text-center flex-1">
    <h2 class="font-bold text-lg">${r.Id}</h2>

    <!-- small loading text -->
    <p class="text-[12px] text-gray-700 font-bold animate-pulse">
      Loading...
    </p>

    <!-- big loading text -->
    <p class="text-xl text-pink-700 font-extrabold animate-pulse">
      Loading...
    </p>
  </div>

  <button class="bg-blue-900 text-white px-3 py-1 rounded-full text-xs shadow">
    Panel
  </button>
</div>

`
  )
  .join("");

//////////////////////////////////////////
const alpha = document.getElementById("alpha");
const beeta = document.getElementById("beeta");

const a = document.getElementById("a").textContent;
const b = document.getElementById("b").textContent;
document.getElementById("alphachild").style.backgroundColor = "white";
let Category = a; // ✔ can change value

alpha.addEventListener("click", () => {
  Category = a;
  loadData();
  document.getElementById("alphachild").style.backgroundColor = "white";
  document.getElementById("beetachild").style.backgroundColor = "";
  document.querySelector("#dataTable").innerHTML = `
   
    <div class="bg-white p-5 hidden rounded-2xl shadow animate-pulse">
          <div class="flex justify-between items-center">
            <div>
              <div class="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div class="h-7 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
  `;
});

beeta.addEventListener("click", () => {
  Category = b;
  loadData();
  document.getElementById("alphachild").style.backgroundColor = "";
  document.getElementById("beetachild").style.backgroundColor = "white";
  document.querySelector("#dataTable").innerHTML = `
   
        <div class="bg-white p-5 hidden rounded-2xl shadow animate-pulse">
          <div class="flex justify-between items-center">
            <div>
              <div class="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div class="h-7 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
    
  
  `;
});

const API_URLS =
  "https://script.google.com/macros/s/AKfycbyW6iFWJpgLR-oogi_GysEp_RXph9d9vaQ2idlMgsQQVAg3ee_XeKuqyI_HDyaqnwlG/exec";

function loadData() {
  fetch(API_URLS + "?action=read")
    .then((res) => res.json())
    .then((data) => {
      if (data.result !== "success") {
        console.error("API Error:", data.error);
        return;
      }

      function formatDate(d) {
        const date = new Date(d);
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
      }

      function formatTime(t) {
        let [time, mod] = t.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (mod === "PM" && h !== 12) h += 12;
        if (mod === "AM" && h === 12) h = 0;
        const d = new Date();
        d.setHours(h, m, 0);
        return d
          .toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase();
      }
      const singleBox = document.querySelector("#dataSingle");
      const goldenBox = document.querySelector("#dataGolden");
      const finalBox = document.querySelector("#dataFinal");

      // RESET OLD DOM
      singleBox.innerHTML = "";
      goldenBox.innerHTML = "";
      finalBox.innerHTML = "";

      const onlySingle = data.records.filter(
        (r) => r.Category?.trim().toLowerCase() === "single"
      );

      // ✅ ADD THIS
      const renderedIds = new Set();

      onlySingle.reverse().forEach((r) => {
        // ✅ UNIQUE BY Id
        if (renderedIds.has(r.Name)) return;
        renderedIds.add(r.Name);

        singleBox.innerHTML += `
<div class="flex justify-between items-center my-6 bg-[${
          r.Mcolor || "#fffaf0"
        }] px-2 py-2 border-t border-orange-300">
  <button onclick="window.location.href='${r.Name}.html?id=${r.Name}'"
    class="bg-blue-900 text-white px-3 py-1 rounded-full text-xs shadow">
    Jodi
  </button>

  <div class="text-center flex-1">
    <h2 class="font-bold text-[22px]">${r.Name}</h2>
    <p class="text-[16px] text-gray-700">
      ${formatTime(r.Time)} && ${formatTime(r.End)}
    </p>
       <p class="text-base text-pink-400 font-extrabold">
        ${ "Open"}${"-----"}${"-----" + "Close"}
    </p>
    <p class="text-[22px] text-pink-700 font-extrabold">
      ${r.Jodi + " " || ""}${"- " + r.Marks + " " || ""}${"- " + r.Pennel || ""}
    </p>
  </div>

  <button onclick="window.location.href='${r.Name}.html?id=${r.Name}'"
    class="bg-blue-900 text-white px-3 py-1 rounded-full text-xs shadow">
    Panel
  </button>
</div>`;
      });

      // ========== 2️⃣ GOLDEN =============
      const onlyGolden = data.records.filter(
        (r) => r.Category?.trim().toLowerCase() === "golden"
      );

      onlyGolden.reverse().forEach((r) => {
        goldenBox.innerHTML += `
  <p class="text-2xl font-extrabold text-orange-900">${r.Jodi || ""}${
          -r.Marks || ""
        }${-r.Pennel || ""}  </p>`;
      });

      // ========== 3️⃣ FINAL =============
      const onlyFinal = data.records.filter(
        (r) => r.Category?.trim().toLowerCase() === "final"
      );

      onlyFinal.reverse().forEach((r) => {
        finalBox.innerHTML += `
 <p class="text-2xl font-extrabold text-green-700">${r.Jodi || ""}${
          r.Marks || ""
        }${r.Pennel || ""}</p>`;
      });
    })
    .catch((err) => console.error("Fetch Error:", err));
}

let isLoading = false;

function autoLoad() {
  if (isLoading) return; // Prevent repeat call

  isLoading = true;
  loadData().finally(() => {
    isLoading = false;
  });
}

loadData(); // first load
setInterval(autoLoad, 50);

refreshBtn.addEventListener("click", () => {
  loadData(); // first load
  let rotation = 0;
  const speed = 25; // lower = faster
  const spin = setInterval(() => {
    rotation += 20;
    refreshIcon.style.transform = `rotate(${rotation}deg)`;
  }, speed);
  setTimeout(() => {
    clearInterval(spin);
    refreshIcon.style.transform = "rotate(0deg)";
  }, 3000); // stop after 3s
});

////////////////////////Sliding//////////
(function () {
  const threshold = 160;
  setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = "⚠️ DevTools Detected";
      // OR: window.location.href = "/blocked.html";
    }
  }, 1000);
})();

/////////dynamic data load /////////

// // ⭐ PRICE PAGE
// function loadPrice() {
//   document.getElementById("contentArea").innerHTML = `
//           <p class="text-base ml-2 font-bold text-gray-800">Pricing Details</p>
//           <div class="mt-4 space-y-4">
//     <div class="bg-white p-5 rounded-2xl shadow">
//       <div class="flex justify-between items-center">
//         <div>
//           <p class="font-semibold">Florence → Stockholm</p>
//           <p class="text-sm text-gray-500">Order ID #18498-98018</p>
//         </div>
//         <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">PACKED</span>
//       </div>
//     </div>

//     <div class="bg-white p-5 rounded-2xl shadow">
//       <div class="flex justify-between items-center">
//         <div>
//           <p class="font-semibold">Dresden → Stockholm</p>
//           <p class="text-sm text-gray-500">Order ID #09498-98367</p>
//         </div>
//         <span class="bg-lime-200 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">IN TRANSIT</span>
//       </div>
//     </div>
//   </div>
//       `;
// }
// loadPrice();
// // ⭐ POINT PAGE
// function loadPoint() {
//   document.getElementById("contentArea").innerHTML = `
//         <p class="text-base ml-2 font-bold text-gray-800">Location Points</p>

//         <div class="mt-5 space-y-4">

//           <div class="bg-white p-5 rounded-3xl shadow-md">
//             <p class="text-lg font-semibold text-gray-900">Pickup Point</p>
//             <p class="text-gray-600">Sector 21, Near Metro Station</p>
//           </div>

//           <div class="bg-white p-5 rounded-3xl shadow-md">
//             <p class="text-lg font-semibold text-gray-900">Drop Point</p>
//             <p class="text-gray-600">Airport Terminal 3</p>
//           </div>

//           <div class="bg-white p-5 rounded-3xl shadow-md">
//             <p class="text-lg font-semibold text-gray-900">Warehouse</p>
//             <p class="text-gray-600">Plot 112, Industrial Area</p>
//           </div>

//         </div>
//       `;
// }

// // ⭐ ACTIVITY PAGE
// function loadActivity() {
//   document.getElementById("contentArea").innerHTML = `
//           <p class="text-base ml-2 font-bold text-gray-800">Pricing Details</p>
//           <div class="mt-4 space-y-4">
//     <div class="bg-white p-5 rounded-2xl shadow">
//       <div class="flex justify-between items-center">
//         <div>
//           <p class="font-semibold">Florence → Stockholm</p>
//           <p class="text-sm text-gray-500">Order ID #18498-98018</p>
//         </div>
//         <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">PACKED</span>
//       </div>
//     </div>

//     <div class="bg-white p-5 rounded-2xl shadow">
//       <div class="flex justify-between items-center">
//         <div>
//           <p class="font-semibold">Dresden → Stockholm</p>
//           <p class="text-sm text-gray-500">Order ID #09498-98367</p>
//         </div>
//         <span class="bg-lime-200 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">IN TRANSIT</span>
//       </div>
//     </div>
//   </div>
//       `;
// }

// // ⭐ SUPPORT PAGE
// function loadSupport() {
//   document.getElementById("contentArea").innerHTML = `
//         <p class="text-base ml-2 font-bold text-gray-800">Support Center</p>

//         <div class="mt-5 space-y-4">

//           <div class="bg-white p-5 rounded-2xl shadow-md">
//             <p class="font-semibold text-gray-900">24/7 Customer Support</p>
//             <p class="text-gray-600 text-sm">Call: +91 9823 889 112</p>
//           </div>

//           <div class="bg-white p-5 rounded-2xl shadow-md">
//             <p class="font-semibold text-gray-900">Chat With Us</p>
//             <p class="text-gray-600 text-sm">We reply within 2 minutes.</p>
//           </div>

//           <div class="bg-white p-5 rounded-2xl shadow-md">
//             <p class="font-semibold text-gray-900">Email</p>
//             <p class="text-gray-600 text-sm">support@trackme.com</p>
//           </div>

//         </div>
//       `;
// }
