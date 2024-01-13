"use client";

function YouTubeEmbedVideo({ videoId }) {
  return (
    <iframe
      width="100%"
      style={{ width: "100%" }}
      // height="480"
      src={`https://www.youtube.com/embed/${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  );
}

export default YouTubeEmbedVideo;
