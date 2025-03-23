import { useState, useEffect } from "react";
import { useService } from "@/services";

const useFetchWidgetLMS = () => {
  const service = useService();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHomeWidgets();
  }, []);

  const fetchHomeWidgets = async (page = 1) => {
    try {
      const codes = ["recentlyViewed", "courses", "topWeekly"];
      const response = await service.widgets.listWidgetsHome(codes);
      if (response?.data && response?.data) {
        if (page == 1) {
          setData(response?.data?.widgets);
        } else {
          setData((prev) => [...prev, ...response?.data?.widgets]);
        }
      } else {
        console.error("No widgets data in response?.data:", response?.data);
      }
      setIsLoading(false);
    } catch (e) {
      console.error("fetchHomeWidgets___error", e);
      setIsLoading(false);
    }
  };
  return { isLoading, data };
};

export default useFetchWidgetLMS;
