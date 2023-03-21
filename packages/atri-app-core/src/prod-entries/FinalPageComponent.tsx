export function FinalPageComponent(props: {
  PageWrapper: React.FC<any>;
  Page: React.FC<any>;
}) {
  const { PageWrapper, Page } = props;
  return (
    <PageWrapper>
      <Page />
    </PageWrapper>
  );
}
