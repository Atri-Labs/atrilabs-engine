export function FinalPageComponent(props: {
  PageWrapper: React.FC<any>;
  Page: React.FC<any>;
  styleStr: string;
}) {
  const { PageWrapper, Page } = props;
  return (
    <PageWrapper>
      <style>{props.styleStr}</style>
      <Page />
    </PageWrapper>
  );
}
