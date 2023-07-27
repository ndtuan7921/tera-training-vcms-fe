import * as webvtt from "node-webvtt";

export function parseWebVtt(webvttContent: string) {
  const { cues } = webvtt.parse(webvttContent, (err, data) => {});

  return cues.map((cue: any) => {
    const [name, description, price, image] = cue.text.split("\n");
    return {
      startTime: cue.start,
      endTime: cue.end,
      name,
      description,
      price,
      image,
    };
  });
}
