import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import downArrow from "../../assets/icons/arrowdown.svg"; // adjust path if needed
import "./Insights.css";
import YesNoModal from "../../models/YesNoModal/YesNoModal";

const dateOptions = [
  7,
  30,
  90,
];

const ageRanges = [
  { label: "18 - 21", from: 18, to: 21 },
  { label: "22 - 25", from: 22, to: 25 },
  { label: "26 - 30", from: 26, to: 30 },
  { label: "31 - 35", from: 31, to: 35 },
];

function getAgeInsights(views) {
  const counts = ageRanges.map(range => {
    const count = views.filter(user => user.age >= range.from && user.age <= range.to).length;
    return { ...range, count };
  });

  const total = counts.reduce((sum, r) => sum + r.count, 0);

  return counts.map(r => ({
    age: r.label,
    pre: total === 0 ? "0%" : `${((r.count / total) * 100).toFixed(0)}%`,
  }));
}


const Insights = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [locationPreference, setLocationPreference] = useState("City");
  const [days, setDays] = useState(30);
  const [insightsData, setInsightsData] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const ageData = getAgeInsights(insightsData);

  const fetchInsightsData = async () => {
    const token = await clientAuth?.currentUser?.getIdToken();
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/view-count/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days })
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.error || "Failed to fetch insights data.");
        setIsErrorPopupVisible(true);
        return;
      }

      setViewCount(data.count);
      setInsightsData(data.views);
    } catch (error) {
      setErrorMessage("An error occurred while fetching insights data.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [days]);

  const countryCounts = insightsData.reduce((acc, item) => {
    if (item.country) {
      acc[item.country] = (acc[item.country] || 0) + 1;
    }
    return acc;
  }, {});

  const cityCounts = insightsData.reduce((acc, item) => {
    if (item.city) {
      acc[item.city] = (acc[item.city] || 0) + 1;
    }
    return acc;
  }, {});

  const total = Object.values(countryCounts).reduce((a, b) => a + b, 0);

  const countryData = Object.entries(countryCounts).map(([country, count]) => ({
    country,
    pre: ((count / total) * 100).toFixed(0) + "%",
  }));


  const cityData = Object.entries(cityCounts).map(([city, count]) => ({
    city,
    pre: ((count / total) * 100).toFixed(0) + '%',
  }));

  return (
    <>
      <div className="mobile-only">
        <div className="headers-top">
          <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
          <p className="header-title">Insights</p>
        </div>
      </div>
      <div className="insights-container">
        <div className="insights-header">
          {/* <ArrowLeft
          className="back-arrow-insight"
          onClick={() => navigate(-1)}
        /> */}
          <div className="insights-title">Insights</div>
        </div>

        <div className="dropdown-row">
          <div className="dropdown-wrapper">
            <select
              className="native-dropdown"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            >
              {dateOptions.map((option) => (
                <option key={option} value={option}>
                  Last {option} days
                </option>
              ))}
            </select>
            <img src={downArrow} alt="down" className="dropdown-icon" />
          </div>

          <span className="dropdown-date-range">
            {new Date(new Date().setDate(new Date().getDate() - Number(days))).toLocaleString("default", {
              month: "short",
              day: "2-digit",
            })} - {new Date().toLocaleString("default", { month: "short", day: "2-digit" })}
          </span>
        </div>

        <div className="total-views">
          <h3>{viewCount}</h3>
          <p>Total profile views</p>
        </div>

        <hr className="divider" />

        {viewCount > 0 &&
          <>
            <h4 className="section-title">By location</h4>
            <div className="toggle-tabs">
              <button
                className={`toggle-btn ${locationPreference === "City" ? "active" : ""}`}
                onClick={() => setLocationPreference("City")}
              >
                City/town
              </button>
              <button
                className={`toggle-btn ${locationPreference === "Country" ? "active" : ""}`}
                onClick={() => setLocationPreference("Country")}
              >
                Country/region
              </button>
            </div>

            {locationPreference === "Country" && countryData.map((item, idx) => (
              <div className="bar-row" key={idx}>
                <span className="bar-label">{item.country}</span>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{ width: item.pre }}
                  ></div>
                </div>
                <span className="bar-value">{item.pre}</span>
              </div>
            ))}

            {locationPreference === "City" && cityData.map((item, idx) => (
              <div className="bar-row" key={idx}>
                <span className="bar-label">{item.city}</span>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{ width: item.pre }}
                  ></div>
                </div>
                <span className="bar-value">{item.pre}</span>
              </div>
            ))}

            <hr className="divider" />

            <h4 className="section-title">By age</h4>

            {ageData.map((item, idx) => (
              <div className="bar-row" key={idx}>
                <span className="bar-label">{item.age}</span>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{ width: item.pre }}
                  ></div>
                </div>
                <span className="bar-value">{item.pre}</span>
              </div>
            ))}
          </>
        }
        <YesNoModal
          show={isErrorPopupVisible}
          onClose={() => setIsErrorPopupVisible(false)}
          heading="Error"
          data={errorMessage}
          buttonText="Ok"
          
        />
      </div>
    </>
  );
};

export default Insights;
