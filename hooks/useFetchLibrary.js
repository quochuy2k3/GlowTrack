import { useState, useEffect } from "react";
import { useService } from "@/services";

const useFetchLibrary = () => {
  const service = useService();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [code, setCode] = useState("requireLearning");

  useEffect(() => {
    setIsLoading(true);
    fetchListCourseLibrary();
  }, [code]);

  const fetchListCourseLibrary = async (page = 1) => {
    if (!code) return;
    try {
      const response = await service.widgets.listWidgetsHomeByCode(code, page);

      if (response && response.items) {
        if (page === 1) {
          setData(response.items);
        } else {
          if (response.items) {
            setData((prev) => [...prev, ...response.items]);
          }
        }
        response && setMeta(response?.meta);
      }
      setIsLoading(false);
      setIsLoadingMore(false);
    } catch (e) {
      console.error("fetchListCourseLibrary___error", e);
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const onLoadMore = () => {
    if (isLoading || isLoadingMore) return;

    if (meta.current_page < meta.total_pages) {
      setIsLoadingMore(true);
      fetchListCourseLibrary(meta.current_page + 1);
    }
  };

  return { isLoading, data, onLoadMore, setCode, code };
};

export default useFetchLibrary;
