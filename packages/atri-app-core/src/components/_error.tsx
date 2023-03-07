/**
 *
 * @param {{statusCode: number}} props
 */
export default function (props: { statusCode: number }) {
  return <div style={{ color: "#ef4444" }}>Error: {props.statusCode}</div>;
}
