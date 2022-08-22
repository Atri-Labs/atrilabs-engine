import { api, TemplateDetail } from "@atrilabs/core";
import { AnyEvent } from "@atrilabs/forest";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useTemplateApi = () => {
  const [templateDetails, setTemplateDetails] = useState<
    TemplateDetail[] | null
  >(null);

  const fetchTemplatesData = useCallback(() => {
    api.getTemplateList((templateDetails) => {
      setTemplateDetails(templateDetails);
    });
  }, []);

  useEffect(() => {
    fetchTemplatesData();
  }, [fetchTemplatesData]);

  const callCreateTeamplateApi = useCallback(
    (events: AnyEvent[], templateDetail: TemplateDetail) => {
      if (templateDetails) {
        api.createTemplate(
          templateDetail.relativeDir,
          templateDetail.templateName,
          events,
          (success) => {
            if (!success) {
              console.log("Failed to create temaplate");
            } else {
              fetchTemplatesData();
            }
          }
        );
      }
    },
    [templateDetails, fetchTemplatesData]
  );

  const callDeleteTemplateApi = useCallback(
    (templateDetail: TemplateDetail) => {
      if (templateDetails) {
        api.deleteTemplate(
          templateDetail.relativeDir,
          templateDetail.templateName,
          () => {
            fetchTemplatesData();
          }
        );
      }
    },
    [templateDetails, fetchTemplatesData]
  );

  const relativeDirs = useMemo(() => {
    const relativeDirs: { [relativeDir: string]: boolean } = {};
    if (templateDetails) {
      templateDetails.forEach((detail) => {
        relativeDirs[detail.relativeDir] = true;
      });
    }
    return relativeDirs;
  }, [templateDetails]);

  const sortedRelativeDirs = useMemo(() => {
    return Object.keys(relativeDirs).sort();
  }, [relativeDirs]);

  return {
    templateDetails,
    callCreateTeamplateApi,
    callDeleteTemplateApi,
    relativeDirs,
    sortedRelativeDirs,
  };
};
