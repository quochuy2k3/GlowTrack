import { useState, useEffect, useCallback } from "react";
import categoryService from "@/services/category";
import { useService } from "@/services";

const useFetchCategory = () => {
  const service = useService();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [category, setCategory] = useState([]);
  const [metaCategory, setMetaCategory] = useState({});
  const [skills, setSkills] = useState([]);
  const [metaSkill, setMetaSkill] = useState({});

  useEffect(() => {
    fetchCategory(1);
    fetchSkill(1);
  }, []);

  const fetchCategory = useCallback(async (page = 1) => {
    setIsLoading(page === 1);
    try {
      const response = await service.userCourses.categories(page);
      if (response) {
        setCategory((prev) =>
          page === 1 ? response.items : [...prev, ...response.items]
        );
        setMetaCategory(response.meta);
      }
    } catch (e) {
      console.error("fetchCategory___error", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSkill = useCallback(async (page = 1) => {
    setIsLoadingMore(true);
    try {
      const data = await service.talentManagement.listSkills(page);
      if (data) {
        setSkills((prev) =>
          page === 1 ? data.items : [...prev, ...data.items]
        );
        setMetaSkill(data.meta);
      }
    } catch (e) {
      console.error("fetchSkill___error", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  const onLoadMore = useCallback(
    (type) => {
      if (isLoading || isLoadingMore) return;

      if (type === "skill" && metaSkill.current_page < metaSkill.total_pages) {
        fetchSkill(metaSkill.current_page + 1);
      }
    },
    [isLoading, isLoadingMore, metaSkill, fetchSkill]
  );

  return {
    isLoading,
    isLoadingMore,
    category,
    onLoadMore,
    skills,
    metaSkill,
    metaCategory,
  };
};

export default useFetchCategory;
