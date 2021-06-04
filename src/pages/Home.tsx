import { HOME_MESSAGES } from "../enums/home.enum";

export default function Home(props: any) {
    return (
     <div className="home-page">
         <h1>{HOME_MESSAGES.TITLE}</h1>
     </div>
    );
}
