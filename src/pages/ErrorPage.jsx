export default function ErrorPage({ type = "404" }) {
  const config = {
    404: {
      title: "404",
      subtitle: "Page Not Found",
      desc: "The page you are looking for doesn’t exist or was moved.",
      icon: "🚫",
    },
    offline: {
      title: "No Internet",
      subtitle: "You're Offline",
      desc: "Check your connection and try again.",
      icon: "📡",
    },
    browser: {
      title: "Browser Error",
      subtitle: "Something went wrong",
      desc: "Please refresh or try again later.",
      icon: "⚠️",
    },
  };

  const data = config[type] || config["404"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-gray-100 to-orange-500 p-4">
      {/* CARD */}
      <div className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl border border-yellow-500 bg-white/80 backdrop-blur-xl overflow-hidden">
        {/* SHINE EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-40"></div>

        {/* CONTENT */}
        <div className="relative z-10 text-center">
          {/* ICON */}
          <div className="text-6xl mb-3 animate-bounce">{data.icon}</div>

          {/* TITLE */}
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide">
            {data.title}
          </h1>

          {/* SUBTITLE */}
          <p className="text-lg font-semibold text-yellow-800 mt-2">
            {data.subtitle}
          </p>

          {/* DESC */}
          <p className="text-sm text-gray-700 mt-2 mb-6">{data.desc}</p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-yellow-400 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-gray-900 transition"
            >
              Reload
            </button>

            <button
              onClick={() => window.history.back()}
              className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-yellow-600 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
