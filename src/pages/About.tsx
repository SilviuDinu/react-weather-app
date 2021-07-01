import { ABOUT_MESSAGES } from '@enums/about.enum';

export default function About(props: any) {
  return (
    <div className="about-page">
      <h1 className="about-page-title">{ABOUT_MESSAGES.TITLE}</h1>
      <div className="about-page-content">
        <p className="disclaimer">{ABOUT_MESSAGES.LOGS}</p>
        <p>{ABOUT_MESSAGES.BODY}</p>
      </div>
    </div>
  );
}
