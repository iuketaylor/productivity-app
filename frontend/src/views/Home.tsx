export function HomeView() {
  const today = new Date();
  const hours = today.getHours();
  let greeting = "Good morning";
  if (hours >= 12 && hours < 18) greeting = "Good afternoon";
  if (hours >= 18) greeting = "Good evening";

  const formatDate = (date = new Date()) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="home-view">
      <div
        style={{
          marginBottom: "30px",
          borderRadius: "12px",
          padding: "25px",
          background: "linear-gradient(135deg, #F8F0E5 0%, #EADFCB 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{ color: "#5D4037", marginBottom: "10px", fontSize: "28px" }}
        >
          {greeting}, Luke!
        </h1>
        <p style={{ color: "#795548", marginBottom: "5px" }}>{formatDate()}</p>
      </div>
    </div>
  );
}
