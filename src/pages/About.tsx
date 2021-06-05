import { ABOUT_MESSAGES } from '@enums/about.enum';

export default function About(props: any) {
  return (
    <div className="about-page">
      <h1 className="about-page-title">{ABOUT_MESSAGES.TITLE}</h1>
      <div className="about-page-content">{ABOUT_MESSAGES.BODY}</div>
    </div>
  );
}
