import { TemplateDetail } from "@atrilabs/core";
import { api } from "@atrilabs/pwa-builder-manager";
import { AnyEvent } from "@atrilabs/forest";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useTemplateApi = () => {
  const [templateDetails, setTemplateDetails] = useState<string[] | null>(null);

  const fetchTemplatesData = useCallback(() => {
    api.getTemplateList((templateDetails) => {
      setTemplateDetails(templateDetails);
    });
  }, []);

  useEffect(() => {
    fetchTemplatesData();
  }, [fetchTemplatesData]);

  const callCreateTemplateApi = useCallback(
    (events: AnyEvent[], templateDetail: TemplateDetail) => {
      if (templateDetail) {
        api.createTemplate(
          templateDetail.relativeDir,
          templateDetail.templateName,
          events,
          (success) => {
            if (success) {
              fetchTemplatesData();
            } else {
              console.log("Failed to create template");
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

  /*const relativeDirs = useMemo(() => {
    const relativeDirs: { [relativeDir: string]: boolean } = {};
    if (templateDetails) {
      templateDetails.forEach((detail) => {
        console.log("detail.relativeDir", detail.relativeDir);
        relativeDirs[detail.relativeDir] = true;
      });
    }
    return relativeDirs;
  }, [templateDetails]);*/

  /* const sortedRelativeDirs = useMemo(() => {
     return Object.keys(relativeDirs).sort();
   }, [relativeDirs]);*/

  return {
    templateDetails,
    callCreateTemplateApi,
    callDeleteTemplateApi,
  };
};
