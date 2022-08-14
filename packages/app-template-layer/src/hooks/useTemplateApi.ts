import { api } from "@atrilabs/core";
import { AnyEvent } from "@atrilabs/forest";
import { useCallback, useEffect, useState } from "react";

export const useTemplateApi = () => {
  const [templatesData, setTemplatesData] = useState<{
    user: { dir: string; names: string[] };
    default: { dir: string; names: string[] };
  } | null>(null);

  const fetchTemplatesData = () => {
    api.getTemplateInfo((info) => {
      const userDir = info.userDirs[0];
      const defaultDir = info.defaultDirs[0];
      api.getTemplateList(userDir, (userNames) => {
        api.getTemplateList(defaultDir, (defaultNames) => {
          setTemplatesData({
            user: { dir: info.userDirs[0], names: userNames },
            default: { dir: info.defaultDirs[0], names: defaultNames },
          });
        });
      });
    });
  };

  useEffect(() => {
    fetchTemplatesData();
  }, []);

  const callCreateTeamplateApi = useCallback(
    (events: AnyEvent[], templateName: string) => {
      if (templatesData) {
        api.createTemplate(
          templatesData.user.dir,
          templateName,
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
    [templatesData]
  );

  const callDeleteTemplateApi = useCallback(
    (name: string) => {
      if (templatesData) {
        api.deleteTemplate(templatesData.user.dir, name, () => {
          fetchTemplatesData();
        });
      }
    },
    [templatesData]
  );

  return { templatesData, callCreateTeamplateApi, callDeleteTemplateApi };
};
