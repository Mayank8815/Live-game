export default function Preloader() {
  const loading = true;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center bg-[#5F259F]">
          <div className="flex fixed flex-col mt-10 items-center rounded-3xl bg-white/10 p-10 backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-10">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-lg bg-white"
                  style={{
                    animation: "loader 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <style>{`
      @keyframes loader {
        0%,100% {
          transform: scale(0.7);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.3);
          opacity: 1;
        }
      }
    `}</style>
          <p className="fixed bottom-6 mt-6 text-2xl font-bold text-white">
            Processing...
          </p>
        </div>
      )}
    </>
  );
}
