import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

video_id = sys.argv[1]

try:
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    texts = [chunk['text'] for chunk in transcript]
    print(json.dumps({"success": True, "transcript": " ".join(texts)}))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
