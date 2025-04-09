/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { Experience } from "@adobe/genstudio-uix-sdk";
import React, { createContext, FC, useEffect, useMemo, useState } from "react";

export interface CurrentExperienceContextType {
  currentExperience: Experience | null;
  setCurrentExperience: React.Dispatch<React.SetStateAction<Experience | null>>;
}

const CurrentExperienceContext = createContext({} as CurrentExperienceContextType);

const CurrentExperienceContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);

  const context: CurrentExperienceContextType = useMemo(
    () => ({
        currentExperience,
        setCurrentExperience,
    }),
    [currentExperience],
  );

  useEffect(() => {
    console.log("Context value updated:", currentExperience);
  }, [currentExperience]);

  return (
    <CurrentExperienceContext.Provider value={context}>
      {children}
    </CurrentExperienceContext.Provider>
  );
};

export { CurrentExperienceContext, CurrentExperienceContextProvider };
