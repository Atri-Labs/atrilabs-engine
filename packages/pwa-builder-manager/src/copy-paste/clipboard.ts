import { ClipboardCopyObject } from "@atrilabs/atri-app-core";
import { AnyEvent } from "@atrilabs/forest";

export async function putInClipboard(params: {
  events: AnyEvent[];
  copiedCompId: string;
}) {
  const { events, copiedCompId } = params;
  const text = JSON.stringify({
    type: "atri-copy-events",
    events,
    copiedCompId,
  });
  if (navigator && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    console.log("Copy/Paste needs navigator && navigator.clipboard");
  }
}

export async function readFromClipboard(): Promise<
  ClipboardCopyObject | undefined
> {
  if (navigator && navigator.clipboard) {
    const text = await navigator.clipboard.readText();
    try {
      const data = JSON.parse(text);
      if (
        data &&
        data.type === "atri-copy-events" &&
        data.events &&
        data.copiedCompId
      ) {
        return data;
      }
    } catch {}
  } else {
    console.log("Copy/Paste needs navigator && navigator.clipboard");
  }
}
