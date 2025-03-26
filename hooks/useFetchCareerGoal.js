import { useState, useEffect } from 'react';
import { useServices } from '@/services';
const useFetchCareerGoal = () => {
  const service = useServices();
  const [isLoading, setIsLoading] = useState(true);
  const [userSettingsCareerGoal, setUserSettingsCareerGoal] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [phase, setPhase] = useState(1);

  const loadMoreItems = async () => {
    if (
      phase === 1 &&
      userSettingsCareerGoal.metaSkills.current_page <
        userSettingsCareerGoal.metaSkills.total_pages &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      try {
        const resSuggestedSkills = await service.talentManagement.listSkills(
          userSettingsCareerGoal.metaSkills.current_page + 1
        );
        setUserSettingsCareerGoal(prev => {
          return {
            ...prev,
            skillsSuggest: [...prev.skillsSuggest, ...resSuggestedSkills.items],
            metaSkills: resSuggestedSkills.meta,
          };
        });
      } catch (error) {
        console.error('Error loading more items:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }
    if (
      phase === 3 &&
      userSettingsCareerGoal.metaJobInterests.current_page <
        userSettingsCareerGoal.metaJobInterests.total_pages &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      try {
        const resJobInterests = await service.shop.listPositions(
          userSettingsCareerGoal.metaJobInterests.current_page + 1
        );
        setUserSettingsCareerGoal(prev => {
          return {
            ...prev,
            jobInterests: [...prev.jobInterests, ...resJobInterests.items],
            metaJobInterests: resJobInterests.meta,
          };
        });
      } catch (error) {
        console.error('Error loading more items:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const addSkill = skill => {
    if (phase === 1) {
      setUserSettingsCareerGoal(prev => {
        return {
          ...prev,
          skills: [skill.id, ...prev.skills],
          skillsObj: [skill, ...prev.skillsObj],
          skillsSuggest: prev.skillsSuggest.filter(s => s.id !== skill.id),
        };
      });
    }
    if (phase === 3) {
      setUserSettingsCareerGoal(prev => {
        return {
          ...prev,
          rolesInterested: [skill.id, ...prev.rolesInterested],
          rolesInterestedObj: [skill, ...prev.rolesInterestedObj],
          jobInterests: prev.jobInterests.filter(s => s.id !== skill.id),
        };
      });
    }
  };
  const setCareerFocus = careerFocus => {
    setUserSettingsCareerGoal(prev => {
      return {
        ...prev,
        careerFocus: careerFocus,
      };
    });
  };

  const removeSkill = skill => {
    if (phase === 1) {
      setUserSettingsCareerGoal(prev => {
        const updatedSkills = prev.skills.filter(s => s !== skill.id);
        const updatedSkillsObj = prev.skillsObj.filter(sObj => sObj.id !== skill.id);
        return {
          ...prev,
          skills: updatedSkills,
          skillsObj: updatedSkillsObj,
          skillsSuggest: [skill, ...prev.skillsSuggest],
        };
      });
    }
    if (phase === 3) {
      setUserSettingsCareerGoal(prev => {
        const updatedRolesInterested = prev.rolesInterested.filter(s => s !== skill.id);
        const updatedRolesInterestedObj = prev.rolesInterestedObj.filter(
          sObj => sObj.id !== skill.id
        );
        return {
          ...prev,
          rolesInterested: updatedRolesInterested,
          rolesInterestedObj: updatedRolesInterestedObj,
          jobInterests: [skill, ...prev.jobInterests],
        };
      });
    }
  };
  useEffect(() => {
    fetchCareerGoal();
  }, []);

  const fetchCareerGoal = async () => {
    setIsLoading(true);
    const resUserSettingsCareerGoal = await service.userSettings.listUserSetting();
    const resSuggestedSkills = await service.talentManagement.listSkills(1);
    const resJobInterests = await service.shop.listPositions(1);
    if (resUserSettingsCareerGoal) {
      const data = {
        ...resUserSettingsCareerGoal,
        skillsSuggest: resSuggestedSkills.items,
        jobInterests: resJobInterests.items,
        metaSkills: resSuggestedSkills.meta,
        metaJobInterests: resJobInterests.meta,
      };
      setUserSettingsCareerGoal(data);
    }
    setIsLoading(false);
  };
  const submitCareerGoal = async () => {
    try {
      const data = {
        skills: userSettingsCareerGoal.skills,
        careerFocus: userSettingsCareerGoal.careerFocus,
        rolesInterested: userSettingsCareerGoal.rolesInterested,
      };
      const resData = await service.userSettings.listUserSetting(data);
      if (resData) {
        setUserSettingsCareerGoal(resData);
      }
    } catch (error) {
      console.error('Error submitting career goal:', error);
    }
  };

  return {
    loadMoreItems,
    submitCareerGoal,
    isLoading,
    removeSkill,
    addSkill,
    userSettingsCareerGoal,
    setUserSettingsCareerGoal,
    phase,
    setPhase,
    setCareerFocus,
    isLoadingMore,
    submitCareerGoal,
  };
};

export default useFetchCareerGoal;
