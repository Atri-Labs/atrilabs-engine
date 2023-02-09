import { MainAppContext, AtriScriptsContext } from "@atrilabs/atri-app-core";
import { renderToString } from "react-dom/server";

export function renderPageServerSide(options: {
  scriptSrcs: string[];
  manifestRegistrySrc: string;
  PageFn: React.FC;
  AppFn: React.FC<any>;
  DocFn: React.FC;
}) {
  const { manifestRegistrySrc, scriptSrcs, AppFn, PageFn, DocFn } = options;
  return renderToString(
    <AtriScriptsContext.Provider
      value={{ pages: scriptSrcs, manifestRegistry: manifestRegistrySrc }}
    >
      <MainAppContext.Provider
        value={{
          App: (
            <AppFn>
              <PageFn />
            </AppFn>
          ),
        }}
      >
        <DocFn />
      </MainAppContext.Provider>
    </AtriScriptsContext.Provider>
  );
}
