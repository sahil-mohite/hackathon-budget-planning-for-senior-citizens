import React, { useEffect, useState } from "react";

const Insights = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8090/insights", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch insights");
  
        const result = await res.json();
  
        // ✅ Split the full insight block into each bullet point (preserving headers + body)
        const rawText = result.insights || "";
  
        const splitInsights = rawText
          .split(/\n\s*\*/g) // split on newline followed by a bullet
          .map((item, idx) => {
            // Restore the lost bullet prefix
            return item.trim().startsWith("*") ? item.trim() : `* ${item.trim()}`;
          })
          .filter(Boolean);
  
        setInsights(splitInsights);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setInsights(["Unable to load insights."]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInsights();
  }, []);

  return (
    <div className="mt-8 space-y-2">
      <h3 className="text-senior-lg font-semibold text-foreground">📊 Personalized Insights to achieve Goal</h3>
      {loading ? (
        <p className="text-muted-foreground">Loading insights...</p>
      ) : (
        <ul className="list-disc list-inside text-senior-base text-foreground space-y-2">
        {insights.map((point, idx) => (
            <li key={idx} className="leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default Insights;
