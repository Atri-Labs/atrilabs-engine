import { blue600 } from "@atrilabs/design-system";

export type ErrorInfoProps = {
  info: string;
};

export const ErrorInfo: React.FC<ErrorInfoProps> = (props) => {
  return <div>{props.info}</div>;
};

export const GenericErrorInfo = () => {
  return (
    <ErrorInfo
      info="Some error has occured. We are very sorry for this. Please contact the
    Atri Labs team at their Slack channel for help."
    />
  );
};

export const DeployCompletedInfo = () => {
  return (
    <div>
      Success! Please visit{" "}
      <a href="http://localhost:4005" style={{ color: blue600 }} target="blank">
        http://localhost:4005
      </a>{" "}
      to try out the amazing app you have built.
      <br />
      <br />
      The changes will reflect instantly everytime you press Publish next time.
    </div>
  );
};

export const MayTakeTimeInfo = () => {
  return (
    <div>
      If you are publishing your app for the first time, it may take several
      minutes to complete build.
    </div>
  );
};
