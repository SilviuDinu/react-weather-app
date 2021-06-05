import { HOME_MESSAGES } from "@enums/home.enum";

export default function Home(props: any) {
    return (
     <div className="home-page">
         <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
     </div>
    );
}
