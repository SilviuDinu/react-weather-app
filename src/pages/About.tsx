import { ABOUT_MESSAGES } from '@enums/about.enum';
import { useState } from 'react';

export default function About(props: any) {
  const [source, setSource] = useState('');

  const loadAudio = (e: any, source?: any[]) => {
    const files = e ? e.target.files : source;
    console.log(files[0])
    var file = URL.createObjectURL(files[0]);
    setSource(file);
  }

  return (
    <div className="about-page">
      <h1 className="about-page-title">{ABOUT_MESSAGES.TITLE}</h1>
      <div className="about-page-content">{ABOUT_MESSAGES.BODY}</div>

      <div className="audio-wrapper">
        <div className="audio-file">
          <input id="audio_file" type="file" onChange={(e) => loadAudio(e)} accept="audio/*" />
        </div>
        <div className="audio">
          <audio src={source} controls></audio>
        </div>
      </div>

    </div>
  );
}
