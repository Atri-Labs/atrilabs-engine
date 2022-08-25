import { api, ImportedResource } from "@atrilabs/core";
import { useEffect, useMemo, useState } from "react";

export const useGetFontImports = () => {
  const [fonts, setFonts] = useState<
    Required<ImportedResource["imports"]>["fonts"]
  >([]);

  const formattedFontInfo = useMemo(() => {
    const formattedFontInfo: {
      [fontFamily: string]: {
        fontWeights: (string | number)[];
        fontStyles: string[];
      };
    } = {};
    fonts.forEach((font) => {
      if (formattedFontInfo[font.fontFamily] !== undefined) {
        if (font.fontStyle) {
          formattedFontInfo[font.fontFamily].fontStyles.push(font.fontStyle);
        }
        if (font.fontWeight) {
          formattedFontInfo[font.fontFamily].fontWeights.push(font.fontWeight);
        }
      } else {
        formattedFontInfo[font.fontFamily] = {
          fontStyles: font.fontStyle ? [font.fontStyle] : [],
          fontWeights: font.fontWeight ? [font.fontWeight] : [],
        };
      }
    });
    return formattedFontInfo;
  }, [fonts]);

  const fontFamilies = useMemo(() => {
    return Object.keys(formattedFontInfo);
  }, [formattedFontInfo]);

  useEffect(() => {
    api.getResources((resources) => {
      resources.forEach((resource) => {
        setFonts((old) => {
          if (resource.method === "css" && resource.imports.fonts) {
            return [...old, ...resource.imports.fonts];
          }
          return old;
        });
      });
    });
  }, []);

  useEffect(() => {
    api.subscribeResourceUpdates((resource) => {
      setFonts((old) => {
        if (resource.method === "css" && resource.imports.fonts) {
          return [...old, ...resource.imports.fonts];
        }
        return old;
      });
    });
  }, []);

  return { formattedFontInfo, fontFamilies };
};
