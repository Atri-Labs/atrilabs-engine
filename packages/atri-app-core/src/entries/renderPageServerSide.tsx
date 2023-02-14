import { MainAppContext, AtriScriptsContext } from "@atrilabs/atri-app-core";
import { renderToString } from "react-dom/server";

export function renderPageServerSide(options: {
  scriptSrcs: string[];
  manifestRegistrySrcs: string[];
  baseSrcs: string[];
  PageFn: React.FC;
  AppFn: React.FC<any>;
  DocFn: React.FC;
}) {
  const { manifestRegistrySrcs, scriptSrcs, AppFn, PageFn, DocFn, baseSrcs } =
    options;
  return renderToString(
    <AtriScriptsContext.Provider
      value={{
        pages: scriptSrcs,
        manifestRegistry: manifestRegistrySrcs,
        base: baseSrcs,
      }}
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
