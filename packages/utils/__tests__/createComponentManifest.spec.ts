import { createComponentManifest, reactSchemaId, iconSchemaId } from "../src";

test("createComponentManifest with just name option", () => {
  const name = "Button";
  const { manifests } = createComponentManifest({ name });
  expect(manifests).toBeDefined();
  expect(manifests[reactSchemaId]).toBeDefined();
  expect(manifests[iconSchemaId]).toBeDefined();
  expect(manifests[reactSchemaId]).toHaveProperty("meta");
  expect(manifests[reactSchemaId]["meta"]["key"]).toBe(name);
  expect(manifests[reactSchemaId]["dev"]).toBeDefined();
  expect(manifests[reactSchemaId]["dev"]["attachCallbacks"]).toBeDefined();
  expect(
    manifests[reactSchemaId]["dev"]["defaultCallbackHandlers"]
  ).toBeDefined();
  expect(manifests[reactSchemaId]["dev"]["attachProps"]).toBeDefined();
  expect(
    manifests[reactSchemaId]["dev"]["attachProps"]["styles"]
  ).toBeDefined();
  expect(
    manifests[reactSchemaId]["dev"]["attachProps"]["custom"]
  ).toBeDefined();
});

test("attach callbacks", () => {
  const name = "Button";
  const { manifests } = createComponentManifest({
    name,
    callbacks: { onClick: { updateFields: ["a", "b"] } },
  });
  expect(
    manifests[reactSchemaId]["dev"]["attachCallbacks"]["onClick"]
  ).toBeDefined();
  expect(
    manifests[reactSchemaId]["dev"]["attachCallbacks"]["onClick"][0]
  ).toBeDefined();
  expect(
    manifests[reactSchemaId]["dev"]["attachCallbacks"]["onClick"][0]["type"]
  ).toBe("controlled");
  expect(
    (manifests[reactSchemaId]["dev"]["attachCallbacks"]["onClick"][0] as any)[
      "selector"
    ]
  ).toMatchObject(["a", "b"]);
});

test("attach default callbacks", () => {
  const name = "Button";
  const { manifests } = createComponentManifest({
    name,
    callbacks: { onClick: { updateFields: ["a", "b"], sendEventData: true } },
  });
  expect(
    manifests[reactSchemaId]["dev"]["defaultCallbackHandlers"]["onClick"][0]
  ).toMatchObject({ sendEventData: true });
});
